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

        var db = pmongo(config.get('connexionURI'));
        var coll = db.collection(config.get('collectionName'));

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
                                stdf = docTest.getElementsByTagName('ns:stdf'),
                                keywords = value.keywords,
                                nbOfMethods = value.pertinenceMethods.length,
                                filtered = {};

                            //Pour chaque methodes On filtre par methode et par type
                            for (var i = 1; i <= nbOfMethods; i++) {
                                (function(e) {
                                    var methodId = "mi" + i;
                                    filtered[methodId] = {
                                        silence: [],
                                        pertinence: []
                                    };
                                    keywords.filter(function (content) {
                                        if ((content["methodId"] === methodId) && (content["type"] === "silence")) {
                                            filtered[methodId].silence.push(content);
                                        }
                                        else if ((content["methodId"] === methodId) && (content["type"] === "pertinence")) {
                                            filtered[methodId].pertinence.push(content);
                                        }
                                    })
                                })(i);
                            }

                            //console.log(" Objet filtré : " ,filtered);

                            // Pour chaque stdf trouvé:
                            for( i = 0 ; i < stdf.length ; i++){

                                console.log('STDF n° ' , i+1 , " trouvé");
                                console.log('Lattribut xml trouvé vaut : ' ,stdf[i].getAttribute('xml:id'));



                                //Si l'id de la method du sdf vaut le i en cours ...
                                if(stdf[i].getAttribute('xml:id').indexOf("mi") > -1){

                                    console.log("On commence a faire un fichier avec  attribut :  " , stdf[i].getAttribute('xml:id'));

                                    var creation = new XMLWriter(true);

                                    var mix = stdf[i].getAttribute('xml:id').toString();

                                    console.log('Nous sommes donc à la methode : ' , mix);

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

                                    for (var j = 0; j < filtered[mix]["pertinence"].length; j++) { // Pour chaque mot pertinence   ...

                                        //console.log("Mot filtré n°" , j);


                                        if ((filtered[mix]["pertinence"][j]["score"]) || (filtered[mix]["pertinence"][j]["score"] == '0')) { // ... Ayant été noté

                                            creation
                                                .startElement("span")
                                                .writeAttribute("from" , '#' + filtered[mix]["pertinence"][j]["xml#id"])
                                                .startElement("num")
                                                .writeAttribute("type" ,  "pertinence")
                                                .text(filtered[mix]["pertinence"][j]["score"])
                                                .endElement() // Fin Num
                                            ;

                                            // Si il y a un preference
                                            if(filtered[mix]["pertinence"][j]["preference"]){
                                                creation
                                                    .startElement("link")
                                                    .writeAttribute("type" ,  "preferredForm")
                                                    .writeAttribute("target" ,  "#" + filtered[mix]["pertinence"][j]["idPreference"])
                                                    .endElement();
                                                ;
                                            }

                                            // Si il y a un IsCorrespondanceOf
                                            if(filtered[mix]["pertinence"][j]["isCorrespondanceOf"]){

                                                var arrIsCorrespondanceOf = filtered[mix]["pertinence"][j]["isCorrespondanceOf"].split(",,");
                                                arrIsCorrespondanceOf.forEach(function(content,index){
                                                    creation
                                                        .startElement("link")
                                                        .writeAttribute("type" ,  "INISTForm")
                                                        .writeAttribute("target" ,  "#" + content)
                                                        .endElement()
                                                    ;
                                                });

                                            }

                                            // Si il y a un commentaire
                                            if(filtered[mix]["pertinence"][j]["comment"]){
                                                creation
                                                    .writeElement("note" , filtered[mix]["pertinence"][j]["comment"])
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

                                    for (j = 0; j < filtered[mix]["silence"].length; j++) { // Pour chaque mot silence   ...

                                        console.log("MOT silence : " , filtered[mix]["silence"][j]["word"]);


                                        if ((filtered[mix]["silence"][j]["score"]) || (filtered[mix]["silence"][j]["score"] == '0')) { // ... Ayant été noté

                                            creation
                                                .startElement("span")
                                                .writeAttribute("from" , '#' + filtered[mix]["silence"][j]["xml#id"])
                                                .startElement("num")
                                                .writeAttribute("type" ,  "silence")
                                                .text(filtered[mix]["silence"][j]["score"])
                                                .endElement() // Fin Num
                                            ;

                                            // Si il y a un preference
                                            if(filtered[mix]["silence"][j]["correspondance"]){
                                                creation
                                                    .startElement("link")
                                                    .writeAttribute("type" ,  "TermithForm")
                                                    .writeAttribute("target" ,  "#" + filtered[mix]["silence"][j]["idCorrespondance"])
                                                    .endElement()
                                                ;
                                            }


                                            // Si il y a un commentaire
                                            if(filtered[mix]["silence"][j]["comment"]){
                                                creation
                                                    .writeElement("note" , filtered[mix]["silence"][j] ["comment"])
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


                                    stdf[i].appendChild(creation);

                                }
                            }

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

        db.close();

};