/**
 * This is tei exportXML file
 * USes Pmongo to get Data
 * Uses xmlDom to manipulate the dom
 */


var pmongo = require('promised-mongo'),
    DOMParser = require('xmldom').DOMParser,
    XMLSerializer = require('xmldom').XMLSerializer,
    XMLWriter = require('xml-writer'),
    dateFormat = require('dateformat');


module.exports = function(config) {

        var coll = pmongo(config.get('connexionURI')).collection(config.get('collectionName'));

        return function (req, res) {

            var access = config.get('exports'), // Check if acess if enable
                domain = config.get('domain');

            if(access.xml == true) {

                // Get current dateTime
                var datetime = new Date();
                datetime = dateFormat(datetime, "dd-mm-yyyy");

                // Set csv header
                res.set({
                    'Content-Type': 'text/xml',
                    'Content-Disposition': 'attachment; filename="export-' + domain + '-'+ datetime + '.xml"'
                });

                coll
                    .find({ "content.xml": {$exists: true}})
                    .toArray()
                    .then(function (docs) {

                        var xw = new XMLWriter(true);
                        xw.startDocument();
                        xw.startElement('TEICorpus');

                        docs.forEach(function (value, index) {

                            var doc = value.content.xml,
                                docTest = new DOMParser().parseFromString(doc.toString(), 'text/xml'), // Creation du Doc
                                serializer = new XMLSerializer(), // DOM -> STRING XML
                                creation = new XMLWriter(true),
                                keywords = value.keywords,
                                silence = keywords.filter(function(content){
                                    return (content["type"] === "silence");
                                }),
                                pertinence = keywords.filter(function(content){
                                    return (content["type"] === "pertinence");
                                });


                            creation
                                .startElement("ns:stdf")
                                    .writeComment("stdf subordonné au stdf principal")
                                    .startElement("ns:soHeader")
                                        .startElement("encodingDesc")
                                        .writeAttribute("xmlns","http://www.tei-c.org/ns/1.0")
                                            .startElement("appInfo")
                                                .writeComment("nom de l'outil d'évaluation")
                                                .startElement("application")
                                                .writeAttribute("ident","idefix")
                                                .writeAttribute("version","1.0")
                                                    .writeElement("label" , "idefix")
                                                .endElement() //Fin aplication
                                            .endElement() // Fin appinfo
                                        .endElement() // Fin Encoding Desc
                                        .startElement("titleStmt")
                                        .writeAttribute("xmlns","http://www.tei-c.org/ns/1.0")
                                            .writeElement("title","évaluation indexation")
                                            .startElement("author")
                                            .writeAttribute("role","IndexingEvaluator")
                                            .text("INIST")
                                            .endElement()// Fin author
                                        .endElement() // Fin titleStmt
                                    .endElement() //Fin nsSoheader


                                    .startElement("ns:annotations")
                                        .startElement("ns:annotationGrp")
                                        .writeAttribute("type","pertinence")
                            ;


                            for (i = 0; i < pertinence.length; i++) { // Pour chaque mot silence   ...

                                var pertinencePreference = pertinence[i].preference ? pertinence[i].preference : null;

                                if ((pertinence[i]["score"]) || (pertinence[i]["score"] == '0')) { // ... Ayant été noté
                                    creation
                                        .startElement("span")
                                        .writeAttribute("from" , '#' + pertinence[i]["xml#id"])
                                            .startElement("num")
                                            .writeAttribute("type" ,  "pertinence")
                                            .text(pertinence[i]["score"])
                                            .endElement() // Fin Num
                                        .endElement()
                                    ;
                                }

                            }

                            creation
                                .endElement() //Fin annotationGrp
                                .endElement() //Fin  annotations
                                .endElement() // Fin  startElement
                            ;

                            console.log('creation : ' , creation.toString());

                            //if (notedKeywords) { // If at least one keywords on the doc is noted

                                docTest = serializer.serializeToString(docTest.documentElement); // Back to string xml

                                xw.writeRaw(docTest.toString()); // Add xml to teicorpus

                            //}

                        });

                        xw.endElement();  // Close TEICORPUS
                        xw.endDocument(); // Close doc
                        res.send(xw.toString()); // Send data


                    });

            }
            else{
                res.redirect('/'); // redirect to home if access denied
            }


        }

};