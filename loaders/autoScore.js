/**
 *
 * Created by matthias on 14/11/14.
 * Updated at 03/03/2015
 * Loader auto-score
 *
 */

/************************
 ****    MODULES     ****
 ************************/


var objectPath = require('object-path'),
    kuler      = require('kuler');


'use strict';
module.exports = function(options,config) {
    options = options || {};
    config = config.get();
    return function (input, submit) {


        /***********************
         ****    FUNCTIONS   ****
         ************************/

        /**
         *  GetIndex of an object in an array , filter by ID
         * @param arr {ARRAY}
         * @param value {STRING}
         * @returns {*}
         */
        var getIndex = function(arr,value){
            return arr.map(function(x) {
                return x.id;
            })
                .indexOf(value);
        };

        /**
         *
         * @param content  {ARRAY}
         * @param by {STRING} methode / type
         * @param what {STRING} the value to filter if type is is in by , ex type === method / silence
         * @returns {*}
         */
        var filter = function(content,by,what){
            if(by === "method"){
                    var arr = [];
                    for (var i = 0; i < input.pertinenceMethods.length; i++) {
                        arr.push(content.filter(function (content) {
                            return (content["method"] === input.pertinenceMethods[i]);
                        }));
                    }
                    //console.log("arr : " , arr);
                    return arr;
            }
            if(by === "type"){
                return content.filter(function(content){
                    return (content["type"] === what);
                });
            }
            if(by === "score"){
                return content.filter(function(content){
                    return (content["score"] || content["score"] === 0);
                });
            }

        };

        /**
         * compareAndScore , is the compartive & Scoring function
         * @param silence {ARRAY} of objects
         * @param pertinence {ARRAY} of objects
         * @param by {STRING} which info to compare ? ex :word
         */
        var compareAndScore = function(silence, pertinence, by){
            var notedSilence = 0,
                notedPertinence = 0;

            for(var i = 0 ; i < silence.length ; i++){ // Pour chaque Object silence contenant un mot
                for(var j = 0 ; j < pertinence.length ; j++){ // Pour chaque Pertinence contenant un mot
                    if(silence[i][by].toUpperCase() === pertinence[j][by].toUpperCase()){
                        if(autoPertinence === true){
                            var path = "keywords." + getIndex(input.keywords, pertinence[j]["id"]) + ".score";
                            insertContent(2 , path);
                            notedPertinence ++;

                        }
                        if(autoSilence === true){
                            var path = "keywords." + getIndex(input.keywords, silence[i]["id"]) + ".score";
                            insertContent(0 , path);
                            var corresp = "keywords." + getIndex(input.keywords, silence[i]["id"]) + ".correspondance";
                            insertContent(pertinence[j]["word"] , corresp);
                            var correspID = "keywords." + getIndex(input.keywords, silence[i]["id"]) + ".idCorrespondance";
                            insertContent(pertinence[j]["xml#id"] , correspID);
                            var correspLie = "keywords." + getIndex(input.keywords, pertinence[j]["id"]) + ".isCorrespondanceOf";
                            insertContent(silence[i]["xml#id"] , correspLie);
                            notedSilence ++;
                        }
                    }
                }
            }
            return [notedSilence,notedPertinence];
        };

        /**
         * insertContent in the flux to mongo at the end
         * @param content {*} what to insert
         * @param path {STRING} where to insert
         */
        var insertContent = function(content , path){
            objectPath.ensureExists(input, path, content);
        };



        /************************
         ****   EXECUTION    ****
         ************************/

        if(input.keywords){
            var silences = filter(input.keywords, "type", "silence"),
                pertinences = filter(input.keywords, "type", "pertinence");

            var autoPertinence = config.hasOwnProperty("autoPertinence") ? config["autoPertinence"] : true,
                autoSilence = config.hasOwnProperty("autoSilence") ? config["autoSilence"] : true;

            if (silences.length > 0 && pertinences.length > 0) {

                silences = filter(silences, "method"); //Get an array like that => [ [M1], [M2] , ... ]
                pertinences = filter(pertinences, "method"); //Get an array like that => [ [M1], [M2] , ... ]

                for (var i = 0; i < input.pertinenceMethods.length; i++) { // Pour chaque nom de methodes
                    for (j = 0; j < silences.length; j++) { // Pour chaque methode dans les silences
                        for (k = 0; k < pertinences.length; k++) { // Pour chaque méthodes dans les pertinences
                            if ((silences[j][0].method === pertinences[k][0].method) && (silences[j][0].method === input.pertinenceMethods[i])) { // Si les nom des méthodes des premiers objets ( déjà triés ) sont identiques

                                var aScore = compareAndScore(silences[j], pertinences[k], "word"); // On compare chaque méthodes

                            }
                        }
                    }
                }
                var noted = filter(input.keywords, "score"),
                    notedSilence = filter(noted, "type", "silence").length,
                    allSilence = filter(input.keywords, "type", "silence").length,
                    notedPertinence = filter(noted, "type", "pertinence").length,
                    allPertinence = filter(input.keywords, "type", "pertinence").length;
                if (autoPertinence === true) {
                    insertContent(notedPertinence / allPertinence, "progressNotedKeywords");
                }
                if (autoSilence === true) {
                    insertContent(notedSilence / allSilence, "progressSilenceKeywords");
                }
                //console.log('Nombre de mot silences notés : ', notedSilence, ' Nombre de mot silences totaux : ', allSilence, ' Nombre de mot pertinence notés : ', notedPertinence, ' Nombre de mot pertinence totaux : ', allPertinence);

            }
        }


        /************************
         ****   NEXT LOADER  ****
         ************************/


        submit(null, input);
    }
};