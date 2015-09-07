/**
 * Created by matthias on 26/02/15.
 * VERSION: Scenario 1
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
        if(config.teiFormat === "scenario1") {

            /************************
             ****   EXECUTION    ****
             ************************/

                var words = (jsonselect.match('.titleStmt .title :has(:root > .type:val("main")) .w' ,  input.content.json)).length > 0 ? jsonselect.match('.titleStmt .title :has(:root > .type:val("main")) .w' ,  input.content.json) : jsonselect.match('.titleStmt .title .w' ,  input.content.json) ,
                    pc    = (jsonselect.match('.titleStmt .title :has(:root > .type:val("main")) .pc' ,  input.content.json)).length > 0 ? jsonselect.match('.titleStmt .title :has(:root > .type:val("main")) .pc' ,  input.content.json) : jsonselect.match('.titleStmt .title .pc' ,  input.content.json),
                    title;

                console.info(" Nom : "  , input.basename);

                var list  = [];

                for(var i = 0 ; i < words.length ; i++){
                    if(words[i] instanceof Array){
                        list = list.concat(words[i]);// Fusion des mots + ponctuations séparés
                    }
                    else if (words[i] instanceof Object){
                        list.push(words[i]);
                    }
                }
                for(var j = 0 ; j < pc.length ; j++){
                    if(pc[j] instanceof Array){
                        list = list.concat(pc[j]);// Fusion des mots + ponctuations séparés
                    }
                    else if (pc[j] instanceof Object){
                        list.push(pc[j]);
                    }
                }

                //console.info("list : " , list);
                    
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
                console.info("title: " , title);
            

            // ADD title to input
            objectPath.ensureExists(input, "fields.title", title);

        }
        /************************
         **** NEXT LOADER ****
         ************************/
        submit(null, input);

    }
};