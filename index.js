module.exports = {
    "browserifyModules" : [ 'jquery', 'sugar', 'superagent' , "jquery-ui"],
    "routes": {
        "/exportCSV": "exportCSV.js",
        "/exportXML": "exportXML.js",
        "/exportZIP": "exportZIP.js"
    }
};
