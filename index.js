module.exports = {
    "browserifyModules" : [ 'jquery', 'sugar', 'superagent' , "jquery-ui" , "bootstrap"],
    "loaders" : {
      "**/*.xml" : 'castor-load-raw'
    },
    "routes": {
        "/exportscore": "export.js"
    }
};
