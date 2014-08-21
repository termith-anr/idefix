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

            case 'ref':
                html += '<dfn class="defPictures">' + parseWordPonct(element['w'], element.pc , 0).html + '</dfn>';
                break;

            case 'rend':
                if(value === 'figure-title')
                {html += '<figure class="figureFullArticle"><figcaption class="bold figcaptionFullArticle">' + parseWordPonct(element['w'], element.pc , 0).html + '</figcaption>';}
                else if(value === 'italic')
                {html += '<em lang="en" class="italic">' + parseWordPonct(element['w'], element.pc , 0).html + '</em>';}
                break;

            case 'w':
                if((element['rend'] !== 'figure-title') && (element['rend'] !== 'italic') && (!element['ref'])){html += parseWordPonct(value, element['pc'], 0).html ;}
                break;

            case 'head':
                var h = Number(value['subtype'].substr(5)) + 2;
                html += '<h' + h + ' class="headFullArticle h3FullArticle">' + parseGeneric(value) + '</h' + h + '>';
                break;

            case 'p':
                if(value instanceof Array){
                    value.each( function(p){
                        if(p.w) {
                            html += '<div class="pFullArticle">' + parseGeneric(p) + '</div>';
                        }
                        else{
                            html +=  parseGeneric(p);
                        }
                    });
                }
                else {
                    if(value.w) {
                        html += '<div class="pFullArticle">' + parseGeneric(value) + '</div>';
                    }
                    else{
                        html +=  parseGeneric(value);
                    }
                }
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
