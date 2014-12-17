/**
* This is tei exportXML file
* USes Pmongo to get Data
*/


var pmongo = require('promised-mongo'),
    DOMParser = require('xmldom').DOMParser,
    XMLSerializer = require('xmldom').XMLSerializer,
    XMLWriter = require('xml-writer'),
    archiver = require('archiver'),
    fs = require('fs'),
    p =require('path');


module.exports = function(config) {

    var coll = pmongo(config.get('connexionURI')).collection(config.get('collectionName'));

    return function (req, res) {

        var archive = archiver('zip');

        archive.on('error', function (err) {
            res.status(500).send({error: err.message});
        });


        res.on('close', function () {
            console.log('Archive wrote %d bytes', archive.pointer());
            return res.status(200).send('OK').end();
        });

        res.attachment('archive-name.zip');

        archive.pipe(res);

        var xw = new XMLWriter;
        xw.startDocument();
        xw.startElement('TEI');

        var test = 'Du text ???????';

        xw.writeRaw(test);
        xw.endElement();
        xw.endDocument();

        archive.append((xw.toString()), { name: 'test.txt' });


        archive.finalize();
    }
};