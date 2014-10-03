var CSV = require('csv-string'),
    util = require('util'),
    pmongo = require('promised-mongo'),
    path = require('path'),
    basename = path.basename(__filename, '.js');
    sugar = require('sugar');

module.exports = function(config) {

    var coll = pmongo(config.get('connexionURI')).collection(config.get('collectionName'));

    var csvDocs = [];


    return function (req, res) {

        res.set({
            'Content-Type': 'text/csv',
            'Content-Disposition':'attachment; filename="export.csv"'
        });


        coll
        .find({ notedKeywords : {$exists : true}})
        .toArray()
        .then(function(docs) {
            if (!docs || (!docs.length)) {
                res.status(500).end();
                throw new Error('no or bad doc');
                return;
            }

            var tempDArrayDoc = [];

            docs.forEach(function(entity, index){ // Parcours chaque document : entite  = document

                var docTitle = (entity.content.json.TEI.teiHeader.fileDesc.titleStmt.title[0] != undefined) ? entity.content.json.TEI.teiHeader.fileDesc.titleStmt.title[0]['#text'] : entity.content.json.TEI.teiHeader.fileDesc.titleStmt.title['#text'];

                Object.keys(entity.notedKeywords ,function(methodName , valueMethod){

                        if( methodName != 'inist-francis' && methodName != '"inist-pascal') {

                            var action = 'Evaluation';

                            var method = methodName;

                            Object.keys(valueMethod , function(word , wordValues){
                                var currentWord = word;
                                var currentScore = wordValues.note;
                                var currentPref = wordValues.exclude ? wordValues.exclude : 'N/A';
                                var currentCorresp = wordValues.corresp ? wordValues.corresp : 'N/A';
                                res.write(CSV.stringify([docTitle , method , action , currentWord , currentScore , currentPref , currentCorresp] ,  ';'))

                            });

                        }
                        else{

                            var action = 'Silence';

                            Object.keys(valueMethod , function(methodByInistWord , valMethodByInistWord){

                                var method = methodByInistWord;

                                Object.keys(valMethodByInistWord, function(word , wordValues){

                                    var currentWord = word;
                                    var currentScore = wordValues.note;

                                    res.write(CSV.stringify([docTitle , method , action , currentWord , currentScore , 'rien', 'rien'] ,  ';'))

                                });

                            });

                        }



                });



            });

            res.end();



        });

    };


};