/**
 * Created by matthias on 02/12/14.
 * Loader get Keywords by admin
 */

var objectPath = require('object-path');
var selectJson = require('JSONSelect');


'use strict';
module.exports = function(options) {
    options = options || {};
    return function (input, submit) {

        var keywordsPath = "content.json." + options.keywordsPath; // Direct XML Path WITh dot noation

        var contentPath = objectPath.get(input ,keywordsPath);


        /*if (objectPath.has(input ,keywordsPath)){
            var contentPath = objectPath.get(input, keywordsPath); // Get Keywords content
            var inistKeywords = jsonPath.eval(contentPath, "$..keywords[?(@.scheme=='inist-francis')]"); // Get Inist Keywords
            //var inistFrKeywords = jsonPath.eval(inistKeywords, "$..[?(@.xml#lang=='fr')]"); // Get Inist  FRENCH Keywords
            var inistKeywordsFr;

            if(Array.isArray(inistKeywords)) {

                for (i = 0; i < inistKeywords.length; i++) {

                    if(inistKeywords[i]['xml#lang'] == 'fr'){
                        inistKeywordsFr = inistKeywords[i];
                    }
                }

            }

            console.log(inistKeywordsFr);

        }*/

        console.log('-------------- SCHEME CC MATCH ----------------------');

        contentPath = contentPath.filter(function (e) {
            return ((e.scheme !== "cc" ) && (e.scheme !== "author" ) && (e['xml#lang'] == "fr" ));
        });

        console.log(contentPath);


        console.log('------------- ----------------------');



        submit(null, input);

    }
};