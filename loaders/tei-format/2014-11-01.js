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
    return function (input, submit) {
        //if(config.keywordsSilencePath && config.keywordsEvalPath) {

            // XML path with dot notation for silence/ pertinence
            var silencePath     = "content.json." + config.silencePath,
                pertinencePath  = "content.json." + options.pertinencePath;


        //}

        var errConfig = function(err,option) {
            console.error(kuler("WARNING - Config problem on option : " + option + " , error is : \n" + err , "red"))
        };
        submit(null, input);
    }
};