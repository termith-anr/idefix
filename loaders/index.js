/**
 * Created by matthias on 14/11/14.
 */
'use strict';
module.exports = function(options) {
    options = options || {};
    return function (input, submit) {

        if(input.content.json.TEI.teiHeader.profileDesc.textClass.keywords){
            var arrayMethodsKeywords = [],
                arrayInistKeywords = [];
            Object.keys((input.content.json.TEI.teiHeader.profileDesc.textClass.keywords) , function(index , valueMethod){
                if( (valueMethod.scheme != 'inist-francis') && (valueMethod.scheme != 'inist-pascal') && (valueMethod.scheme != 'cc') && (valueMethod.scheme != 'author') && (valueMethod['xml#lang'] == 'fr')) {
                     var interArrayMethodsKeywords = [];

                     Object.keys(valueMethod.term , function( wordNb , wordValue){
                         interArrayMethodsKeywords.push(wordValue['#text']);
                     });

                    arrayMethodsKeywords[valueMethod.scheme]=(interArrayMethodsKeywords);

                }

                else if( ((valueMethod.scheme == 'inist-francis') || (valueMethod.scheme == 'inist-pascal')) && valueMethod['xml#lang'] == 'fr') {

                    Object.keys(valueMethod.term , function( wordNb , wordValue){
                        arrayInistKeywords.push(wordValue['#text']);
                    });

                }


            });

            Object.keys(arrayMethodsKeywords , function( idArray , value){
                var listOfMetKw = value;
                Object.keys(listOfMetKw , function( idMtWord , valueW){
                    var methodWord = valueW;
                    Object.keys(arrayInistKeywords , function( idInist , valueInist){
                        if(valueW.toUpperCase() == valueInist.toUpperCase()){

                            //console.log( 'NOM :', idArray,  'methode : ' , valueW , ' -  Valeur Inist : ' , valueInist);

                            // SI noted K n'existe PAS
                            if((input.notedKeywords == undefined) || (input.notedKeywords == null)){

                                input.notedKeywords = {};
                                input.notedKeywords[idArray] = {};
                                input.notedKeywords[idArray][methodWord] = {
                                    "note": 2
                                };

                            }
                            // SI noted K EXISTE
                            else{

                                // SI La methode N4EXISTE PAS
                                if((input.notedKeywords[idArray] == undefined) || (input.notedKeywords[idArray] == null)) {
                                    input.notedKeywords[idArray] = {};
                                    input.notedKeywords[idArray][methodWord] = {
                                        "note": 2
                                    };
                                }
                                // SI La methode existe
                                else{
                                    input.notedKeywords[idArray][methodWord] = {
                                        "note": 2
                                    };
                                }

                            }




                        }

                    });
                });
            });

            console.log(input.notedKeywords);



        }
        submit(null, input);
    }
}