/**
 * Created by matthias on 14/08/14.
 */

$(document).ready(function() {
    'use strict';
    var request = require('superagent');
    var sugar = require('sugar');

    var wid = location.pathname.split('-')[1].split(".")[0];

    /**
     * Parse elements w (words)
     * @param w word object or array
     * @param pc array of punctuation elements (pc)
     * @param pcNb number of punctutations already used
     * @returns {{html: string, pcNb: *}}
     */
    var parseWPc = function (w, pc, pcNb) {
        console.log("parseWPC");

        var html = "";

        if (!pcNb) { // Default value
            pcNb = 0;
        }
        if (Object.isArray(w)) {
            w.each(function (e) {
                var hn = parseWPc(e, pc, pcNb);
                html += hn.html;
                pcNb = hn.pcNb;
            });
        }
        else {
            // Compute white space
            var whiteSpace = (w.wsAfter === "true" ? " " : "")
            var currentPc;
            if (Object.isArray(pc)) {
                currentPc = pc[pcNb]
            }
            else {
                currentPc = pc;
            }
            if (currentPc && currentPc['xml#id'] < w['xml#id']) { // WARNING: string comparison instead of numbers
                whiteSpace = currentPc['#text'] + (currentPc.wsAfter === "true" ? " " : "");
                pcNb ++; // next time: next punctuation
            }
            html += w['#text'] + whiteSpace;
        }
        console.log('w:%s', html);
        return { html: html, pcNb: pcNb };
    };

    var parseGeneric = function (element) {

        var html = "";

        if (!element) {
            return "";
        }
        if (typeof element === 'string') {
            return "";
        }
        if (Object.isArray(element)) {
            //console.log('array');
            element.each(function (e) {
                html += parseGeneric(e);
            });
            html += "";
        }
        else {
            //console.log('object');
            Object.keys(element, function (key, value) {
               if (key === 'div') {
                    //console.log('div');
                    return parseGeneric(value);

               }
               else if (key === 'w') {
                    //console.log(value);
                    html += parseWPc(value, element['pc']).html;
                    console.log("gw:%s", html);
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
        console.log("HTML: %s", html);
    });



});


