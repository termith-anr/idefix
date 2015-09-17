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
                 { $skip : 1}, // Sould get the page number to skip
                 { $limit: 5 } //  Sould Get a limit via ajax
               ]
            )
            .each(function(err, item){
                if(!err && item){
                    console.info("Fichier -> ", item.basename );
                    var dataText = item.text.split("//"),
                        corresp  = dataText[2],
                        target   = dataText[0].replace("#" , "");
                        xmlDoc = new DOMParser().parseFromString(item.content.xml.toString(), 'text/xml'),
                        w = xmlDoc.getElementsByTagName('w');
                    console.info("Target -> " , target );

                    obj = {
                        "word" : [],
                        "title" : item.fields.title,
                        "p" : []
                    }

                    for(var i = 0 ; i < w.length ; i++){
                        //console.info("id : " , w[i].getAttribute('xml:id'));
                        if(w[i].getAttribute('xml:id') === target){
                            //console.info("xmlid toruvé  : " , w[i].parentNode.textContent)
                            var p  = w[i].parentNode.textContent;
                            obj.p.push(p);
                            if(obj.word.indexOf(obj.word) === -1){
                                obj.word.push(w[i].textContent);
                            }
                        }
                    }

                    arr.push(obj);

                    console.info("Obj -> "  , obj)
                    
                }
                else{
                    db.close();
                    if(!err){
                        // Set csv header
                        console.info("arr : " , arr);
                        var words = [];
                        for (var i = 0; i < arr.length; i++) {
                            words = words.concat(arr[i].word);
                        };
                        console.info("words: " , words);
                        res.render('search.html', { word : words , objs : arr });
                    }
                    else{
                        console.info("err : " , err);
                    }
                }
            })

        });

	};
};