module.exports = {
    "browserifyModules" : [ 'jquery', 'sugar', 'superagent' , "jquery-ui"],
    "routes": {
        "/exportCSV": "exportCSV.js",
        "/exportCSV2": "exportCSV2.js",
        "/exportXML": "exportXML.js",
        "/exportZIP": "exportZIP.js"
    }
};
