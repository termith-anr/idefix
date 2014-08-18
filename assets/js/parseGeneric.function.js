/**
 * Created by matthias on 18/08/14.
 */

/**
 * Parse elements w (words)
 * @param html the html page built
 * @param element array of word
 * @returns {{html: string}}
 */


function parseGeneric (element) {

    var html = "";

    var which = function  (key, value) { // cases of key (div , w , p...)

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
            html += '<h1 class="headFullArticle">';
            html += parseGeneric(value);
            html += '</h1>';
        }
        else {
            //console.log("default:%s", key);
            html += parseGeneric(value);
        }

    };

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


    }

    else {
        Object.keys(element, which);
    }
    //console.log("< %s", html);
    return html;
};
