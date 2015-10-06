/*jshint node:true, laxcomma:true*/
"use strict";

module.exports = function(config, run) {
  config.set('theme', __dirname);
  config.set('connectionURI' , 'mongodb://localhost:27017/test/');
  config.set('logFormat' , 'dev');
  run();
};

if (!module.parent) {
  require('castor-core')(module.exports);
}
