module.exports = {
    "browserifyModules" : [ 'jquery', 'sugar', 'superagent' , "jquery-ui" , "bootstrap"],
    "loaders" : {
      "**/*.xml" : 'castor-load-raw',
      "*" : "index.js"
    },
    "routes": {
        "/exportscore": "export.js"
    }
};
