/**
 * Created by matthias on 26/02/15.
 * VERSION: PHASE 2 2015-02-13
 */

// Required modules
var objectPath = require('object-path'),
    sha1 = require('sha1'),
    jsonselect = require('JSONSelect');


'use strict';
module.exports = function(options,config) {
    options = options || {};
    config = config.get() || {};
    return function (input, submit) {


        // Execute this loader only for this format given in json config file
        if(config.teiFormat === "2015-02-13") {

            /************************
             ****   EXECUTION    ****
             ************************/


            // Create Idefix fields
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


            /*
             * CREATING PERTINENCES
             */
            jsonselect.forEach(".TEI > .ns#stdf", input.content.json, function (element) { //For every ns#stdf
                var usefullStdf = element.filter(function (content) { // Keep only stdf with a method ID
                    return (content['xml#id'] && content['xml#id'].indexOf('mi') >= 0);
                });

                // For every array methods
                for (var i = 0; i < usefullStdf.length; i++) {

                    //id Pertinence method
                    var mix = usefullStdf[i]['xml#id'];

                    //name Pertinence method
                    var methodName = jsonselect.match(":root > .ns#soHeader .appInfo  .ident", usefullStdf[i])[0];

                    // add methodName to ana array
                    pertinencesNames.push(methodName);

                    console.log(" mix : ", mix, " nom : ", methodName);

                    //An array of id + word in the same order
                    var xmlIdWord = jsonselect.match(":root > .ns#annotations .xml#id", usefullStdf[i]),
                        word = jsonselect.match(":root > .ns#annotations .#text", usefullStdf[i]);

                    //If no  id or words missed
                    if (xmlIdWord.length === word.length) {
                        // For every id
                        for (var j = 0; j < xmlIdWord.length; j++) {

                            // Create uniq id
                            var id = sha1("pertinence" + mix + methodName + word[j]);

                            //Create object word
                            var obj = {
                                "id": id,
                                "type": "pertinence",
                                "methodId": mix,
                                "method": methodName,
                                "xml#id": xmlIdWord[j],
                                "word": word[j]
                            };

                            // Add object to keywords master array
                            keywords.push(obj);
                        }
                    }

                    //console.log("id : " , xmlIdWord , "\n" , " word : " , word);
                }

            });

            /*
             * CREATING SILENCES
             */
            jsonselect.forEach(".TEI > .teiHeader .keywords", input.content.json, function (element) {

                // return only silences
                var silences = element.filter(function (content) {
                    return (((content.scheme == "inist-francis" ) || (content.scheme == "inist-pascal" )) && ((content['xml#lang'] == "fr" )));
                });

                jsonselect.forEach(":has(:root > .term)", silences, function (terms) {

                    //For every pertinences methods name :
                    // multiply X silences word BY  Y number of pertinence methods
                    for (var i = 0; i < pertinencesNames.length; i++) {

                        var mix = "mi" + (i+1);

                        // Current pertinence method
                        var methodName = pertinencesNames[i];

                        var xmlIdWord = jsonselect.match(".xml#id", terms);
                        var word = jsonselect.match(".#text", terms);

                        if (xmlIdWord.length === word.length) {
                            for (var j = 0; j < xmlIdWord.length; j++) {
                                // Create uniq id
                                var id = sha1("silence" + methodName + word[j]);

                                //Create object word
                                var obj = {
                                    "id": id,
                                    "type": "silence",
                                    "method": methodName,
                                    "methodId": mix,
                                    "xml#id": xmlIdWord[j],
                                    "word": word[j]
                                };

                                // Add object to keywords master array
                                keywords.push(obj);
                            }
                        }

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