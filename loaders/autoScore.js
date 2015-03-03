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


var objectPath = require('object-path');


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
         * @param option is the option to check
         * @returns {boolean}
         */
        var check = function(option,type){
            if(!config[option]){
                infos("L'option n'a pas été précisée","error",option);
                process.exit(1);
            }
            return true;
        };


        /************************
         ****   EXECUTION    ****
         ************************/

        if(check("pathPertinence") && check("pathSilence")){

        }
        submit(null, input);
    }
};