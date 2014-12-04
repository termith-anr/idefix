/**
 * Created by matthias on 02/12/14.
 * Loader get Keywords by admin
 */

var objectPath = require('object-path');

'use strict';
module.exports = function(options) {
    options = options || {};
    return function (input, submit) {

        var keywordsSilencePath = "content.json." + options.keywordsSilencePath, // Direct XML Path WITh dot notation silence
            keywordsEvalPath = "content.json." + options.keywordsEvalPath; // Direct XML Path WITh dot notation eval


        /*
         * getContent() get content of path in input
         * input (obj)
         * path (string )
         */
        var getContent = function(path , method){

            var filter;

            if(method == 'silence'){
                filter = function (content) {
                    return (((content.scheme == "inist-francis" ) ||  (content.scheme == "inist-pascal" )) && ((content['xml#lang'] == "fr" )));
                };
            }
            else if (method == 'eval'){
                filter = function (content) {
                    return ((content.scheme !== "inist-francis" ) &&  (content.scheme !== "inist-pascal" ) && (content.scheme !== "cc" ) && (content.scheme !== "author" ) && (content['xml#lang'] == "fr" ) );
                };
            }


            return objectPath.get(input ,path).filter(filter);

        };



        /*
         * insertKeywords() add content in input
         * input (obj)
         * path (string )
         * content (obj , string , array or number)
         */
        var insertKeywords = function(path , content){

            objectPath.ensureExists(input , path , content);

        };


        insertKeywords( 'keywords.silence'  ,getContent(keywordsSilencePath , 'silence'));
        insertKeywords( 'keywords.eval'     ,getContent(keywordsEvalPath , 'eval'));


        submit(null, input);

    }
};