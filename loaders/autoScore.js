/**
 *
 * Created by matthias on 14/11/14.
 * Updated at 03/03/2015
 * Loader auto-score
 *
 */

var objectPath = require('object-path');


'use strict';
module.exports = function(options) {
    options = options || {};
    return function (input, submit) {

        submit(null, input);
    }
};