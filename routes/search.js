module.exports = function(config) {

	var pmongo = require('promised-mongo');

	return function(req,res){

		var xmlid = req.params.xmlid ? "#entry-" + req.params.xmlid : null;

		console.log("Recherche en cours sur l'id : " , xmlid , " , patientez ...");

		var coll = pmongo(config.get('connexionURI')).collection(config.get('collectionName'));

		console.log("col: " , coll);

		// Get mongodb files wich contain scores
    coll
        .find({ corresp : xmlid })
        .toArray()
        .then(function (docs) {
        	docs.forEach(function (entity, index) { // Foreach of all docs : entity  = document
        		console.log("Le mot est présent dans le doc  : " , entity.basename)
        	});
        	
        });

	};
};