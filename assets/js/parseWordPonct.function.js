/**
 * Created by matthias on 18/08/14.
 */


/**
 * Parse elements w (words)
 * @param word word object or array
 * @param ponct array of punctuation elements (pc)
 * @param ponctUsed number of punctutations already used
 * @returns {{html: string, ponctUsed: Number}}
 */

function parseWordPonct(word, ponct, ponctUsed) {
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