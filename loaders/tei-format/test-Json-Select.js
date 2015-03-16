/**
 * Created by matthias on 16/03/15.
 */

/************************
 ****    MODULES     ****
 ************************/

var objectPath = require('object-path'),
    kuler      = require('kuler'),
    sha1       = require('sha1'),
    jsonselect = require('JSONSelect');

'use strict';
module.exports = function(options, config) {
    options = options || {};
    config = config.get();
    return function (input, submit) {

        var arr1 = jsonselect.match(".ns#stdf" , input);

        console.log('arr ' , arr);

        /************************
         ****   NEXT LOADER  ****
         ************************/

        submit(null, input);
    }
};