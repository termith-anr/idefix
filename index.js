module.exports = {
    "browserifyModules" : [ 'jquery', 'sugar', 'superagent' ],
  	//"routes" : {"/export2":"export-docs.js"}
    "loaders" : {
      "**/*.xml" : 'castor-load-raw'
    }
};
