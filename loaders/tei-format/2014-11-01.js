/**
 * Created by matthias on 01/11/201.
 * VERSION: PHASE 1 (2014-11-01)
 */

        /************************
         ****    MODULES     ****
         ************************/

var objectPath = require('object-path'),
    kuler      = require('kuler'),
    sha1       = require('sha1');

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

        var getMethodsNames = function(content){
            var arr = [];
            for(var i=0 ; i < content.length ; i++){
                arr.push(content[i].scheme);
            }
            return arr;
        };

        var formContent = function(content,type,methodsName){
            var arr = [];
            if(type === "pertinence") {
                //console.log('content ' , content);
                for(var i= 0 ; i < content.length ; i++){
                    var methodName = content[i].scheme.toString();
                    //console.log(methodName);
                    for(var key in content[i].term){
                        var word        = content[i].term[key]['#text'].toString(),
                            id          = sha1(type+methodName+word),
                            objectWord  = {id : id , type : type , method : methodName , word : word};
                        //console.log(objectWord);
                        arr.push(objectWord);
                    }
                }
                return arr;
            }
            if(type === "silence") {
                for(var i = 0 ; i < content[0].term.length ; i++){ // Pour chaque mot
                    //console.log(' MOT N° : '  , i);
                    for(var j= 0 ; j < methodsName.length ; j++) { // Pour chaque méthode
                        //console.log(' METHODE N° ' ,  j );
                        var word = content[0].term[i]['#text'].toString(),
                            id = sha1(type + methodsName[j] + word),
                            objectWord = {id: id, type: type, method: methodsName[j], word: word};
                        arr.push(objectWord);
                    }
                }
                return arr;
            }
        };

        var insertContent = function(content , path){
            objectPath.ensureExists(input, path, content);
        };


        /************************
         ****   EXECUTION    ****
         ************************/

        if(check("pathPertinence") && check("pathSilence")){
            var pertinence = getContent("pertinence", config.pathPertinence),
                pertinence = filterContent(pertinence,"pertinence"),
                silence    = getContent("silence", config.pathSilence),
                silence    = filterContent(silence,"silence");


            var arrPertinence              = formContent(pertinence, "pertinence"),
                pertinenceMethods          = getMethodsNames(pertinence),
                arrSilence                 = formContent(silence, "silence" , pertinenceMethods),
                listOfKeywords             = arrPertinence.concat(arrSilence);
            //console.log(listOfKeywords);
            //console.log("--------------------------------\n");

            insertContent(listOfKeywords,"keywords");
        }


        submit(null, input);
    }
};