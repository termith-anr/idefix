module.exports = {
    "browserifyModules" : [ 'jquery', 'sugar', 'superagent' ],
    "loaders" : {
      "**/*.xml" : 'castor-load-raw'
    },
    "routes": {
        "/exportscore": "export.js"
    }
};
