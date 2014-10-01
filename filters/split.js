'use strict';

module.exports = function(config) {

    return function(input,separator) {

        if(typeof(input) == 'string') { //  Split only on a string  !
            var array = input.split(separator);
            return array;
        }
        return String(input);
    }

}