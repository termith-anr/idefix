/**
 * Created by Matthias.D &  François.P on 14/08/14.
 */

$(document).ready(function() {
    'use strict';
    var request = require('superagent');
    var sugar = require('sugar');

    var wid = location.pathname.split('-')[1].split(".")[0];
    // location.pathname.replace('/display-' , '').replace('.html', '')); Can be used if ID cointain . or -


    /**
     * Parse elements w (words)
     * @param word word object or array
     * @param ponct array of punctuation elements (pc)
     * @param ponctUsed number of punctutations already used
     * @returns {{html: string, ponctUsed: Number}}
     */
    var parseWordPonct = function (word, ponct, ponctUsed) {
        /*console.log("parseWordPonct");*/

        if (!ponctUsed){
            /*console.log(pc);*/
            ponctUsed = 0;
        }

        var html = "";

        if ((word instanceof Array)  && (word.length > 0)) { // Or can use sugar Array.isArray

            for( var i = 0; i < word.length; i++ ){

                var hn = parseWordPonct(word[i], ponct , ponctUsed);
                    html += hn.html;
                    ponctUsed = hn.ponctUsed;

            }

           /*
               // Do the same with sugar each() function;

            word.each(function (e) {
                    var hn = parseWordPonct(e, ponct, ponctUsed);
                    html += hn.html;
                    ponctUsed = hn.ponctUsed;
                });

            */

        }
        else {
            // Compute white space

            var whiteSpace = (word.wsAfter === "true" ? " " : ""), //add space if wsafter is true
                punctuation = "",
                currentPc;

            if ((ponct instanceof Array)  && (ponct.length > 0)) {
                if (ponctUsed >= ponct.length) {
                    console.log('pb?');
                    currentPc = null;
                }
                else {
                    currentPc = ponct[ponctUsed]
                }
            }

            else {
                currentPc = ponct;
            }

            if (currentPc && currentPc['xml#id'] < word['xml#id']) { // WARNING: string comparaison instead of numbers
                punctuation = currentPc['#text'] + (currentPc.wsAfter === "true" ? " " : "");
                ponctUsed ++; // next time: next punctuation
            }

            html += punctuation + word['#text'] + whiteSpace;
        }
        //console.log('w:%s', html);
        return { html: html, ponctUsed: ponctUsed };

    }; // en of parseWordPonct()


    var parseGeneric = function (element) {

        var html = "";

        if (!element) { //If it's not defined
            return;
        }

        if (typeof element === 'string') { // Nothing to do with that yet!
            return "";
        }

        if ((element instanceof Array)  && (element.length > 0)) { // If it's an Array

            /*for( var i = 0; i < element.length; i++ ){

                html+= parseGeneric(element);

            } //Cannot be used , navigator quit recurtion */

            element.each(function (e) {
                html += parseGeneric(e);
            });

            html += "";

        }

        else {

            Object.keys(element, function (key, value) {

               if (key === 'div') {
                    //console.log('div');
                    return parseGeneric(value);

               }
               else if (key === 'w') { // w is TEI for words
                    //console.log(value);
                    html += parseWordPonct(value, element['ponct'], 0).html;
                    /*console.log("gw:%s", html);*/
               }
               else if (key === 'head') {
                   //console.log("HEAD");
                   html += '<h1>';
                   html += parseGeneric(value);
                   html += '</h1>';
               }
               else {
                   //console.log("default:%s", key);
                   html += parseGeneric(value);
               }

            });
        }
        //console.log("< %s", html);
        return html;
    };

    request
    .get('/display-'+ wid +'.json')
    .end(function(res){
        var html = parseGeneric(res.body.item.content.json.TEI.text.body.div);
        $('body').append(html);
        /*console.log("HTML: %s", html);*/
    });


});


