/**
*
* This is tei exportZIP file
* Uses Pmongo to get Data
* Uses xmlDom to add keywords in xml
* Uses archiver to make a zip of xml files
*
*/


var pmongo = require('promised-mongo'),
    DOMParser = require('xmldom').DOMParser,
    XMLSerializer = require('xmldom').XMLSerializer,
    archiver = require('archiver'),
    dateFormat = require('dateformat');


module.exports = function(config) {

    var coll = pmongo(config.get('connexionURI')).collection(config.get('collectionName'));

    return function (req, res) {

        // Get current dateTime
        var datetime = new Date();
        datetime = dateFormat(datetime , "dd-mm-yyyy");

        var archive = archiver('zip');

        archive.on('error', function (err) {
            res.status(500).send({error: err.message});
        });


        res.on('close', function () {
            console.log('Archive wrote %d bytes', archive.pointer());
            return res.status(200).send('OK').end();
        });

        res.attachment(('export'+ datetime +'.zip')); // name of archive

        archive.pipe(res); // Stream archive

        /////////////////////////////////

        coll
            .find({ "content.xml" : {$exists : true}})
            .toArray()
            .then(function(docs){

                docs.forEach(function(value , index){

                    var doc = value.content.xml,
                        docName = value.basename,
                        keywords = value.keywords.eval[0].term,
                        notedKeywords = '',
                        docTest = new DOMParser().parseFromString(doc.toString() , 'text/xml'), // Creation du Doc
                        serializer = new XMLSerializer(), // DOM -> STRING XML
                        abstract = docTest.getElementsByTagName('abstract'), // Recuperation d'abstract
                        ajout = docTest.createElement('notedKeywords'); // Création d'un element de test


                    for(i = 0 ; i < keywords.length ; i++){ // Pour chaque mot    ...

                        if((keywords[i].score) || (keywords[i].score == '0')){ // ... Ayant été noté


                            var word = keywords[i]['#text'],
                                score = keywords[i].score;


                            notedKeywords += word + ' : ' + score + ' / '; // Liste de mots clés


                            var ajoutTXT = docTest.createTextNode(word + ' : ' + score + ' / ');


                            ajout.appendChild(ajoutTXT);

                        }

                    }

                    if(notedKeywords) { // If at least one keywords on the doc is noted


                        docTest.documentElement.insertBefore(ajout , abstract[0]);// Insert it before abstract


                        docTest = serializer.serializeToString(docTest.documentElement); // back to string xml


                        archive.append(docTest, { name: docName }); // Add data( docTest ) to archive with name (docName)

                    }

                });

                archive.finalize(); // Close archive


            });

        ////////////////////////////////



    }
};