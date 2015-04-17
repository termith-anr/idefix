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
    XMLWriter = require('xml-writer'),
    archiver = require('archiver'),
    dateFormat = require('dateformat');


module.exports = function(config) {

    var coll = pmongo(config.get('connexionURI')).collection(config.get('collectionName'));

    return function (req, res) {

        var access = config.get('exports'), // Check if acess if enable
            domain = config.get('domain');

        if (access.zipXML == true) {

            // Get current dateTime
            var datetime = new Date();
            datetime = dateFormat(datetime, "dd-mm-yyyy");

            var archive = archiver('zip');

            archive.on('error', function (err) {
                res.status(500).send({error: err.message});
            });


            res.on('close', function () {
                console.log('Archive wrote %d bytes', archive.pointer());
                return res.status(200).send('OK').end();
            });

            res.attachment(('export-' + domain + "-" + datetime + '.zip')); // name of archive

            archive.pipe(res); // Stream archive

            /////////////////////////////////

            coll
                .find({ "content.xml": {$exists: true}})
                .toArray()
                .then(function (docs) {

                    docs.forEach(function (value, index) {

                        var doc = value.content.xml,
                            docName = value.basename,
                            keywords = value.keywords,
                            notedKeywords = '',
                            docTest = new DOMParser().parseFromString(doc.toString(), 'text/xml'), // Creation du Doc
                            serializer = new XMLSerializer(), // DOM -> STRING XML
                            stdf = docTest.getElementsByTagName('ns:stdf'),
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


                        archive.append(docTest.toString(), { name: docName }); // Add data( docTest ) to archive with name (docName)

                    });

                    archive.finalize(); // Close archive


                });

            ////////////////////////////////

        }
        else{
            res.redirect('/'); // Redirect to Home if access denied
        }
    };
};