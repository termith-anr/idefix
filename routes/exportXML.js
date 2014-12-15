/**
 * This is tei exportXML file
 * USes Pmongo to get Data
 */


var pmongo = require('promised-mongo'),
    sugar = require('sugar'),
    DOMParser = require('xmldom').DOMParser,
    XMLSerializer = require('xmldom').XMLSerializer,
    XMLWriter = require('xml-writer');


module.exports = function(config) {

    var coll = pmongo(config.get('connexionURI')).collection(config.get('collectionName'));


    return function (req, res) {

        // Set csv header
        res.set({
            'Content-Type': 'text/txt',
            'Content-Disposition':'attachment; filename="export.txt"'
        });



        coll
            .find({ "content.xml" : {$exists : true}})
            .toArray()
            .then(function(docs){
                console.log('XML : ');
                docs.forEach(function(value , index){

                    //console.log(value.content.xml);

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

                            console.log('---------------------------POUR CHAQUE MOT--------------------------');


                            console.log('Mot : ' , word);
                            console.log('SCORE : ' , score);


                            var ajoutTXT = docTest.createTextNode(word + ' : ' + score + ' / ');


                            ajout.appendChild(ajoutTXT);



                            console.log('---------------------------AJOUTXT--------------------------');
                            console.log(ajoutTXT);


                        }

                    }

                    if(notedKeywords) { // Si la liste n'est pas vide

                        console.log('liste de score :', notedKeywords);

                        docTest.documentElement.insertBefore(ajout , abstract[0]);

                        console.log('---------------------------DOCTEST DOM--------------------------');
                        console.log(docTest);


                        console.log('---------------------------DOCTEST XML--------------------------');
                        console.log('docTest ' ,serializer.serializeToString(docTest.documentElement));

                        res.write(serializer.serializeToString(docTest.documentElement)); // Ecriture de Doctest dans le fichier d'export ( pour chaque mot , juste pour tester )


                    }

                });

                res.send(); // cloture et envoi

            });


    }

};