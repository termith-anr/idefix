module.exports = {
    "routes": [
        {
            "path" : "/exportCSV",
            "value" : "exportCSV.js",
            "method" : "get"
        },
        {
            "path" : "/exportXML",
            "value" : "exportXML.js",
            "method" : "get"
        },
        {
            "path" : "/exportZIP",
            "value" : "exportZIP.js",
            "method" : "get"
        }
    ],
    "loaders" : [
        {
            "script" : "castor-load-xml",
            "pattern" : "**/*.xml"
        },
        {
            "script" : "castor-load-raw",
            "pattern" : "**/*.xml"
        },
        {
            "script" : "tei-format/2014-11-01.js",
            "pattern" : "**/*.xml"
        },
        {
            "script" : "tei-format/2015-02-13.js",
            "pattern" : "**/*.xml"
        },
        {
            "script" : "autoScore.js",
            "pattern" : "**/*.xml"
        },
        {
            "script" : "castor-load-backup",
            "pattern" : "**/*.xml",
            "options" : {
                "toKeep" : ["fields" , "keywords" , "progressNotedKeywords" , "progressSilenceKeywords" , "pertinenceMethods" , "timeJob" , "validatePertinence","validateSilence" , "text"]
            }
        },
    ],
    "documentFields": {
        "$text": {
          "get": [
            "fields.title",
            "basename"
          ],
          "join": " | "
        }
    },
    "flyingFields": {
        "$listeDocuments": {
            "mask": "_id,wid,basename,fields,progressSilenceKeywords,progressNotedKeywords,text"
        },
        "$document": {
            "mask": "_id,wid,basename,fields,progressSilenceKeywords,progressNotedKeywords,validatePertinence,validateSilence,keywords,pertinenceMethods,text,timeJob"
        }
    }
};

module.exports.package = pkg = require('./package.json');
