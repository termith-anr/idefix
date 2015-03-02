/**
 * Created by matthias on 01/11/201.
 * VERSION: PHASE 1 (2014-11-01)
 */

        /************************
         ****    MODULES     ****
         ************************/

var objectPath = require('object-path'),
    kuler      = require('kuler');

'use strict';
module.exports = function(options, config) {
    options = options || {};
    config  = config.get();
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
         * @param option is the option to check
         * @returns {boolean}
         */
        var check = function(option){
            if(!config[option]){
                infos("L'option n'a pas été précisée","error",option);
                process.exit(1);
            }
            return true;
        };

        var getContent = function(key,path){
            var content;
            path = "content.json." +path;
            if(key === "pertinence"){
                content = objectPath.get(input , path);
            }
            if(key === "silence"){
                content = objectPath.get(input ,path);
            }
            return content;
        };

        var filterContent = function(content , type){
            if(type === "pertinence") {
                return content.filter(function(content){
                    return ((content.scheme !== "inist-francis" ) && (content.scheme !== "inist-pascal" ) && (content.scheme !== "cc" ) && (content.scheme !== "author" ) && (content['xml#lang'] == "fr" ) );
                });
            }
            if(type === "silence"){
                return content.filter(function(content) {
                    return (((content.scheme == "inist-francis" ) || (content.scheme == "inist-pascal" )) && ((content['xml#lang'] == "fr" )));
                });
            }
        };

        var formContent = function(content,type,arr){
            if(type === "pertinence") {
                console.log('content ' , content.term);
                /*for(var i= 0 ; i < content.term.length ; i++){
                    console.log(content.term[i]);
                }*/
            }
            if(type === "silence") {

            }
        };

        var insertContent = function(content , path){
            objectPath.ensureExists(input, path, content);
        };


        /************************
         ****   EXECUTION    ****
         ************************/

        if(check("pathPertinence") && check("pathSilence")){
            var pertinence = getContent("pertinence", config.pathPertinence);
            pertinence = filterContent(pertinence,"pertinence");

            var arr = [];
            arr = formContent(pertinence, "pertinence" ,arr);
        }


        submit(null, input);
    }
};