/**
 * Export will need refact code NEARLY ! 15/10
 */


var CSV = require('csv-string'),
    pmongo = require('promised-mongo'),
    sugar = require('sugar');

module.exports = function(config) {

    var coll = pmongo(config.get('connexionURI')).collection(config.get('collectionName'));

    var csvDocs = [];


    return function (req, res) {

        // Set csv header
        res.set({
            'Content-Type': 'text/csv',
            'Content-Disposition':'attachment; filename="export.csv"'
        });

        // Get mongodb files wich contain scores
        coll
        .find({ keywords : {$exists : true}})
        .toArray()
        .then(function(docs) {

            console
            if (!docs || (!docs.length)) {
                res.status(500).end();
                throw new Error('no or bad doc');
                return;
            }

            var tempDArrayDoc = [];

                res.write(CSV.stringify(['Nom Fichier', 'Titre' , 'Méthode' , 'Evaluation' , 'Mot-Clé' , 'Score' , 'Pref-Termith' , 'Corresp-termith' , 'Commentaire' , 'temps' , 'temps/mot'] ,  ';'));


                docs.forEach(function(entity, index){ // Foreach of all docs : entity  = document


                var docTitle  = (entity.fields.title != undefined) ? entity.fields.title : 'Pas de titre de document',
                    fileTitle = entity.basename,
                    timeMs = entity.timeJob,
                    time      = entity.timeJob  ? (Math.floor(((entity.timeJob) / (60 * 1000)) % 60) + "Mn " + Math.floor(((entity.timeJob) / 1000) % 60) + "s" ): "-",
                    nbOfNotedWords = 0;


                //Bellow :  get the median/Middle time spend on each word
                Object.keys(entity.keywords.eval ,function(methodNb , valueMethod){
                        nbOfNotedWords += Object.keys(valueMethod.term).filter(function(content){
                            return ( (content.score != undefined) && (content.score != null) && (content.score != '') );
                        }).length;
                });

                var middleTime =  (timeMs/nbOfNotedWords)  ? (Math.floor(( parseFloat(timeMs/nbOfNotedWords) / (60 * 1000)) % 60) + "Mn " + Math.floor(( parseFloat(timeMs/nbOfNotedWords) / 1000) % 60) + "s" ) : 0;


                //Below Start generating & wrtting csv Lines
                Object.keys(entity.keywords ,function(methodName , valueMethod){ // Foreach of all methods

                        if( methodName == 'eval') {

                            var action = 'Pertinence',
                                method = methodName;


                            Object.keys(valueMethod , function(nbEval , contentEval){ // Foreach Array

                                var scheme = contentEval.scheme;

                                Object.keys(contentEval.term , function(nbWord , wordValues){ // Foreach words
                                    var currentWord = wordValues['#text'],
                                        currentScore = wordValues.score ? wordValues.score : null,
                                        currentPref = wordValues.exclude ? wordValues.exclude : ' ',
                                        comment = wordValues.commentaire ? wordValues.commentaire  : '';

                                    if(currentScore) {
                                        console.log(' fileTitle ' , fileTitle , ' docTitle ' , docTitle , ' scheme ' , scheme ,' action ' , action , ' currentWord ' , currentWord , ' currentScore ' , currentScore ,' currentPref ' , currentPref , '-' , ' comment ' ,comment, ' time ' ,time, ' middleTime ', middleTime);
                                        res.write(CSV.stringify([ fileTitle , docTitle , scheme , action , currentWord , currentScore , currentPref , '-' , comment , time , middleTime ], ';'))
                                    }

                                });

                            });

                        }

                        else{ // For inist method

                            var action = 'Silence';

                            Object.keys(valueMethod , function(methodByInistWord , valMethodByInistWord){ // For method by By Inist ex: inist-francis { lina-1{...} lina-2{...}}

                                var method = methodByInistWord;

                                Object.keys(valMethodByInistWord, function(word , wordValues){ // Foreach words

                                    var currentWord = word;
                                    var currentScore = wordValues.note;
                                    var currentCorresp = wordValues.corresp ? wordValues.corresp : ' ';
                                    var comment = wordValues.commentaire;

                                    res.write(CSV.stringify([ fileTitle , docTitle , method , action , currentWord , currentScore , '-', currentCorresp ,  comment , time , middleTime] ,  ';'))

                                });

                            });

                        }



                });



            });

            res.end(); // Stop writting csv after all docs.



        });

    };


};