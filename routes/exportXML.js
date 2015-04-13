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
                                stdf = docTest.getElementsByTagName('ns:stdf'),
                                keywords = value.keywords,
                                silence = keywords.filter(function(content){
                                    return (content["type"] === "silence");
                                }),
                                pertinence = keywords.filter(function(content){
                                    return (content["type"] === "pertinence");
                                });

                            var arr = [];
                            for (var i = 0; i < value.pertinenceMethods.length; i++) {
                                arr.push(keywords.filter(function (content) {
                                    return (content["method"] === value.pertinenceMethods[i]);
                                }));
                            }

                            console.log("arr : " , arr);


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


                            for (i = 0; i < pertinence.length; i++) { // Pour chaque mot pertinence   ...


                                if ((pertinence[i]["score"]) || (pertinence[i]["score"] == '0')) { // ... Ayant été noté

                                    creation
                                        .startElement("span")
                                        .writeAttribute("from" , '#' + pertinence[i]["xml#id"])
                                            .startElement("num")
                                            .writeAttribute("type" ,  "pertinence")
                                            .text(pertinence[i]["score"])
                                            .endElement() // Fin Num
                                    ;

                                    // Si il y a un preference
                                    if(pertinence[i]["preference"]){
                                        creation
                                            .startElement("link")
                                            .writeAttribute("type" ,  "preferredForm")
                                            .text(pertinence[i]["preference"])
                                        ;
                                    }

                                    // Si il y a un commentaire
                                    if(pertinence[i]["comment"]){
                                        creation
                                            .writeElement("note" , pertinence[i]["comment"])
                                        ;
                                    }

                                    // Fin Span
                                    creation.endElement();

                                }

                            }

                            creation
                                .endElement() // Fin annotationGrp pertinence
                                .startElement("ns:annotationGrp")
                                .writeAttribute("type","silence")
                            ;

                            for (i = 0; i < silence.length; i++) { // Pour chaque mot silence   ...


                                if ((silence[i]["score"]) || (silence[i]["score"] == '0')) { // ... Ayant été noté

                                    creation
                                        .startElement("span")
                                        .writeAttribute("from" , '#' + silence[i]["xml#id"])
                                        .startElement("num")
                                        .writeAttribute("type" ,  "silence")
                                        .text(silence[i]["score"])
                                        .endElement() // Fin Num
                                    ;

                                    // Si il y a un preference
                                    if(silence[i]["correspondance"]){
                                        creation
                                            .startElement("link")
                                            .writeAttribute("type" ,  "TermithForm")
                                            .text(silence[i]["correspondance"])
                                        ;
                                    }

                                    // Si il y a un commentaire
                                    if(silence[i]["comment"]){
                                        creation
                                            .writeElement("note" , silence[i]["comment"])
                                        ;
                                    }

                                    // Fin Span
                                    creation.endElement();

                                }

                            }

                            creation
                                .endElement() //Fin annotationGrp silence
                                .endElement() //Fin  annotations
                                .endElement() // Fin  startElement
                            ;

                            //console.log('creation : ' , creation.toString());

                            creation = new DOMParser().parseFromString(creation.toString(), 'text/xml');

                            // Pour chaque stdf trouvé:
                            for(i = 0 ; i < stdf.length ; i++){
                               /* console.log('===========================================');
                                console.log('STDF N° ' , + i);
                                console.log(stdf[i].getAttribute('xml:id'));*/

                                //Si l'id de la method vaut ...
                                if(stdf[i].getAttribute('xml:id') === "mi1"){
                                    stdf = stdf[i];
                                    break;
                                }
                            }


                            stdf.appendChild(creation);

                            xw.writeRaw(docTest.toString()); // Add xml to teicorpus


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