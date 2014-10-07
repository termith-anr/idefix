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
        .find({ notedKeywords : {$exists : true}})
        .toArray()
        .then(function(docs) {

            console
            if (!docs || (!docs.length)) {
                res.status(500).end();
                throw new Error('no or bad doc');
                return;
            }

            var tempDArrayDoc = [];

            docs.forEach(function(entity, index){ // Foreach of all docs : entity  = document


                // Get docTitle , Will need to change by custom field
                var docTitle = (entity.content.json.TEI.teiHeader.fileDesc.titleStmt.title[0] != undefined) ? entity.content.json.TEI.teiHeader.fileDesc.titleStmt.title[0]['#text'] : entity.content.json.TEI.teiHeader.fileDesc.titleStmt.title['#text'];

                res.write(CSV.stringify(['Titre' , 'Méthode' , 'Silence/Eval' , 'Mot-Clé' , 'Score' , 'Pref' , 'Corresp'] ,  ';'));

                Object.keys(entity.notedKeywords ,function(methodName , valueMethod){ // Foreach of all methods

                        if( methodName != 'inist-francis' && methodName != '"inist-pascal') {

                            var action = 'Evaluation';

                            var method = methodName;

                            Object.keys(valueMethod , function(word , wordValues){ // Foreach words
                                var currentWord = word;
                                var currentScore = wordValues.note;
                                var currentPref = wordValues.exclude ? wordValues.exclude : 'N/A';
                                var currentCorresp = wordValues.corresp ? wordValues.corresp : 'N/A';
                                res.write(CSV.stringify([docTitle , method , action , currentWord , currentScore , currentPref , currentCorresp] ,  ';'))

                            });

                        }

                        else{ // For inist method

                            var action = 'Silence';

                            Object.keys(valueMethod , function(methodByInistWord , valMethodByInistWord){ // For method by By Inist ex: inist-francis { lina-1{...} lina-2{...}}

                                var method = methodByInistWord;

                                Object.keys(valMethodByInistWord, function(word , wordValues){ // Foreach words

                                    var currentWord = word;
                                    var currentScore = wordValues.note;

                                    res.write(CSV.stringify([docTitle , method , action , currentWord , currentScore , 'rien', 'rien'] ,  ';'))

                                });

                            });

                        }



                });



            });

            res.end(); // Stop writting csv after all docs.



        });

    };


};