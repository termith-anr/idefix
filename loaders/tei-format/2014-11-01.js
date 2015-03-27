/**
 * Created by matthias on 01/11/201.
 * VERSION: PHASE 1 (2014-11-01)
 */


/************************
 **** MODULES ****
 ************************/


var objectPath = require('object-path'),
    kuler = require('kuler'),
    sha1 = require('sha1'),
    jsonselect = require('JSONSelect');


'use strict';
module.exports = function(options, config) {
    options = options || {};
    config = config.get();
    return function (input, submit) {

        // Execute this loader only for this format given in json config file
        if(config.teiFormat === "2014-11-01") {

            /************************
             ****   EXECUTION    ****
             ************************/

            //
            var title = jsonselect.match(".titleStmt .title .#text" , input.content.json) ? jsonselect.match(".titleStmt .title .#text" ,  input.content.json)[0].toString() : null,
                abstract = jsonselect.match(".profileDesc .abstract .#text" , input.content.json) ? jsonselect.match(".profileDesc .abstract .#text" ,  input.content.json)[0].toString() : null,
                validatePertinence = "no",
                validateSilence = "no";

            /*
             * pertinencesNames  is an array of methods names , insert in input
             * keywords is an array of  words , insert in input
             * */
            var pertinencesNames = [],
                keywords = [];

            jsonselect.forEach(".keywords:only-child", input.content.json, function (element) {

                // return only pertinences
                var pertinences = element.filter(function (content) {
                    return ((content.scheme !== "inist-francis" ) && (content.scheme !== "inist-pascal" ) && (content.scheme !== "cc" ) && (content.scheme !== "author" ) && (content['xml#lang'] == "fr" ) );
                });
                // return only silences
                var silences = element.filter(function (content) {
                    return (((content.scheme == "inist-francis" ) || (content.scheme == "inist-pascal" )) && ((content['xml#lang'] == "fr" )));
                });

                pertinencesNames = jsonselect.match(".scheme", pertinences);

                /*
                 * Create pertinences objects
                 * */
                jsonselect.forEach(":has(:root > .term)", pertinences, function (terms) {

                    //current pertinence method
                    var methodName = terms.scheme;

                    // For every #text keywords
                    jsonselect.forEach(".#text", terms, function (word) {

                        // Create uniq id
                        var id = sha1("pertinence" + methodName + word);

                        //Create object word
                        var obj = {
                            "id": id,
                            "type": "pertinence",
                            "method": methodName,
                            "word": word
                        };

                        // Add object to keywords master array
                        keywords.push(obj);

                    });

                });

                /*
                 * Create Silence Objects
                 * */

                jsonselect.forEach(":has(:root > .term)", silences, function (terms) {

                    //For every pertinences methods name :
                    // multiply X silences word BY  Y number of pertinence methods
                    for (var i = 0; i < pertinencesNames.length; i++) {

                        // Current pertinence method
                        var methodName = pertinencesNames[i];

                        // For every #text keywords
                        jsonselect.forEach(".#text", terms, function (word) {

                            //Create uniq ID
                            var id = sha1("silence" + methodName + word);

                            var obj = {
                                "id": id,
                                "type": "silence",
                                "method": methodName,
                                "word": word
                            };

                            // Add object to keywords master array
                            keywords.push(obj);

                        });

                    }
                });

            });

            // ADD Keywords master array & pertinences methods names to input
            objectPath.ensureExists(input, "keywords", keywords);
            objectPath.ensureExists(input, "pertinenceMethods", pertinencesNames);
            objectPath.ensureExists(input, "fields.title", title);
            objectPath.ensureExists(input, "fields.abstract", abstract);
            objectPath.ensureExists(input, "fields.validatePertinence", validatePertinence);
            objectPath.ensureExists(input, "fields.validateSilence", validateSilence);

        }
        /************************
         **** NEXT LOADER ****
         ************************/
        submit(null, input);
    }
};