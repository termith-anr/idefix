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

        var filter = function(content,by,what){
            if(by === "method"){
                //console.log('combien de méthodes ????? ' , input.pertinenceMethods.length);
                var arr = [];
                for(var i = 0 ; i < input.pertinenceMethods.length ; i++){
                    arr.push(content.filter(function(content){
                        return (content["method"] === input.pertinenceMethods[i]);
                    }));
                }
                return arr;
                //console.log('tableau trié : ' , arr);
            }
            if(by === "type"){
                return content.filter(function(content){
                    return (content["type"] === what);
                });
            }
        };

        var compare = function(element1, element2, by){
            for(var i = 0 ; i < element1.length ; i++){
                for(var j = 0 ; j < element2.length ; j++){
                    if(element1[i][by].toUpperCase() === element2[j][by].toUpperCase()){
                        console.log('Element identiques : ' , element1[i]["word"] , "  id : " , element1[i]["id"] , " / " ,  element2[j]["word"] , "  id  : " ,  element2[j]["id"]);
                    }
                }
            }
        };

        var score = function(){

        };

        /**
         * insertContent in the flux to mongo then
         * @param content {*} what to insert
         * @param path {STRING} where to insert
         */
        var insertContent = function(content , path){
            objectPath.ensureExists(input, path, content);
        };



        /************************
         ****   EXECUTION    ****
         ************************/

        if(check("autoScore","options") && check("autoEval","options") && check("autoSilence","options")){
            if(options.autoScore === true){ // loader enable
                var silences    = filter(input.keywords , "type" , "silence"),
                    pertinences = filter(input.keywords , "type" , "pertinence");

                silences = filter(silences, "method"); //Get an array like that => [ [M1], [M2] , ... ]
                pertinences = filter(pertinences, "method"); //Get an array like that => [ [M1], [M2] , ... ]

                //console.log(" input.pertinenceMethods.length : ", input.pertinenceMethods.length , " silences.length : " , silences.length);
                for(var i = 0 ; i < input.pertinenceMethods.length ; i++){ // Pour chaque nom de methods
                    for( j = 0 ; j < silences.length ; j++) { // Pour chaque methodes dans les silences
                        for (k = 0; k < pertinences.length; k++){
                            if (silences[j][0].method === pertinences[k][0].method) {
                                //console.log(" Nom de méthode n°" , k , " et methode de silence n° " , j);
                                //console.log(pertinences[k] , " / " , silences[j]);

                                //comparer les mots
                                compare(silences[j],pertinences[k], "word");
                            }
                        }
                    }
                }

                console.log('FIN DE AUTOSCORE DUN FICHIER');
            }
        }
        submit(null, input);
    }
};