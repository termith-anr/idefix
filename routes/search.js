module.exports = function(config) {
	return function(req,res){

		console.log("Recherche en cours , patientez ...");

		var xmlid = req.params.xmlid ? req.params.xmlid : null;

		console.log("xmlid : " , xmlid);

	};
};