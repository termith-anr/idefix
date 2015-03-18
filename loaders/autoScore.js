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
module.exports = function(options) {
    options = options || {};
    return function (input, submit) {


        /***********************
         ****    FUNCTIONS   ****
         ************************/


        /**
         *  Infos show any kind of informations in console about the configuration
         * @param err STRING the message to show
         * @param type STRING (error , warning , info , valid)
         * @param option STRING the option concerned
         */
        var infos = function(err,type,option) {
            switch(type) {
                case "error":
                    console.error(kuler("ERROR - Config fails on option : " + option + " - Error is : \n" + err, "#e67e22"));
                    break;

                case "warning":
                    console.warn(kuler("WARNING - Config problem on option : " + option + " , warning is : \n" + err, "#f39c12"));
                    break;

                case "info":
                    console.info(kuler("WARNING - Config problem on option : " + option + " , info is : \n" + err, "#3498db"));
                    break;

                case "valid":
                    console.log(kuler("SUCCESS - " + option + " , on  : \n" + err, "#2ecc71"));
                    break;
            }
        };

        /**
         * Check if option is send
         * @param  option {STRING} is the option to check
         * @param type {STRING}(config/options) what to check?
         * @returns {boolean}
         */
        var check = function(option,type){
            if(type === "config"){
                if(typeof(config[option]) == "undefined"){
                    infos("L'option générale n'a pas été précisée","error",option);
                    process.exit(1);
                }
            }
            if(type === "options"){
                if(typeof(options[option]) == "undefined"){
                    infos("L'option du loader n'a pas été précisée","error",option);
                    process.exit(1);
                }
            }
            return true;
        };

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
                for(var i = 0 ; i < input.pertinenceMethods.length ; i++){
                    arr.push(content.filter(function(content){
                        return (content["method"] === input.pertinenceMethods[i]);
                    }));
                }
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
                        if(options["autoSilence"] === true){
                            var path = "keywords." + getIndex(input.keywords, silence[i]["id"]) + ".score";
                            insertContent(0 , path);
                            notedSilence ++;
                        }
                        if(options["autoPertinence"] === true){
                            var path = "keywords." + getIndex(input.keywords, pertinence[j]["id"]) + ".score";
                            insertContent(2 , path);
                            notedPertinence ++;
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

        if(check("autoPertinence","options") || check("autoSilence","options")){
                var silences    = filter(input.keywords , "type" , "silence"),
                    pertinences = filter(input.keywords , "type" , "pertinence");

                silences = filter(silences, "method"); //Get an array like that => [ [M1], [M2] , ... ]
                pertinences = filter(pertinences, "method"); //Get an array like that => [ [M1], [M2] , ... ]

                //console.log(" input.pertinenceMethods.length : ", input.pertinenceMethods.length , " silences.length : " , silences.length);
                for(var i = 0 ; i < input.pertinenceMethods.length ; i++){ // Pour chaque nom de methodes
                    for( j = 0 ; j < silences.length ; j++) { // Pour chaque methode dans les silences
                        for (k = 0; k < pertinences.length; k++){ // Pour chaque méthodes dans les pertinences
                            if (silences[j][0].method === pertinences[k][0].method) { // Si les nom des méthodes des premiers objets ( déjà triés ) sont identiques
                                //totalSilence += silences[j].length;
                                //totalPertinence += pertinences[k].length;
                                var aScore = compareAndScore(silences[j],pertinences[k], "word"); // On compare chaque méthodes
                                //notedSilence += aScore[0];
                                //notedPertinence += aScore[1];
                            }
                        }
                    }
                }
                var noted = filter(input.keywords ,"score"),
                    notedSilence = filter(noted ,"type" , "silence").length,
                    allSilence = filter(input.keywords ,"type" , "silence").length,
                    notedPertinence = filter(noted ,"type" , "pertinence").length,
                    allPertinence = filter(input.keywords ,"type" , "pertinence").length;
                if(options["autoPertinence"] === true) {
                    insertContent(notedPertinence / allPertinence, "progressNotedKeywords");
                }
                if(options["autoSilence"] === true) {
                    insertContent(notedSilence / allPertinence, "progressSilenceKeywords");
                }
                console.log('Nombre de mot silences notés : ' , notedSilence , ' Nombre de mot silences totaux : ' , allSilence , ' Nombre de mot pertinence notés : ' , notedPertinence , ' Nombre de mot pertinence totaux : ' , allPertinence);
        }



        /************************
         ****   NEXT LOADER  ****
         ************************/


        submit(null, input);
    }
};