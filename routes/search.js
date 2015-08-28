var mongo = require("mongodb").MongoClient,
    jsonselect = require('JSONSelect');

module.exports = function(config) {

    console.info("collection : " , config.get('connexionURI') , " / " , config.get('collectionName'));

	return function(req,res){

		var xmlid = req.params.xmlid ? ("\"#entry-" + req.params.xmlid + "\"") : null;

		console.info("Recherche sur l'id : " , xmlid , " , patientez ...");

        var arr = [], // final array containing all objs
            obj = {}, // temps obj use in loop
            title,
            target;

        mongo.connect(config.get('connexionURI'), function(err, db) {
            //console.log("Connected correctly to server");
            db.collection(config.get('collectionName'))
            .find({ $text : { $search : xmlid } } , {basename : 1 , text : 1} )
            .each(function(err, item){
                if(!err && item){
                    console.info("item : ", item.basename);
                    obj = {
                        "xmlid" : req.params.xmlid
                    }
                }
                else{
                    console.info("err : " , err);
                }
            })
        });

	};
};