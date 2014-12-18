/**
 * This is tei exportXML file
 * USes Pmongo to get Data
 * Uses xmlDom to manipulate the dom
 */


var pmongo = require('promised-mongo'),
    DOMParser = require('xmldom').DOMParser,
    XMLSerializer = require('xmldom').XMLSerializer,
    XMLWriter = require('xml-writer');


module.exports = function(config) {

    var coll = pmongo(config.get('connexionURI')).collection(config.get('collectionName'));


    return function (req, res) {

        // Set csv header
        res.set({
            'Content-Type': 'text/xml',
            'Content-Disposition':'attachment; filename="export.xml"'
        });

        coll
            .find({ "content.xml" : {$exists : true}})
            .toArray()
            .then(function(docs){

                console.log('XML : ');

                var xw = new XMLWriter;
                xw.startDocument();
                xw.startElement('TEICorpus');

                docs.forEach(function(value , index){


                    var doc = value.content.xml,
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

                        docTest.documentElement.insertBefore(ajout , abstract[0]); // Insert it before abstract


                        docTest = serializer.serializeToString(docTest.documentElement); // Back to string xml


                        xw.writeRaw(docTest.toString()); // Add xml to teicorpus

                    }

                });

                xw.endElement();  // Close TEICORPUS
                xw.endDocument(); // Close doc
                res.send(xw.toString()); // Send data


            });



    }

};