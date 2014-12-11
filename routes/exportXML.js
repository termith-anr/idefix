/**
 * This is teh exportXML file
 * USes Pmongo to get Data
 */


var xt = require('xtraverse'),
    pmongo = require('promised-mongo'),
    sugar = require('sugar'),
    DOMParser = require('xmldom').DOMParser;


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
                    console.log(value.content.xml);
                    res.write(value.toString());
                });

                res.send();

            });


    }

};