var CSV = require('csv-string'),
    util = require('util'),
    pmongo = require('promised-mongo'),
    path = require('path'),
    basename = path.basename(__filename, '.js');

module.exports = function(config) {

    var coll = pmongo(config.get('connexionURI')).collection(config.get('collectionName'));

    return function (req, res) {
        coll
        .find({ notedKeywords : {$exists : true}})
        .toArray()
        .then(function(doc) {
            if (!doc) {
                console.log('Pas Doc');
                return;
            }
            else {
                    console.log('Doc :');

                    res.send(doc);

            }


         })
    };
};