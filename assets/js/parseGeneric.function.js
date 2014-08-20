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
            html += parseGeneric(value);

        }
        else if (key === 'w') { // w is TEI for words
            //console.log(value);
            html += parseWordPonct(value, element['pc'], 0).html;
            /*console.log("gw:%s", html);*/
        }
        else if (key === 'head') {
            //console.log("HEAD");

            var h = Number(value['subtype'].substr(5)) + 2;

            html += '<h' + h + ' class="headFullArticle h3FullArticle">' + parseGeneric(value) + '</h' + h + '>';

        }
        else if (key === 'p') {
            //console.log("default:%s", key);
            html += '<p class="pFullArticle">' + parseGeneric(value) + '</p>';
        }

        /*else if (key === 'rend' && value === 'figure-title') {
            //console.log('figure-title');
            html += '<figure><figcaption>' + parseWordPonct(element.w) + '</figcaption> '
        }*/

        else if (key === 'graphic') {
            //console.log(value.url, typeof value.url);
            html += '<img style="margin: 0 auto;display:block;padding-top:20px;padding-bottom:20px;" src="' + value['url'] + '"/>';
            parseGeneric(value);
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

    if(element['rend'] == 'figure-title'){
        var obj = Object.keys(element, which);
        var texte="";
                obj.each(function (e) {
                    texte += parseGeneric(e);
                });
        console.log(texte);
        //html += '<figure><figcaption>' + parseWordPonct(obj.w) + '</figcaption></figure>';
    }

    if ((element instanceof Array)  && (element.length > 0)) { // If it's an Array

        /*for( var i = 0; i < element.length; i++ ){

         html+= parseGeneric(element);

         } //Cannot be used , navigator quit recurtion*/

        element.each(function (e) {
            html += parseGeneric(e);
        });


    }

    else {
        Object.keys(element, which);
    }
    //console.log("< %s", html);
    return html;
}
