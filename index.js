module.exports = {
    "browserifyModules" : [ 'jquery', 'sugar', 'superagent' , "jquery-ui" ],
    "loaders" : {
      "**/*.xml" : 'castor-load-raw'
    },
    "routes": {
        "/exportscore": "export.js"
    }
};
