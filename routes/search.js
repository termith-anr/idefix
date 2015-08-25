module.exports = function(config) {
	return function(req,res){
		console.log("Recherche en cours , patientez ...");
		console.log("header : " , req.params);
	};
};