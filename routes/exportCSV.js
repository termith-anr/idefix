/**
 * Created by matthias on 26/03/15.
 * It's V2 ( with new mongo keywords format ) CSV export , for all phases of termITH.
 */

var CSV = require('csv-string'),
    pmongo = require('promised-mongo'),
    dateFormat = require('dateformat');

module.exports = function(config) {

    // Get collection
    var coll = pmongo(config.get('connexionURI')).collection(config.get('collectionName'));

    // CSV array
    var csvDocs = [];

    return function (req, res) {

        // Get config export info
        var access = config.get('exports'),
            domain = config.get('domain');

        // Check if acess if enable
        if (access.csv === true) {

            // Get current dateTime
            var datetime = new Date();
            datetime = dateFormat(datetime, "dd-mm-yyyy");

            // Set csv header
            res.set({
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename="export-' + domain + '-' + datetime + '.csv"'
            });

            // Get mongodb files wich contain scores
            coll
                .find({ keywords: {$exists: true}})
                .toArray()
                .then(function (docs) {

                    if (!docs || (!docs.length)) {
                        res.status(500).end();
                        throw new Error('no or bad doc');
                        return;
                    }

                    var tempDArrayDoc = [];

                    res.write(CSV.stringify(['Nom Fichier', 'Titre' , 'Méthode' , 'Evaluation' , 'Mot-Clé' , 'Score' , 'Pref-Termith' , 'Corresp-termith' , 'Commentaire' , 'temps' , 'temps/mot'], ';'));


                    docs.forEach(function (entity, index) { // Foreach of all docs : entity  = document


                        var docTitle = (entity.fields.title != undefined) ? entity.fields.title : 'Pas de titre de document',
                            fileTitle = entity.basename,
                            timeMs = entity.timeJob ? entity.timeJob : 0,
                            time = entity.timeJob ? (Math.floor(((entity.timeJob) / (60 * 1000)) % 60) + "Mn " + Math.floor(((entity.timeJob) / 1000) % 60) + "s" ) : "0",
                            nbOfNotedWords = 0;


                        //console.log("docTitle" , docTitle , "fileTitle" , fileTitle , "timeMs" , timeMs , "time" , time);


                        entity.keywords.forEach(function (valueObject,indexObject) {
                            if (valueObject.score) {
                                nbOfNotedWords++;
                            }
                        });

                        console.log('nbodnoted : ' , nbOfNotedWords);

                        var middleTime = (timeMs / nbOfNotedWords) ? (Math.floor(( parseFloat(timeMs / nbOfNotedWords) / (60 * 1000)) % 60) + "Mn " + Math.floor(( parseFloat(timeMs / nbOfNotedWords) / 1000) % 60) + "s" ) : 0;


                        //Below Start generating & writting csv Lines
                        // For every keywords object in keywords
                        entity.keywords.forEach(function (valueObject,indexObject) {

                            // If the word has a score
                            if (valueObject.score || valueObject.score === 0) {

                                var method = valueObject.method ? valueObject.method : '',
                                    type = valueObject['type'] ? valueObject['type'] : '',
                                    word = valueObject.word ? valueObject.word : '',
                                    score = (valueObject.score || valueObject.score ===0) ? valueObject.score : '',
                                    comment = valueObject.comment ? valueObject.comment : '',
                                    correspondance,
                                    preference;

                                //console.log("LE TYPE EST : " , type);

                                if(type === "pertinence"){
                                    correspondance = "-";
                                    preference = valueObject.preference ? valueObject.preference : '';
                                }
                                else if(type === "silence"){
                                    correspondance = valueObject.correspondance ? valueObject.correspondance : '';
                                    preference = "-";
                                    //console.log("pour un silence , la correspondance vaut : " , correspondance , " et la preference vaut : ", preference);
                                }

                                //console.log(fileTitle , docTitle , method , type , word , score , preference , correspondance , comment , time , middleTime);


                                res.write(CSV.stringify([ fileTitle , docTitle , method , type , word , score , preference , correspondance , comment , time , middleTime ], ';'))

                            }


                        });


                    });

                    res.end(); // Stop writting csv after all docs.


                });

        }
        else{
            res.redirect('/'); //Redirect to Home if access denied
        }

    };



};