var mongo = require("mongodb").MongoClient,
    jsonselect = require('JSONSelect'),
    DOMParser = require('xmldom').DOMParser;

module.exports = function(config) {

    console.info("collection : " , config.get('connexionURI') , " / " , config.get('collectionName'));

	return function(req,res){

		var xmlid      = req.params.xmlid ? ("\"#entry-" + req.params.xmlid + "\"") : null,
            xmlidRegex = req.params.xmlid ? ".*#entry-" + req.params.xmlid : null;

		console.info("Recherche sur l'id : " , xmlid , " , patientez ...");

        var arr = [], // final array containing all objs
            obj = {}, // temps obj use in loop
            title,
            target;

        mongo.connect(config.get('connexionURI'), function(err, db) {
            //console.log("Connected correctly to server");
            db.collection(config.get('collectionName'))
            .aggregate(
               [
                 { $match: { $text: { $search: xmlid } } },
                 { $project : { _id : 0 , basename : 1, text : 1 , "fields.title" : 1 , "content.xml" : 1}},
                 { $unwind : "$text" },
                 { $match : { text : { $regex: xmlidRegex } } },
                 { $limit: 5 }
               ]
            )
            .each(function(err, item){
                if(!err && item){
                    console.info("item : ", item.basename , " text : " , item.text);
                    var dataText = item.text.split("//"),
                        corresp  = dataText[2],
                        target   = dataText[0];
                    console.info("Target -> " , target);
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