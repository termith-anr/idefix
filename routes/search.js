var pmongo = require('promised-mongo');

module.exports = function(config) {

    var coll = pmongo(config.get('connexionURI')).collection(config.get('collectionName'));

	return function(req,res){

        console.info("Recherche ...");

		var xmlid = req.params.xmlid ? ("#entry-" + req.params.xmlid) : null;

		console.info("Recherche en cours sur l'id : " , xmlid , " , patientez ...");

        coll.find({})
        .toArray()
        .then(function(docs) {
            console.info("oe : " , docs.length);
        });

		/* Get mongodb files wich contain scores
        coll
        .find({ $text : { $search : xmlid } })
        .toArray()
        .then(function (docs) {
            console.info("nb docs : " , docs.length);
        	// docs.forEach(function (entity, index) { // Foreach of all docs : entity  = document
        	// 	console.log("Le mot est présent dans le doc  : " , entity.basename)
        	// });
        	
        });*/

	};
};