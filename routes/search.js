var mongo = require("mongodb").MongoClient;

module.exports = function(config) {

    console.info("collection : " , config.get('connexionURI') , " / " , config.get('collectionName'));

	return function(req,res){

		var xmlid = req.params.xmlid ? ("\"#entry-" + req.params.xmlid + "\"") : null;

		console.info("Recherche sur l'id : " , xmlid , " , patientez ...");

        mongo.connect(config.get('connexionURI'), function(err, db) {
            //console.log("Connected correctly to server");
            db.collection(config.get('collectionName'))
            .find({ $text : { $search : xmlid } } , {basename : 1 , text : 1} )
            .each(function(err, item){
                if(!err && item){
                    console.info("item : ", item.basename)
                }
                else{
                    console.info("err : " , err);
                }
            })
        });

	};
};