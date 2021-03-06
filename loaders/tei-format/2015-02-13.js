/**
 * Created by matthias on 26/02/15.
 * VERSION: PHASE 2 2015-02-13
 */

// Required modules
var objectPath = require('object-path'),
    sha1 = require('sha1'),
    jsonselect = require('JSONSelect'),
    _ = require('lodash');


'use strict';
module.exports = function(options,config) {
    options = options || {};
    config = config.get() || {};
    return function (input, submit) {

        // Execute this loader only for this format given in json config file
        if(config.teiFormat === "2015-02-13" && (!input.keywords)) {

            /************************
             ****   EXECUTION    ****
             ************************/

            // Si format === true : premaff sinon TEI brut
            var titleFormat = ((jsonselect.match(".titleStmt .title:has(:root > .w)" , input.content.json).length > 0) || (jsonselect.match(".titleStmt .title :has(:root > .w)" , input.content.json).length > 0)) ? true : false,
                abstractFormat =  ((jsonselect.match(".profileDesc .abstract .p:has(:root > .w)" , input.content.json).length > 0) || (jsonselect.match(".profileDesc .abstract .p :has(:root > .w)" , input.content.json).length > 0)) ? true : false,
                validatePertinence = "no",
                validateSilence = "no",
                title,
                abstract;


            if(titleFormat){
                console.info("Premaff title");
                var words = jsonselect.match('.titleStmt .title .xml#lang:val("fr") ~ .w' ,  input.content.json)[0],
                    pc    = jsonselect.match('.titleStmt .title .xml#lang:val("fr") ~ .pc' ,  input.content.json)[0];

                console.info("words : " , words , " Nom : "  , input.basename);

                var list  = words.concat(pc);// Fusion des mots + ponctuations séparés
                    
                // Loadash , trie par xml#id + retourne le mot avec espace si besoin  + jointure
                title = _.chain(list)
                      .sortBy('xml#id')
                      .map(function(chr) {
                        if(chr["wsAfter"]){
                            return chr["#text"] + " ";
                        }
                        return chr["#text"];
                      })
                      .value()
                      .join("");
                console.log("title: " , title);
            }
            else{
                console.log("TeiBrut");
                title  = jsonselect.match('.titleStmt .title .xml#lang:val("fr") ~ .#text' ,  input.content.json)[0].toString();
                console.log("title : " , title);
            }

            if(abstractFormat){
                console.log("Premaff abs");
                var words = jsonselect.match('.profileDesc .abstract .xml#lang:val("fr") ~ .p .w' ,  input.content.json)[0],
                    pc    = jsonselect.match('.profileDesc .abstract .xml#lang:val("fr") ~ .p .pc' ,  input.content.json)[0],
                    list  = words.concat(pc);// Fusion dew mots + ponctuations séparés
                // Loadash , trie par xml#id + retourne le mot avec espace si besoin  + jointure
                abstract = _.chain(list)
                      .sortBy('xml#id')
                      .map(function(chr) {
                        if(chr["wsAfter"]){
                            return chr["#text"] + " ";
                        }
                        return chr["#text"];
                      })
                      .value()
                      .join("");
                console.log("abstract: " , abstract);
            }
            else{
                console.log("TeiBrut");
                abstract = jsonselect.match('.profileDesc .abstract .xml#lang:val("fr") ~ .p > .#text' ,  input.content.json)[0].toString();
            }

            /*
             * pertinencesNames  is an array of methods names , insert in input
             * keywords is an array of  words , insert in input
             * */
            var pertinencesNames = [],
                keywords = [],
                maxScores = 0,
                minScores = 0;


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

                    //An array of id + word in the same order
                    var xmlIdWord = jsonselect.match(":root > .ns#annotations .xml#id", usefullStdf[i]),
                        word = jsonselect.match(":root > .ns#annotations .#text", usefullStdf[i]);

                    //If no  id or words missed
                    if (xmlIdWord.length === word.length) {
                        // For every id
                        for (var j = 0; j < xmlIdWord.length; j++) {

                            maxScores +=2;

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

                                minScores -=2;

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
            objectPath.ensureExists(input, "fields.maxScores", maxScores);
            objectPath.ensureExists(input, "fields.minScores", minScores);
            objectPath.ensureExists(input, "fields.currentScores", 0);

        }
        /************************
         **** NEXT LOADER ****
         ************************/
        submit(null, input);

    }
};