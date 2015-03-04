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

        /************************
         ****   EXECUTION    ****
         ************************/

        if(check("autoScore","options") && check("autoEval","options") && check("autoSilence","options")){
            if(options.autoScore === true){ // loader enable
                var silences    = filter(input.keywords , "type" , "silence"),
                    pertinences = filter(input.keywords , "type" , "pertinence");

                silences = filter(silences, "method");
                pertinences = filter(pertinences, "method");
            }
        }
        submit(null, input);
    }
};