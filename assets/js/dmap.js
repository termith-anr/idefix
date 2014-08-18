/**
 * Created by Matthias.D &  François.P on 14/08/14.
 * Do not forget to add the functions files in JS folder !
 */

$(document).ready(function() {
    'use strict';
    var request = require('superagent');
    var sugar = require('sugar');

    var wid = location.pathname.split('-')[1].split(".")[0];
    // location.pathname.replace('/display-' , '').replace('.html', '')); Can be used if ID cointain . or -

    request
    .get('/display-'+ wid +'.json')
    .end(function(res){
        var html = parseGeneric(res.body.item.content.json.TEI.text.body.div);
        $('body').append(html);
        /*console.log("HTML: %s", html);*/
    });


});


