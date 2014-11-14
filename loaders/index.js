/**
 * Created by matthias on 14/11/14.
 */
'use strict';
module.exports = function(options) {
    options = options || {};
    return function (input, submit) {

        if(input.content.json.TEI.teiHeader.profileDesc.textClass.keywords){
            var arrayMethodsKeywords = [];
            Object.keys((input.content.json.TEI.teiHeader.profileDesc.textClass.keywords) , function(methodName , valueMethod){
                if( (valueMethod.scheme != 'inist-francis') && (valueMethod.scheme != 'inist-pascal') && (valueMethod.scheme != 'cc') && (valueMethod.scheme != 'author')) {
                     var interArrayMethodsKeywords = [];

                     Object.keys(valueMethod.term , function( wordNb , wordValue){
                         interArrayMethodsKeywords.push(wordValue['#text']);
                     });

                    arrayMethodsKeywords.push(interArrayMethodsKeywords);

                    console.log('---------------------------');
                }

            });
            console.log(arrayMethodsKeywords);
        }
        submit(null, input);
    }
}