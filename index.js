module.exports = {
    "browserifyModules" : [ 'jquery', 'sugar', 'superagent' , "jquery-ui" , "bootstrap"],
    "routes": {
        "/exportCSV": "exportCSV.js",
        "/exportXML": "exportXML.js",
        "/exportZIP": "exportZIP.js"
    }
};
