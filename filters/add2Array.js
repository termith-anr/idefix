'use strict';

module.exports = function(config) {

    return function(array,item,position) {

        if(array instanceof Array) {
            if(typeof position === 'undefined'){
                array.push(item);
            }
            else{
                array.splice(position,0,item);
            }
        }
        return array;

    }

}
