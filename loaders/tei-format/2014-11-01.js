/**
 * Created by matthias on 01/11/201.
 * VERSION: PHASE 1 (2014-11-01)
 */

// Required modules
var objectPath = require('object-path'),
    kuler      = require('kuler');

'use strict';
module.exports = function(options, config) {
    options = options || {};
    config  = config.get();
    return function (input, submit) {

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

        var getContent = function(key,path){
            var content ;
            if(key === "pathPertinence"){
                content = objectPath.get(path);
            }
            if(key === "pathSilence"){
                content = objectPath.get(path);
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

        if(check("pathPertinence") && check("pathSilence")){

        }





        submit(null, input);
    }
};