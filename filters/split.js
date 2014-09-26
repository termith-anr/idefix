'use strict';

module.exports = function(config) {
    return function(input,separator) {
        var array = input.split(separator);
        return array;
    }
}