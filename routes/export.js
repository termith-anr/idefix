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


         coll
        .find({ notedKeywords : {$exists : true}})
        .toArray()
        .then(function(docs) {
            if (!docs) {
                console.log('Bad Doc');
                return;
            }
            docs.forEach(function(entity, index){
                var docTitle = (entity.content.json.TEI.teiHeader.fileDesc.titleStmt.title[0] != undefined) ? entity.content.json.TEI.teiHeader.fileDesc.titleStmt.title[0]['#text'] : entity.content.json.TEI.teiHeader.fileDesc.titleStmt.title['#text'];
                var tempDArrayDoc = [];

                Object.keys(entity.notedKeywords ,function(methodName , valueMethod){
                    if( methodName != 'inist-francis' && methodName != '"inist-pascal') {
                        var method = methodName;

                        Object.keys(valueMethod , function(word , wordValues){
                            currentWord = word;
                            tempDArrayDoc.push([docTitle , methodName , word]);
                        })
                    }

                });
                console.log(tempDArrayDoc);
                console.log('---------------------------------');
                console.log(CSV.stringify(tempDArrayDoc) , ';');

            });


            res.set({
                 'Content-Type': 'text/csv',
                 'Content-Disposition':'attachment; filename="export.csv"'
            });
            res.send(csvDocs);

        });

    };


};