/**
 * Created by matthias on 18/08/14.
 *
 * Parse elements w (words)
 * @param html the html page built
 * @param element array of word
 * @returns {{html: string}}
 *
 */


function parseGeneric(element){


    var html = "";

    // cases of key (div , w , p...)
    var which = function  (key, value) {

        switch(key){


            case 'div':
                html += parseGeneric(value);
                break;

            case 'rend':
                if(value === 'figure-title')
                {html += '<figure><figcaption>' + parseWordPonct(element.w, element.pc , 0).html + '</figcaption>';}
                break;

            case 'w':
                if(element['rend'] !== 'figure-title'){html += parseWordPonct(value, element['pc'], 0).html;}
                break;

            case 'head':
                var h = Number(value['subtype'].substr(5)) + 2;
                html += '<h' + h + ' class="headFullArticle h3FullArticle">' + parseGeneric(value) + '</h' + h + '>';
                break;
            case 'p':
                html += '<p class="pFullArticle">' + parseGeneric(value) + '</p>';
                break;

            case 'graphic':
                html += '<img style="margin: 0 auto;display:block;padding-top:20px;padding-bottom:20px;" src="' + value['url'] + '"/> </figure>';
                parseGeneric(value);
                break;

            default:
                html += parseGeneric(value);
                break;

        }

    };

    // If it's not defined
    if (!element) {

        return;

    }


    // Nothing to do with that yet!
    else if (typeof element === 'string') {

        return "";

    }


    // If it's an Array
    else if ((element instanceof Array)  && (element.length > 0)) {

        var e = function (e) {
            html += parseGeneric(e);
        }

        element.each(e);

    }


    else {

        Object.keys(element, which);

    }

    // return the HTML full Article
    return html;

}
