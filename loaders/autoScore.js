/**
 *
 * Created by matthias on 14/11/14.
 * Loader to build auto-score
 *
 */

var objectPath = require('object-path');


'use strict';
module.exports = function(options) {
    options = options || {};
    return function (input, submit) {


            if ((input.keywords['eval']) && (input.keywords['silence']) && options.autoScore == true) {

                var nbNotedEval     = 0,
                    nbNotedSilence  = 0,
                    nbTotalEval     = 0,
                    nbTotalSilence       = ((input.keywords['silence']).length) * (input.keywords['silence'][0]['size']);


                Object.keys((input.keywords['eval']), function (index, valueEval) { // For all Eval methods

                    var nbMethod = index;
                    nbTotalEval += valueEval['size'];

                    Object.keys(valueEval.term, function (index, wordEval) { // For all eval's word

                        var nbEvalWord= index;

                        Object.keys((input.keywords['silence'][0].term) , function(index , wordSilence){ // For all Silence words

                            var nbSilence = index;

                            if((wordEval['#text'].toUpperCase()) === (wordSilence['#text'].toUpperCase())) {

                                if(options.autoSilence) { // Auto Note Silence if option is on "TRUE"

                                    for (i = 0; i < ((input.keywords['silence'])).length; i++) { // Note all Silence Array

                                        input.keywords.silence[i].term[nbSilence].score = 0;

                                        nbNotedSilence++;

                                        console.log(' POUR CHAQUE : nbTotalSilence'  , nbNotedSilence);
                                    }
                                }

                                if(options.autoEval) { // Auto Note Eval if option is on "TRUE"
                                    input.keywords.eval[nbMethod].term[nbEvalWord].score = 2;
                                    nbNotedEval++;
                                }


                            }
                        });

                    });

                });

                // Now make the calcul for progress on load

                if((options.autoEval) && (nbTotalEval !== 0)){input.progressNotedKeywords = (nbNotedEval / nbTotalEval);}
                if((options.autoSilence) && (nbTotalSilence !== 0)){input.progressSilenceKeywords = (nbNotedSilence / nbTotalSilence);}

            }



        submit(null, input);
    }
};