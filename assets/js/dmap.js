/**
 * Created by Matthias.D &  François.P on 14/08/14.
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
        var html = parseGeneric(res.body.item.content.json.TEI.text.body.div , 0);
        $('#fullArticle').append(html);
        /*console.log("HTML: %s", html);*/
    });


});


