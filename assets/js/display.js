/**
 * Created by matthias on 28/10/14.
 */
$(document).ready(function() {

    // ProgressBar & Timer ( getting json info )
    var pertinenceBar = $('#pertinenceBar'),
        silenceBar = $('#silenceBar'),
        pageId = pertinenceBar.attr('data-id'),
        savePage = '/save/' + pageId,
        dropPage = '/drop/' + pageId,
        contentPage = '/display/' + pageId + ".json?flying=document",
        configPage = "/config.json",
        config = {},
        methodsBut = $(".methodsNameDisplayD > div"),
        timer = $('#timer'),
        bodyBrowse = $('#bodyBrowse'),
        startOrStop= $('#startOrStop'),
        fullArticleLoaded = 'no',
        minScores,
        maxScores,
        currentScores,
        seuil;


    $.getJSON( configPage , function(object){
        config = object;
        seuil = config.circleSeuil ? config.circleSeuil : 1;
    });


    $('.searchKeywords').on('click' , function(){
        var keywordText = $(this).prev().text(),
            teiContent;
        if(fullArticleLoaded === "no") {

            var contenuReplaced;


            fullArticleLoaded = 'yes';
            $('#abstractFullLenght').highlight(keywordText, { wordsOnly: true });
            $('#articleSectionResumeDisplay').highlight(keywordText, { wordsOnly: true });
            if ($("#abstractFullLenght .highlight").length < 1) {
                $('#abstractFullLenght').highlight(keywordText);
                $('#articleSectionResumeDisplay').highlight(keywordText);
            }
            $('#h1DisplayDocs').highlight(keywordText, { wordsOnly: true  , className: 'h1Highlight'});

            if(config.showArticle) {

                // On charge le contenu
                $.get('/dump/' + pageId + '.xml', function (content) {
                    var contenu = (new XMLSerializer()).serializeToString(content);
                    contenuReplaced = contenu.replace(/<head/g, "<div");
                    contenuReplaced = contenuReplaced.replace(/<\/head>/g, "</div>");
                    contenuReplaced = contenuReplaced.replace(/<hi/g, "<i");
                    contenuReplaced = contenuReplaced.replace(/<\/hi>/g, "</i>");

                    $('.contentTei').append(contenuReplaced);

                    fullArticleLoaded = 'yes';
                    teiContent = $("#fullArticleContent text").children().not("front,back");
                    //Recherche dans tous le text
                    teiContent.highlight(keywordText, { wordsOnly: true });
                    console.log(" hit : ", $(".highlight", teiContent));
                    if ($(".highlight", teiContent).length < 1) {
                        teiContent.highlight(keywordText);
                    }
                    $('#buttonFullArticle').trigger("click");
                    $(".contentTei .highlight:first").attr('id', 'firstHighlight');
                    setTimeout(function () {
                        $("#fullArticleSection").animate({scrollTop: $('#firstHighlight').position().top}, 'slow');
                    }, 800);

                });
            }
            else{
                $("#sectionArticle .highlight:first").attr('id', 'firstHighlight');
                setTimeout(function () {
                    $("#sectionArticle").scroller("scroll" , "#sectionArticle #firstHighlight" , 800);
                }, 800);
            }

        }
        else {
            $('body').unhighlight().unhighlight({className: 'h1Highlight'});

            $('#abstractFullLenght').highlight(keywordText, { wordsOnly: true });
            $('#articleSectionResumeDisplay').highlight(keywordText, { wordsOnly: true });
            $('#h1DisplayDocs').highlight(keywordText, { wordsOnly: true  , className: 'h1Highlight'});
            if ($("#abstractFullLenght .highlight").length < 1) {
                $('#abstractFullLenght').highlight(keywordText);
                $('#articleSectionResumeDisplay').highlight(keywordText);
            }

            if(config.showArticle) {
                teiContent = $("#fullArticleContent text").children().not("front,back");
                teiContent.highlight(keywordText, { wordsOnly: true });
                console.log(" hit : ", $(".highlight", teiContent));
                if ($(".highlight", teiContent).length < 1) {
                    teiContent.highlight(keywordText);
                }
                $(".contentTei .highlight:first").attr('id', 'firstHighlight');
                $('#buttonFullArticle').trigger("click");
                if ($('#firstHighlight')) {
                    setTimeout(function () {
                        $("#fullArticleSection").animate({scrollTop: $('#firstHighlight').position().top}, 'slow');
                    }, 700);
                }
            }
            else{
                $("#sectionArticle .highlight:first").attr('id', 'firstHighlight');
                setTimeout(function () {
                    $("#sectionArticle").scroller("scroll" , "#sectionArticle #firstHighlight" , 800);
                }, 800);
            }

        }

    });

    //Hide preference & corresp if options enabled
    var hideElements = function(){

        var notedDiv = $('.methodsKeywords .keywordsMethodsDisplayDone');

        if(config.showPreference) {
            $('input:checked' , notedDiv).each(function(index){
                for(var key in config.showPreference ) {
                    if ($(this).val().toString() === config.showPreference[key].toString()) {
                        var divKeywords = ($(this).parents('.keywordsMethodsDisplayDone'));
                        $('.formNotedKeywordsPref' ,divKeywords).css('display', '').addClass('preferenceAvailable');
                        $('.divComments' , divKeywords).addClass('commentsRight');
                        $('.divCommentsBlocked' , divKeywords).addClass('commentsRight');
                        break;
                    }
                }
            });
        }


        notedDiv = $('#keywordsInist .keywordsMethodsDisplayDone');

        if(config.showCorrespondance) {
            $('input:checked' , notedDiv).each(function(index){
                for(var key in config.showCorrespondance ) {
                    if ($(this).val().toString() === config.showCorrespondance[key].toString()) {
                        var divKeywords = ($(this).parents('.keywordsMethodsDisplayDone'));
                        $('.formNotedKeywordsCorresp' ,divKeywords).css('display', '').addClass('preferenceAvailable');
                        $('.divComments' , divKeywords).addClass('commentsRight');
                        $('.divCommentsBlocked' , divKeywords).addClass('commentsRight');
                        break;
                    }
                }
            });
        }

    };



    // Match content for typehead
    var substringMatcher = function(strs) {
        return function findMatches(q, cb) {
            var matches, substrRegex;

            // an array that will be populated with substring matches
            matches = [];

            // regex used to determine if a string contains the substring `q`
            substrRegex = new RegExp(q, 'i');

            // iterate through the pool of strings and for any string that
            // contains the substring `q`, add it to the `matches` array
            $.each(strs, function(i, str) {
                if (substrRegex.test(str)) {
                    // the typeahead jQuery plugin expects suggestions to a
                    // JavaScript object, refer to typeahead docs for more info
                    matches.push({ value: str });
                }
            });

            cb(matches);
        };
    };

    // Init typeAHead twitter
    var typeAHead = function(data){
        //console.log("source : " , data);
        var inputs = $('.inputComment');
        inputs.typeahead(
            {
                hint: true,
                highlight: true,
                minLength: 1
            },
            {
                name: 'data',
                displayKey: 'value',
                source: substringMatcher(data)
            }
        );
    };

    /**
     *
     * @param content  {ARRAY}
     * @param by {STRING} methode / type
     * @param what {STRING} the value to filter if type is is in by , ex type === method / silence
     * @returns {*}
     */
    var filter = function(content,by,what){
        if(by === "method"){
            var arr = [];
            for(var i = 0 ; i < input.pertinenceMethods.length ; i++){
                arr.push(content.filter(function(content){
                    return (content["method"] === input.pertinenceMethods[i]);
                }));
            }
            return arr;
        }
        if(by === "type"){
            return content.filter(function(content){
                return (content["type"] === what);
            });
        }
        if(by === "score"){
            return content.filter(function(content){
                return (content["score"] || content["score"] === 0);
            });
        }
        if(by === "unserialized") {
            return content.filter(function (content) {
                return content.name != what;
            });
        }

    };

    var designCircles = function(circle,option){
        if(option === "done"){
            if( (!config.circleDesign) || (config.circleDesign === "grey")){
                circle.removeClass("isNotValidated").addClass("isValidated");
            }
            else if(config.circleDesign === "opacity"){
                circle.removeClass("isNotValidated").css("opacity" , "0.2");
            }
            else if(config.circleDesign === "colors"){
                circle.removeClass("isNotValidated").css("border-color" , "#27ae60");
            }
        }
        else if (option === "seuil"){
            if( (!config.circleDesign) || (config.circleDesign === "grey") || (config.circleDesign === "opacity")){
                circle.addClass("isNotValidated");
            }
            else if(config.circleDesign === "colors"){
                circle.css("border-color" , "#e67e22");
            }
        }

    };

    $(".showInformations").on("click" , function(){
        if($(this).hasClass("currentlyShowingInfos")){
            $(".informations").hide();
            $(this).removeClass("currentlyShowingInfos");
        }
        else {
            $(".informations").show();
            $(this).addClass("currentlyShowingInfos");
        }
    });

    $('.informations').on('click' , function() {
        var id = $(this).attr("data-id")
        $(".informations").css('z-index', '0');
        $("#contentDisplay").css("display", "none");
        if (!$("#" + id + " .imgInfos").length){
            $("#" + id).prepend("<img src='" + $("#" + id).attr('data-src') + "' class='imgInfos'/>").delay(650).css("display", "flex");
        }
        else{
            $("#" + id).css("display", "flex")
        }
        $('body').css('overflow' , 'hidden');
    });


    $('.infosQuit').on('click', function(){
        $('body').css('overflow' , '');
        $("#contentDisplay").css("display" ,"");
        $('.informationsContent').hide();
        $(".informations").css('z-index' ,'');
    });

    var saveTime = function(element,type){

        //If it's running (play)
        if($(element).hasClass('isRunning')){

            //Change button clases
            timer.runner('stop');
            $(element).toggleClass('isRunning stopped glyphicon-play glyphicon-pause');
            if(type === "button"){
                $(element).toggleClass('stopedByButton');
            }

            //Get time info
            var timerInfo = timer.runner('info'),
                timeToSave = timerInfo.time;

            //Save Time info to mongo
            $.ajax({
                type: "POST",
                url: savePage,
                data: [
                    { name: "key", value: "timeJob"} ,
                    { name: "val", value: timeToSave}
                ]
            });
        }

        //If it was stopped (stop)
        else if ($(element).hasClass('stopped')){
            timer.runner('start');
            $(element).toggleClass('isRunning stopped glyphicon-play glyphicon-pause');
            if(type === "button"){
                $(element).toggleClass('stopedByButton');
            }
        }
    };

    var calculScores = function(){
        console.log("Max : ", maxScores);
        console.log("Min : " ,minScores);
        currentScores = parseFloat(currentScores);
        console.log("Current : " ,parseFloat(currentScores));

        console.log("semi-good  : " , (((maxScores/2) >= currentScores) &&  (currentScores > (maxScores/4))));
        console.log("maxScores/2" , (maxScores/2));
        console.log("maxScores/4" , (maxScores/4));

        if( (((minScores/2) > currentScores) &&  (currentScores <= (minScores/4))) )
        {
            $(".colored , #sectionArticle .scroller-handle, #headerInfoDisplayDocs .scroller-handle, #keywordsDisplayDiv .scroller-handle").addClass("semiBadDocument").removeClass("semiGoodDocument goodDocument");
        }
        else if( (((maxScores/2) >= currentScores) &&  (currentScores > (maxScores/4))) )
        {
            $(".colored , #sectionArticle .scroller-handle, #headerInfoDisplayDocs .scroller-handle, #keywordsDisplayDiv .scroller-handle").addClass("semiGoodDocument");
        }
        else if(currentScores < (minScores/2))
        {
            $(".colored , #sectionArticle .scroller-handle, #headerInfoDisplayDocs .scroller-handle, #keywordsDisplayDiv .scroller-handle").addClass("badDocument").removeClass("semiGoodDocument goodDocument semiBadDocument");
        }
        else if(currentScores > (maxScores/2))
        {
            $(".colored , #sectionArticle .scroller-handle, #headerInfoDisplayDocs .scroller-handle, #keywordsDisplayDiv .scroller-handle").addClass("goodDocument").removeClass("semiGoodDocument");
        }
        else if((currentScores >= (minScores/4) && (currentScores <= (maxScores/4)))){
            $(".colored , #sectionArticle .scroller-handle, #headerInfoDisplayDocs .scroller-handle, #keywordsDisplayDiv .scroller-handle").removeClass("semiGoodDocument goodDocument semiBadDocument badDocument");
        }

    };


    //Get mongo data
    $.getJSON(contentPage, function (data) {

        // If silence are validated , stop timer at saved score
        var timeJob = data.data.timeJob ? parseFloat(data.data.timeJob) : 0,
            stop = (data.data.fields.validateSilence == "yes") ? timeJob : null;

        maxScores = data.data.fields.maxScores;
        currentScores = parseInt(data.data.fields.currentScores);
        minScores = data.data.fields.minScores;
        if(config.coloredDocument) {
            calculScores();
        }



        // INIT TIMMER
        timer.runner({
            autostart: true,
            startAt: timeJob,
            stopAt : stop,
            milliseconds: true,
            format: function(time){
                var seconds = Math.floor((time / 1000) % 60);
                var minutes = Math.floor((time / (60 * 1000)) % 60);

                return minutes + "mn " + seconds + "s";
            }
        });



        // Click on timer button
        startOrStop.click(function() {

            //If it's running (play)
            if($(this).hasClass('isRunning')){

                //Change button clases
                timer.runner('stop');
                $(this).toggleClass('isRunning stopped glyphicon-play glyphicon-pause stopedByButton');

                //Get time info
                var timerInfo = timer.runner('info'),
                    timeToSave = timerInfo.time;

                //Save Time info to mongo
                $.ajax({
                    type: "POST",
                    url: savePage,
                    data: [
                        { name: "key", value: "timeJob"} ,
                        { name: "val", value: timeToSave}
                    ]
                });
            }

            //If it was stopped (stop)
            else if ($(this).hasClass('stopped')){
                timer.runner('start');
                $(this).toggleClass('isRunning stopped glyphicon-play glyphicon-pause stopedByButton');
            }
        });





        // When mouse leave the work-window
        bodyBrowse.mouseleave(function() {

            //If it's running (play)
            if(startOrStop.hasClass('isRunning')){

                //Change button clases
                timer.runner('stop');
                startOrStop.toggleClass('isRunning stopped glyphicon-play glyphicon-pause');

                //Get time info
                var timerInfo = timer.runner('info'),
                    timeToSave = timerInfo.time;

                //Save Time info to mongo
                $.ajax({
                    type: "POST",
                    url: savePage,
                    data: [
                        { name: "key", value: "timeJob"} ,
                        { name: "val", value: timeToSave}
                    ]
                });

            }
        });



        // When mouse re-enter the work-window
        bodyBrowse.mouseenter(function() {

            // If it was stopped by button
            if(!startOrStop.hasClass('stopedByButton')) {

                //If it was stopped
                if (startOrStop.hasClass('stopped')) {

                    //Restart timer
                    timer.runner('start');
                    startOrStop.toggleClass('isRunning stopped glyphicon-play glyphicon-pause');
                }
            }
        });



        // When click on "LISTE" , returning to documents
        $('#divNavMiddle a').on('click' , function(){

            //Get timer info
            var href = this.href,
                timerInfo = timer.runner('info'),
                timeToSave = timerInfo.time;

            //Save Timer info
            $.ajax({
                type: "POST",
                url: savePage,
                data: [
                    { name: "key", value: "timeJob"} ,
                    { name: "val", value: timeToSave}
                ],
                success: function(){
                    window.location.href = href;
                }
            });

            //Stop default action url
            return false;

        });

        if(data.data.fields.validatePertinence === "yes" || data.data.fields.validateSilence === "yes"){
            $('.divCommentsBlocked').each(function () {
                console.log("divblocked : ", $(".inputComment", this)[0].value);
                if($(".inputComment", this)[0].value){
                    $(this).attr("title", $(".inputComment", this)[0].value);
                }
            });
        }
        if(data.data.fields.validatePertinence === "no") {

            var startPageRatio = 0;

            if (data.data.progressNotedKeywords) {
                startPageRatio = parseFloat(data.data.progressNotedKeywords);
            }

            pertinenceBar.progressbar({ max: 1, value: startPageRatio });

            $(".ui-progressbar-value", pertinenceBar).html((startPageRatio * 100).toFixed() + "%");


            if (startPageRatio <= 0.25) {
                $(".ui-progressbar-value", pertinenceBar).addClass("progress-bar-striped progress-bar-danger progress-bar-striped isDisable");
            }

            if (startPageRatio > 0.25 && startPageRatio <= 0.6) {
                $(".ui-progressbar-value", pertinenceBar).addClass("progress-bar-striped progress-bar-warning isDisable");
            }


            if (startPageRatio > 0.6 && startPageRatio < 1) {
                $(".ui-progressbar-value", pertinenceBar).addClass("progress-bar-striped progress-bar-success isDisable");
            }


            if (startPageRatio === 1) {
                $(".ui-progressbar-value", pertinenceBar).addClass("progress-bar-info");

                if (data.data.fields.validatePertinence === "no") {
                    $(".ui-progressbar-value", pertinenceBar).parent().addClass('isNotValidated');
                    $(".ui-progressbar-value", pertinenceBar).html('100% : VALIDEZ!');
                }


            }


            for(var i = 0 ; i < methodsBut.length ; i++){
                var nb = $(methodsBut[i]).attr("id").split("-")[1],
                    block = $("#method" + nb + "ListOfKeywords"),
                    nbKw = $(".keywordsMethodsDisplay" , block).length;

                $(methodsBut[i]).attr("title" , "Il reste " + nbKw + " mot(s) Pertinence(s)");

                if(nbKw === seuil){
                    designCircles($(methodsBut[i]),"seuil")
                }
                else if(nbKw < 1){
                    designCircles($(methodsBut[i]),"done")
                }

            }



        }

        else if (data.data.fields.validatePertinence === "yes") {

            pertinenceBar.progressbar({ max: 1, value: 1 });

            $(".ui-progressbar-value", pertinenceBar).parent().addClass('isValidated');
            $(".ui-progressbar-value", pertinenceBar).html(" 100%");

            var startPageRatio = 0;

            if (data.data.progressSilenceKeywords) {
                startPageRatio = parseFloat(data.data.progressSilenceKeywords);
            }

            silenceBar.progressbar({ max: 1, value: startPageRatio });

            $(".ui-progressbar-value", silenceBar).html((startPageRatio * 100).toFixed() + "%");


            if (startPageRatio <= 0.25) {
                $(".ui-progressbar-value", silenceBar).addClass("progress-bar-striped progress-bar-danger progress-bar-striped isDisable");
            }

            if (startPageRatio > 0.25 && startPageRatio <= 0.6) {
                $(".ui-progressbar-value", silenceBar).addClass("progress-bar-striped progress-bar-warning isDisable");
            }


            if (startPageRatio > 0.6 && startPageRatio < 1) {
                $(".ui-progressbar-value", silenceBar).addClass("progress-bar-striped progress-bar-success isDisable");
            }


            if (startPageRatio === 1) {
                $(".ui-progressbar-value", silenceBar).addClass("progress-bar-info");

                if (data.data.fields.validateSilence == "no") {
                    $(".ui-progressbar-value", silenceBar).parent().addClass('isNotValidated');
                    $(".ui-progressbar-value", silenceBar).html('100% : VALIDEZ!');
                }
                else if (data.data.fields.validateSilence == "yes") {
                    $(".ui-progressbar-value", silenceBar).parent().addClass('isValidated');
                    $(".ui-progressbar-value", silenceBar).html('100%');
                }



            }

        }

        if((data.data.fields.validatePertinence === "yes") && (data.data.fields.validateSilence === "no")){
            for(var i = 0 ; i < methodsBut.length ; i++){
                var nb = $(methodsBut[i]).attr("id").split("-")[1],
                    nbKw = $("#keywordsInist .keywordsMethodsDisplay[data-nb=" + nb +"]").length;

                $(methodsBut[i]).attr("title" , "Il reste " + nbKw + " mot(s) Silences(s)");

                if( (nbKw <= seuil) && (nbKw > 0 )){
                    designCircles($(methodsBut[i]),"seuil");
                }
                else if(nbKw === 0){
                    designCircles($(methodsBut[i]),"done");
                }
            }
        }

        // If silence are not validated
        if(data.data.fields.validateSilence === "no"){
            //Get config infos & call functions
            typeAHead(config.comments);
            $('.methodLinkround').tooltipster({
                animation: 'fade',
                delay: 200,
                theme: 'tooltipster-light',
                touchDevices: false,
                trigger: 'hover',
                hideOnClick : true
            });
            $('.divCommentsBlocked[title][title!=""] , .divComments[title][title!=""]').tooltipster({
                animation: 'fade',
                delay: 500,
                theme: 'tooltipster-light',
                touchDevices: false,
                trigger: 'hover',
                position: 'bottom',
                hideOnClick : true
            });
            $('.divCommentsBlocked , .divComments ').not("[title]").tooltipster({
                animation: 'fade',
                delay: 500,
                theme: 'tooltipster-light',
                touchDevices: false,
                trigger: 'hover',
                position: 'bottom',
                content : "Commentaire vide",
                hideOnClick : true
            });
        }

        hideElements();


    });

    $(".arrowScroll").on("click" , function(){
        if(!$(this).hasClass("arrowUp")){
            $("#sectionArticle , #keywordsDisplayDiv , #headerInfoDisplayDocs").scroller("scroll", 5000 , 1000);
        }
        else{
            $("#sectionArticle , #keywordsDisplayDiv , #headerInfoDisplayDocs").scroller("scroll", 0 , 1000);
        }
        $(".arrowScroll").toggleClass("arrowUp");
    });


    /* --- DELETE A COMMENT --- */
    $('.trashComment').on('click' , function(){
        var span = $(this);
        var toDelete = $(this).parent('form').children('input[name="key"]').val().toString(),
            arr      = [
                {
                    name : "key",
                    value: toDelete
                },
                {
                    name : "val",
                    value: ""
                }
            ];
        $.ajax({
            type: "POST",
            url: dropPage,
            data: arr,
            error: function(e){
                console.log(" La suppresion à échouée , error : ", e);
            },
            success : function(e){
                console.log(e);

                var divComments = span.parents(".divComments");
                $(".divFormComments", divComments).css("background" , "#27ae60");
                setTimeout(function () {
                    $(".divFormComments" , divComments).css('background', "");
                    $('.inputComment' ,divComments).typeahead('val' , '');
                    $('.quitSpanComment' , divComments).trigger('click');
                }, 750);

            }
        });
    });


    /* --- SHOW/ADD COMMENT--- */

    $('.divComments').on('click', function (e) {
        var divComment = $(this),
            leaveQuiSpan = $('.leaveOrSaveComment' , this),
            quitSpan = $('.quitSpanComment', this),
            saveSpan = $('.saveSpanComment', this),
            etcSpan = $('.etcSpanComment', this),
            divFormComments = $('.divFormComments', this),
            inputComment = $('.inputComment', this),
            otherBtn = $(this).closest('.btn');

        e.stopPropagation();
        otherBtn.siblings().addClass('no-transition');
        otherBtn.siblings().css('opacity', '0');
        otherBtn.siblings().css('visibility', 'hidden');
        otherBtn.css('box-shadow', '8px 11px 78px 31px black');
        otherBtn.css('overflow', 'visible');
        etcSpan.hide();
        //divComment.css('transition','none');  Si trop lent desactiver l'effet;
        divComment.addClass('divCommentsOpened');
        leaveQuiSpan.show();
        quitSpan.css("display" , "flex");
        saveSpan.css("display" , "flex");
        divFormComments.show();
        $('.inputComment', this).focus();
    });

    $(".divComments").on("mouseover" , function(event){
        if($(this).hasClass("divCommentsOpened")){
            event.stopImmediatePropagation();
        }
    });

    $('.inputComment').keydown(function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which),
            postData = $(this).parents('form').serializeArray(),
            input = $(this),
            id = $(this).parent().attr('data-id');
        console.log('data: ' , postData[1].value);
        if (keycode == '13') {
            event.preventDefault();
            $.ajax({
                type: "POST",
                url: savePage,
                data: postData,
                success: function (e) {

                    var divComments = input.parents(".divComments");
                    $(".divFormComments", divComments).css("background" , "#27ae60");
                    $(divComments).tooltipster("content",  postData[1].value);
                    $(".tooltipster-base").hide();
                    setTimeout(function () {
                        $(".divFormComments" , divComments).css('background', "");
                        $(".quitSpanComment" , divComments).css("display" , "");
                        divComments.removeClass('divCommentsOpened');
                        $(".divFormComments" , divComments).hide();
                        $(".etcSpanComment" , divComments).fadeIn();

                        var otherBtn = divComments.closest('.btn');


                        otherBtn.siblings().css('opacity', '');
                        otherBtn.siblings().css('visibility', '');
                        otherBtn.siblings().removeClass('no-transition');
                        otherBtn.css('box-shadow', '');
                        otherBtn.css('overflow', '');
                    }, 750);
                }
            });
        }
        else if (keycode == '27') {
            var divComment = $(this).closest('.divComments'),
                quitSpan = $('.quitSpanComment', divComment),
                etcSpan = $('.etcSpanComment', divComment),
                divFormComments = $('.divFormComments', divComment);
            quitSpan.css("display" , "");
            divComment.removeClass('divCommentsOpened');
            divFormComments.hide();
            etcSpan.fadeIn();
            var otherBtn = $(this).closest('.btn');


            otherBtn.siblings().css('transition', '');
            otherBtn.siblings().css('opacity', '');
            otherBtn.siblings().css('visibility', '');
            otherBtn.css('box-shadow', '');
            otherBtn.css('overflow', '');
        }
    });


    $('.quitSpanComment').on('click', function (e) {
        e.stopPropagation();
        $(this).hide();
        var parr = $(this).parents('.divComments');
        parr.removeClass('divCommentsOpened');
        var otherBtn = $(this).closest('.btn');
        $('.divFormComments', parr).hide();
        $('.etcSpanComment', parr).fadeIn();

        otherBtn.siblings().css('opacity', '');
        otherBtn.siblings().css('visibility', '');
        otherBtn.siblings().removeClass('no-transition');
        otherBtn.css('box-shadow', '');
        otherBtn.css('overflow', '');

    });

    $('.saveSpanComment').on('click', function (e) {
        var span = $(this),
            divComment = $(this).parents('.divComments'),
            form = $('form' ,divComment);
        $.ajax({
            type: "POST",
            url: savePage,
            data: form.serializeArray(),
            success: function (e) {
                var divComments = span.parents(".divComments");
                $(".divFormComments", divComments).css("background", "#27ae60");
                setTimeout(function () {
                    $(".divFormComments", divComments).css('background', "");
                    $(".quitSpanComment", divComments).css("display", "");
                    divComments.removeClass('divCommentsOpened');
                    $(".divFormComments", divComments).hide();
                    $(".etcSpanComment", divComments).fadeIn();
                    var otherBtn = divComments.closest('.btn');


                    otherBtn.siblings().css('opacity', '');
                    otherBtn.siblings().css('visibility', '');
                    otherBtn.siblings().removeClass('no-transition');
                    otherBtn.css('box-shadow', '');
                    otherBtn.css('overflow', '');
                }, 750);
            },
            error: function (e) {
                console.log(e);
            }
        });
    });

    /* --- END SHOW/ADD COMMENT---- */


    /* --- LIST OR GRID --- */

    $('.gridOrListButton').on('click', function () {
        if ($(this).css('opacity') != 1) {
            var id = $(this).attr('id');
            if (id != 'grid') {
                $('.idOfWord').hide();
                $('.methodsKeywords').css('position', 'static');
                $('.keywordsMethodsDisplayDone , .keywordsMethodsDisplay').addClass('keydorsInList');
                $(this).css('opacity', '1');
                $(this).siblings().css('opacity', '');
            }
            else {
                $('.idOfWord').show();
                $('.methodsKeywords').css('position', '');
                $('.keywordsMethodsDisplayDone , .keywordsMethodsDisplay').removeClass('keydorsInList');
                $(this).css('opacity', '1');
                $(this).siblings().css('opacity', '');
            }
        }
    });

    /* --- END LIST OR GRID --- */

    /* --- DISPLAY FULL ARTICLE --- */

    var isFullArticleShow = 'no';

    $('#buttonFullArticle').on('click', function (e) {
        e.stopPropagation();
        if (isFullArticleShow === 'no') {

            $('#contentDisplay').hide();
            $(this).css({
                height: '100%',
                width: '100%',
                opacity: 1
            });

            $('#closeFullArticle').show(400);
            $('#spanFullArticle').hide();

            if (fullArticleLoaded === 'no') {

                var contenuReplaced;
                $.get('/dump/' + pageId + '.xml' , function(content){
                    var contenu =  (new XMLSerializer()).serializeToString(content);
                    contenuReplaced = contenu.replace(/<head/g , "<div");
                    contenuReplaced = contenuReplaced.replace(/<\/head>/g , "</div>");
                    contenuReplaced = contenuReplaced.replace(/<hi/g , "<i");
                    contenuReplaced = contenuReplaced.replace(/<\/hi>/g , "</i>");

                    $('.contentTei').append(contenuReplaced).delay(560);
                    $('#fullArticleSection').delay(560).fadeIn(400).delay(400).addClass('fullArticleSectionShow');
                    fullLoaded = 'yes';
                });

            }
            else {

                $('#fullArticleSection').delay(550).fadeIn().addClass('fullArticleSectionShow');
            }

            isFullArticleShow = 'yes';
            fullLoaded = 'yes'

        }
    });


    $('#closeFullArticle').on('click', function (e) {
        e.stopPropagation();
        isFullArticleShow = 'no';
        $('#closeFullArticle').hide(300);
        $('#buttonFullArticle').css({
            height: '',
            width: '',
            opacity: '',
            overflow: 'hidden'
        });
        $('#fullArticleSection').hide();
        $('#spanFullArticle').fadeIn();
        $('#contentDisplay').fadeIn(450);


    });

    /* --- END DISPLAY  ARTICLE --- */


    /* --- CHANGE SCROLL STYLE --- */

    $("#sectionArticle , #keywordsDisplayDiv , #headerInfoDisplayDocs").scroller({
        customClass: "advanced"
    });


    /* --- END OF CHANGE SCROLL ---*/


    /* --- SHOW INIST KW BY METHOD --- */

    $("#inistKeywordsButton").click(
        function () {

            if ($('#keywordsInist').css('display') == 'none') {
                $(".methodsKeywords").animate({width: '50%'}, 400);
                $('#keywordsInist').show("slide", { direction: "right" }, 500);
                $('span', this).html('Cacher INIST');
                $(this).css({background: '#CC6A63'});
            }
            else {
                $(".methodsKeywords").animate({width: '100%'}, 400);
                $("#keywordsInist").hide("slide", { direction: "right" }, 400);
                $('span', this).html('Afficher INIST');
                $(this).css({background: ''})
            }

        }
    );

    /* --- END OF SHOW INIST ---*/


    /* --- COME BACK TO ABSTRACT --- */

    $("#backAbsctract").on('click', function () {
        if ($("#sectionArticle").css('opacity') !== '0.15') {
            if ($('#abstractFullLenght').css('display') == 'none') {
                $('#listOrGrid span').hide();
                $('#abstractFullLenght').css('display', 'block').siblings().not(".divHoverH1Display").hide();
                $('#keywordsInist').hide();
                $(".methodsKeywords").css('width', '100%');
                $("#inistKeywordsButton ").hide();
                $("#inistKeywordsButton > span").html('Afficher INIST');
                $("#inistKeywordsButton").css('background', 'rgba(204, 106, 99, 0.6)');
                $(".methodLinkround").css('borderColor', '');
                $('#sectionArticle').css('opacity' , '0.15');
            }
        }
    });

    /* --- END OF COME AbSTRACT ---*/


    /* ---CHANGE THE METHOD SHOW --- */

    $(".methodLinkround").click(
        function () {
            var id = $(this).attr('id');
            var nb = id.split('-');
            if ($('#abstractFullLenght').css('display') == 'block') {
                $('#abstractFullLenght').hide();
                $('#sectionArticle').css('opacity', '1');
                $("#keywordsDisplayDiv").show();
                $('#listOrGrid span').show();
                $('#methodButton-' + nb[1]).addClass("onCircle").siblings().removeClass('onCircle');
            }
            if ($("#method" + nb[1] + 'ListOfKeywords').css('display') == 'none') {
                $('.methodsKeywords').not('#method' + nb[1] + 'ListOfKeywords').hide("slide", { direction: "right" }, 500);
                $('#method' + nb[1] + 'ListOfKeywords').show("slide", { direction: "left" }, 500);
                $('#methodButton-' + nb[1]).addClass("onCircle").siblings().removeClass("onCircle");
                $('#keywordsInist .btn-default').hide();
                $('.inistForMethod-' + nb[1]).fadeIn().css('display', '');
            }
            if(($('#inistKeywordsButton').css("display") === "none") && ($("#silenceBar").attr("aria-valuenow") >= 0.001 )){
                $('#inistKeywordsButton').css("display" , "block");
            }
        }
    );

    /* --- END OF CHANGE METHOD ---*/



    /* ---SUBMIT AJAX FORMS --- */

    // Validation

    $('#pertinenceBar , #silenceBar').on('click', function (e) {

        if($(this).attr('id') === "pertinenceBar" ){

            var barre  = $("#pertinenceBar"),
                barreField = "validatePertinence",
                type = "Méthodes";

        }
        else if($(this).attr('id') === "silenceBar" ){

            var barre  = $("#silenceBar"),
                barreField = "validateSilence",
                type = "Inist";

        }

        if(barre.attr('aria-valuenow') != "1"){
            return;
        }

        if (!barre.hasClass('isValidated')) {
            if(confirm('Souhaitez-vous valider définitivement les Mot-Clés ' +  type  + '?')) {

                console.log("Save page  : " , savePage);
                console.log("barreField : " , barreField);

                $.ajax({
                    type: "POST",
                    url: savePage,
                    data: [
                        { name: "key", value: "fields." + barreField } ,
                        { name: "val", value: "yes"}
                    ],
                    success: function (e) {

                        barre.removeClass('isNotValidated').addClass('isValidated');
                        $(".methodLinkround").removeClass("isNotValidated isValidated").removeAttr("style");

                        if(barreField == "validatePertinence"){
                            console.log('pertinence validée');
                            var progressSilence = 0;
                            $.getJSON(contentPage, function (data) {
                                progressSilence = data.data.progressSilenceKeywords ? data.data.progressSilenceKeywords : 0;

                                var silenceRatio = 0;

                                if (progressSilence) {
                                    console.log('progressSilence : ', progressSilence );
                                    silenceRatio = parseFloat(progressSilence);
                                    console.log('silenceRatio : ', silenceRatio );
                                }

                                silenceBar.progressbar({ max: 1, value: silenceRatio });


                                silenceBar.removeClass('hidden');

                                $(".ui-progressbar-value", silenceBar).html((silenceRatio * 100).toFixed() + "%");

                                if (silenceRatio <= 0.25) {
                                    $(".ui-progressbar-value", silenceBar).addClass("progress-bar-striped progress-bar-danger progress-bar-striped isDisable");
                                }

                                if (silenceRatio > 0.25 && silenceRatio <= 0.6) {
                                    $(".ui-progressbar-value", silenceBar).addClass("progress-bar-striped progress-bar-warning isDisable");
                                }


                                if (silenceRatio > 0.6 && silenceRatio < 1) {
                                    $(".ui-progressbar-value", silenceBar).addClass("progress-bar-striped progress-bar-success isDisable");
                                }


                                if (silenceRatio === 1) {
                                    $(".ui-progressbar-value", silenceBar).addClass("progress-bar-info").removeClass('isDisable');

                                    if (data.data.fields.validateSilence == "no") {

                                    }
                                    else if (data.data.fields.validateSilence == "yes") {
                                        $(".ui-progressbar-value", silenceBar).parent().addClass('isValidated');
                                        $(".ui-progressbar-value", silenceBar).html('100%');
                                    }



                                }
                            });
                            var inpuChecked = $('.methodsKeywords .formNotedKeyword input:checked ');
                            $(".methodsKeywords .formNotedKeywordList").prop("disabled", true);
                            $('.methodsKeywords .formNotedKeywordList , .methodsKeywords .divComments').css({
                                background: "grey",
                                color : "white",
                                border : "none"
                            });

                            $(".ui-progressbar-value", barre).removeClass('isNotValidated').addClass('isValidated').html('100%');

                            $('#inistKeywordsButton').show();
                        }
                        else if (barreField == "validateSilence"){
                            $('#timer').runner('stop');
                            $('#startOrStop').hide();
                            var inpuChecked = $('#keywordsInist .formNotedKeyword input:checked ');
                            $('#keywordsInist .formNotedKeywordsPreference , #keywordsInist .divComments').hide();
                            $(".ui-progressbar-value", barre).removeClass('isNotValidated').addClass('isValidated').html('100%');

                            $(".methodsKeywords .formNotedKeywordList").prop("disabled", true);
                            $('#keywordsInist .formNotedKeywordList , #keywordsInist .divComments').css({
                                background: "grey",
                                color : "white",
                                border : "none"
                            });

                        }

                        for( var i = 0 ; i < inpuChecked.length ; i++ ){
                            var label = $("label[for='"+ $(inpuChecked[i]).attr('id')+"']");
                            label.siblings('label').addClass('labelHide');
                            label.addClass('labelBlock');
                        }


                    }
                });
            }
        }

    });

    var previousSelectionId,
        currentIdToDelete;

    $(".formNotedKeyword select").on("click" , function(e){
        e.stopPropagation();
        e.preventDefault();
        previousSelectionId = $(this).find(":selected").attr("data-id");
        currentIdToDelete = $(this).parent().parent().attr("data-id")

        //console.log(" previousSelectionId : " , previousSelectionId);
    });

    $(".formNotedKeyword select option").on("click" , function(e) {
        e.stopPropagation();
        e.preventDefault();

        var type = "",
            estlie = "",
            option = $(this),
            motType = option.val(),
            xmlid = option.attr("data-id"),
            nomLiaison = "",
            btn = option.parent().parent().parent(),
            idBtn = btn.attr("data-id"),
            selector = option.parent();

        if (selector.attr("id").split('-')[2] === "corresp") {
            type = "correspondance";
            nomLiaison = "idCorrespondance";
            estlie = "isCorrespondanceOf";
        }
        else if (selector.attr("id").split('-')[2] === "preference") {
            type = "preference";
            nomLiaison = "idPreference";
            estlie = "isPreferenceOf";
        }

        //Si on souhaite supprimer le correps / pref
        if (motType === "deletemenow") {
            console.log('IL FAUT A TOUT pris supprimer : ' , "keywords." + selector.attr("id").split('-')[4] + "." + nomLiaison);
            $.ajax({
                url: dropPage,
                type: "POST",
                data: [
                    {
                        name: "key",
                        value: "keywords." + selector.attr("id").split('-')[4] + "." + type

                    },
                    {
                        name: "val",
                        value: ""
                    }
                ],
                success : function(e){
                    $.ajax({
                        url: dropPage,
                        type: "POST",
                        data: [
                            {
                                name: "key",
                                value: "keywords." + selector.attr("id").split('-')[4] + "." + nomLiaison

                            },
                            {
                                name: "val",
                                value: ""
                            }
                        ],
                        success : function(){
                            $("option", selector).removeAttr("selected").removeAttr("style");
                            $(option).attr("style", "background: #FF847C;color:#fff");
                            $(selector).prop('selectedIndex', -1);

                            //Affichage contour vert sauvegarde
                            btn.css('box-shadow', '0px 1px 4px 0px green');
                            setTimeout(function () {
                                btn.css('box-shadow', '');
                            }, 750);
                        }
                    });

                    $.getJSON(contentPage, function (data) {
                        data.data.keywords.filter(function (content, index) {

                            var  arrToDelete = [];

                            // Si c'est le mot clé dont on doit supprimer le "estLeCorrespondantDe"
                            if (content["xml#id"] === previousSelectionId) {

                                var oldArr = content[estlie];

                                console.log('Le tableau de liens du mot clés avant le split : ', oldArr);
                                console.log('===================================================');

                                var oldArrSplit = oldArr.split(',,');

                                console.log('Le tableau de liens du mot clés aprés le split : ', oldArrSplit);
                                console.log('===================================================');


                                console.log('LID que lon souhaite supprimé est : ', previousSelectionId, ' OU  ', currentIdToDelete);
                                console.log('===================================================');

                                // var indexArr = $.inArray(currentIdToDelete, oldArrSplit);
                                var indexArr = oldArrSplit.indexOf(currentIdToDelete);

                                console.log('lindex a supprimer dans le tableau est le n° ', indexArr, ' ce qui correspon à :  ', oldArrSplit[indexArr]);
                                console.log('===================================================');


                                //SI l'id a supprimer est dans le tableau
                                if (indexArr > -1) {
                                    var oldArrSplit2 = oldArrSplit.slice(0);
                                    oldArrSplit2.splice(indexArr, 1);

                                    console.log('Aprés le splice le tableau vaut  :  ', oldArrSplit2);
                                    console.log('===================================================');

                                    arrToDelete = oldArrSplit2.join(",,");

                                    console.log('Aprés le join le tableau vaut  :  ', arrToDelete);
                                    console.log('===================================================');

                                    if (arrToDelete === "") {
                                        $.ajax({
                                            url: dropPage,
                                            type: "POST",
                                            data: [
                                                {
                                                    name: "key",
                                                    value: "keywords." + index + "." + estlie

                                                },
                                                {
                                                    name: "val",
                                                    value: ""
                                                }
                                            ],
                                            success: function () {
                                                console.log("est lié bien supprimé");
                                            },
                                            error: function (e) {
                                                console.log("impossible de supprimer , error : ", e);
                                            }
                                        });
                                    }
                                    else {
                                        $.ajax({
                                            url: savePage,
                                            type: "POST",
                                            data: [
                                                {
                                                    name: "key",
                                                    value: "keywords." + index + "." + estlie

                                                },
                                                {
                                                    name: "val",
                                                    value: arrToDelete
                                                }
                                            ],
                                            success: function () {
                                                console.log("est lié bien supprimé");
                                            },
                                            error: function (e) {
                                                console.log("impossible de supprimer , error : ", e);
                                            }
                                        });
                                    }


                                }
                            }
                        });
                    });
                }
            });
        }

        else{
            // Sauvegarde de l'ID
            $.ajax({
                url: savePage,
                type: "POST",
                data: [
                    {
                        name: "key",
                        value: "keywords." + selector.attr("id").split('-')[4] + "." + nomLiaison

                    },
                    {
                        name: "val",
                        value: xmlid
                    }
                ],
                success: function (e) {
                    //console.log('ID bien enregistré');

                    // Sauvegarde du texte
                    $.ajax({
                        url: savePage,
                        type: "POST",
                        data: [
                            {
                                name: "key",
                                value: "keywords." + selector.attr("id").split('-')[4] + "." + type

                            },
                            {
                                name: "val",
                                value: motType
                            }
                        ],
                        success: function (e) {
                            //console.log("Texte bien enregistré");

                            $("option", selector).removeAttr("selected").removeAttr("style");
                            $(option).attr("style", "background: #FF847C;color:#fff");
                            $(option).prop("selected", true);

                            //Affichage contour vert sauvegarde
                            btn.css('box-shadow', '0px 1px 4px 0px green');
                            setTimeout(function () {
                                btn.css('box-shadow', '');
                            }, 750);

                            //Recherche du mot clé pour ajouter "estLeCorrespondantDe" (par ex)
                            $.getJSON(contentPage, function (data) {
                                data.data.keywords.filter(function (content, index) {

                                    var arrToAdd = [],
                                        arrToDelete = [];

                                    // Si c'est le mot clé dont on doit supprimer le "estLeCorrespondantDe"
                                    if (content["xml#id"] === previousSelectionId) {

                                        var oldArr = content[estlie];

                                        console.log('Le tableau de liens du mot clés avant le split : ', oldArr);
                                        console.log('===================================================');

                                        var oldArrSplit = oldArr.split(',,');

                                        console.log('Le tableau de liens du mot clés aprés le split : ', oldArrSplit);
                                        console.log('===================================================');


                                        console.log('LID que lon souhaite supprimé est : ', previousSelectionId, ' OU  ', currentIdToDelete);
                                        console.log('===================================================');

                                        // var indexArr = $.inArray(currentIdToDelete, oldArrSplit);
                                        var indexArr = oldArrSplit.indexOf(currentIdToDelete);

                                        console.log('lindex a supprimer dans le tableau est le n° ', indexArr, ' ce qui correspon à :  ', oldArrSplit[indexArr]);
                                        console.log('===================================================');


                                        //SI l'id a supprimer est dans le tableau
                                        if (indexArr > -1) {
                                            var oldArrSplit2 = oldArrSplit.slice(0);
                                            oldArrSplit2.splice(indexArr, 1);

                                            console.log('Aprés le splice le tableau vaut  :  ', oldArrSplit2);
                                            console.log('===================================================');

                                            arrToDelete = oldArrSplit2.join(",,");

                                            console.log('Aprés le join le tableau vaut  :  ', arrToDelete);
                                            console.log('===================================================');

                                            if (arrToDelete === "") {
                                                $.ajax({
                                                    url: dropPage,
                                                    type: "POST",
                                                    data: [
                                                        {
                                                            name: "key",
                                                            value: "keywords." + index + "." + estlie

                                                        },
                                                        {
                                                            name: "val",
                                                            value: ""
                                                        }
                                                    ],
                                                    success: function () {
                                                        console.log("est lié bien supprimé");
                                                    },
                                                    error: function (e) {
                                                        console.log("impossible de supprimer , error : ", e);
                                                    }
                                                });
                                            }
                                            else {
                                                $.ajax({
                                                    url: savePage,
                                                    type: "POST",
                                                    data: [
                                                        {
                                                            name: "key",
                                                            value: "keywords." + index + "." + estlie

                                                        },
                                                        {
                                                            name: "val",
                                                            value: arrToDelete
                                                        }
                                                    ],
                                                    success: function () {
                                                        console.log("est lié bien supprimé");
                                                    },
                                                    error: function (e) {
                                                        console.log("impossible de supprimer , error : ", e);
                                                    }
                                                });
                                            }


                                        }
                                    }

                                    // Si c'est le mot clé dont on doit ajouté le "estLeCorrespondantDe"
                                    if (content["xml#id"] === xmlid) {

                                        //Si le tableau existe déjà
                                        if (content[estlie]) {
                                            //Si L'id a ajouté n'est pas déjà dedans
                                            var splitted = content[estlie].split(',,');
                                            if ($.inArray(idBtn, splitted) == -1) {
                                                splitted.push(idBtn);
                                            }
                                            arrToAdd = splitted.join(',,');
                                        }
                                        else {
                                            arrToAdd = idBtn;
                                        }

                                        //console.log(data.data.keywords[index]);

                                        $.ajax({
                                            url: savePage,
                                            type: "POST",
                                            data: [
                                                {
                                                    name: "key",
                                                    value: "keywords." + index + "." + estlie
                                                },
                                                {
                                                    name: "val",
                                                    value: arrToAdd
                                                }
                                            ],
                                            success: function () {
                                                console.log("est lié bien enregistré");
                                            },
                                            error: function (e) {
                                                console.log('error lors de l\'ajout :', e)
                                            }
                                        });
                                    }
                                })


                            });

                        }
                    });
                }
            });

        }

    });

    var previousScore;

    $(".formNotedKeyword input:not(:checked) + label").on("mouseover", function(e){
        e.stopPropagation();
        e.preventDefault();
        previousScore = parseInt($(this).siblings(":checked + label" ).text());
        if(!previousScore){
            previousScore = 0;
        }
        console.log("previousScores: " , previousScore);

    });

    // KEYWORDS
    $(".formNotedKeyword input").change(function (e) {
        e.stopPropagation();
        e.preventDefault();
        var id = $(this).parent().attr('id');
        var serialized = $(this).parent().serializeArray(),
            postData = filter(serialized, "unserialized" ,"type"),
            formURL = $(this).parent().attr("action"),
            li = $(this).parent().parent(),
            clickedScore = parseInt($(this).val());

        if($(this).parent().parent().parent().attr("id") === "keywordsInist"){
            clickedScore = parseInt(-(clickedScore));
        }

        console.log("clickedScores: " , clickedScore);

        $('#' + id + ' .loading').html('<span class="loader-quart" style="display: table-cell;"></span>').show();

        $.ajax(
            {
                url: formURL,
                type: "POST",
                data: postData,
                success: function (e) {

                    currentScores += parseInt((parseInt(clickedScore) - parseInt(previousScore)));
                    console.log("curentscore :" , currentScores);
                    if(config.coloredDocument) {
                        calculScores();
                    }

                    $.ajax({
                        url: savePage,
                        type: "POST",
                        data: [
                            {
                                name: "key",
                                value: "fields.currentScores"
                            },
                            {
                                name: "val",
                                value: currentScores
                            }
                        ]
                    });

                    setTimeout(function () {

                        var checkType = (serialized[0].value + "-" + serialized[2].value).toString();

                        $('#' + id + ' .loading').html('<span class="loader-quart-ok" style="display: table-cell;"></span>').fadeOut(750);
                        if (!li.hasClass("keywordsMethodsDisplayDone")) {
                            li.addClass("keywordsMethodsDisplayDone");
                            li.removeClass("keywordsMethodsDisplay");
                        }
                        var isGood = false,
                            methodNb = li.attr("data-nb"),
                            methodConcerned = $("#methodButton-" + methodNb);
                        if((checkType.indexOf('silence') >= 0) && (checkType.indexOf('correspondance') < 0)) { // If it's a silence  notation ( not corresp )
                            console.log("SILENCE !!!");
                            if (config.showCorrespondance) { // If options is enable + isArray
                                for (var key in config.showCorrespondance) { //For all options values
                                    if ((postData[1].value).toString() === (config.showCorrespondance[key]).toString()) { //If sent value is in options
                                        li.children('.formNotedKeywordsCorresp').css('display', '').addClass('preferenceAvailable');
                                        li.children('.divComments').addClass('commentsRight');
                                        isGood = true;
                                        break; //Stop checking options values
                                    }
                                }
                                if(!isGood){
                                    var index  = (postData[0].value).split(".")[1];
                                    li.children('.formNotedKeywordsCorresp').css('display', 'none').removeClass('preferenceAvailable');
                                    li.children('.divComments').removeClass('commentsRight');

                                }
                            }
                            methodConcerned.attr("title" , "Il reste " + $( ".inistForMethod-" + methodNb + ".keywordsMethodsDisplay" , li.parent()).length + " mot(s) Silence(s)");
                            if( $( ".inistForMethod-" + methodNb + ".keywordsMethodsDisplay" , li.parent()).length === seuil){
                                designCircles(methodConcerned,"seuil");
                            }
                            else if( $( ".inistForMethod-" + methodNb + ".keywordsMethodsDisplay" , li.parent()).length < 1){
                                designCircles(methodConcerned,"done");
                            }

                        }
                        else if((checkType.indexOf('pertinence') >= 0) && (checkType.indexOf('preference') < 0)) {// If it's an eval score notation ( not pref )
                            console.log('Pertinence');
                            if (config.showPreference) {// If options is enable + isArray
                                for (key in config.showPreference) {//For all options values
                                    console.log(config.showPreference);
                                    if ((postData[1].value).toString() === (config.showPreference[key]).toString()) {//If sent value is in options
                                        li.children('.formNotedKeywordsPref').css('display', '').addClass('preferenceAvailable');
                                        li.children('.divComments').addClass('commentsRight');
                                        isGood = true;
                                        break; //Stop checking options values
                                    }
                                }
                                if(!isGood){
                                    var index  = (postData[0].value).split(".")[1];
                                    li.children('.formNotedKeywordsPref').css('display', 'none').removeClass('preferenceAvailable');
                                    li.children('.divComments').removeClass('commentsRight');
                                }
                            }

                            methodConcerned.attr("title" , "Il reste " + $(".keywordsMethodsDisplay" , li.parent()).length + " mot(s) Pertinence(s)");
                            if($(".keywordsMethodsDisplay" , li.parent()).length === seuil){
                                designCircles(methodConcerned , "seuil");
                            }
                            else if($(".keywordsMethodsDisplay" , li.parent()).length < 1){
                                designCircles(methodConcerned , "done");
                            }
                            /* $( ".keywordsMethodsDisplay" , li.parent()).length */
                        }

                        console.log("title : " , methodConcerned.attr("title"));
                        methodConcerned.tooltipster("content",  methodConcerned.attr("title"));
                        methodConcerned.attr("title" , "");

                        //Affichage contour vert sauvegarde
                        li.css('box-shadow', '0px 1px 4px 0px green');
                        setTimeout(function () {
                            li.css('box-shadow', '');
                        }, 750);


                        // Check How many Keyworkds Are noted & update progressbar

                        var pageId = $('#pertinenceBar').attr('data-id');

                        $.getJSON(contentPage, function( data ) {


                            var allPertinence = filter(data.data.keywords, "type" , "pertinence"),
                                allSilence = filter(data.data.keywords, "type" , "silence"),
                                notedPertinence = filter(allPertinence, "score"),
                                notedSilence = filter(allSilence, "score"),
                                nbOfTotalSourceKeywords = 0;

                            //console.log('allPertinence ', allPertinence , " allSilence " , allSilence , " notedPertinence ", notedPertinence , " notedSilence " ,notedSilence );


                            if(data.data.fields.validatePertinence === "no") { // Si Les méthodes ne sont pas déjà validées

                                var ratio = notedPertinence.length/allPertinence.length;


                                $.ajax(
                                    {
                                        url: formURL,
                                        type: "POST",
                                        data: [
                                            { name: "key", value: "progressNotedKeywords"} ,
                                            { name: "val", value: ratio}
                                        ]
                                    }
                                );


                                $("#pertinenceBar").progressbar({
                                    value: ratio
                                });


                                if(ratio < 1) {

                                    $("#pertinenceBar .ui-progressbar-value").html((ratio * 100).toFixed() + "%");


                                    if (!($("#pertinenceBar .ui-progressbar-value").hasClass('progress-bar-danger'))) {
                                        if (ratio <= 0.25) {
                                            $("#pertinenceBar .ui-progressbar-value").addClass("progress-bar-danger progress-bar-striped");
                                        }
                                    }

                                    if (!$("#pertinenceBar .ui-progressbar-value").hasClass('progress-bar-warning')) {
                                        if (ratio > 0.25 && ratio <= 0.6) {
                                            $(".ui-progressbar-value").toggleClass("progress-bar-danger progress-bar-warning");
                                        }
                                    }

                                    if (!$("#pertinenceBar .ui-progressbar-value").hasClass('progress-bar-success')) {
                                        if (ratio > 0.6 && ratio < 1) {
                                            $(".ui-progressbar-value").toggleClass("progress-bar-warning progress-bar-success");
                                        }
                                    }
                                }

                                if (ratio == 1) {


                                    if (!$("#pertinenceBar .ui-progressbar-value").hasClass('progress-bar-info')) {
                                        $("#pertinenceBar .ui-progressbar-value").toggleClass("progress-bar-striped progress-bar-success progress-bar-info isDisable isNotValidated");
                                        if (data.data.fields.validateSilence == "no") {
                                            var validateMethodButton = $("#pertinenceBar");
                                            validateMethodButton.addClass('isNotValidated');
                                            $("#pertinenceBar .ui-progressbar-value").html("100% : Validez !");
                                        }

                                    }

                                }
                            }


                            else if(data.data.fields.validatePertinence == "yes") { // SI méthodes sont déjà evaluées

                                var ratio = notedSilence.length/allSilence.length;

                                $.ajax(
                                    {
                                        url: formURL,
                                        type: "POST",
                                        data: [
                                            { name: "key", value: "progressSilenceKeywords"} ,
                                            { name: "val", value: ratio}
                                        ]
                                    }
                                );


                                $("#silenceBar").progressbar({
                                    value: ratio
                                });

                                if(ratio < 1) {


                                    $("#silenceBar .ui-progressbar-value").html((ratio * 100).toFixed() + "%");


                                    if (!($("#silenceBar .ui-progressbar-value").hasClass('progress-bar-danger'))) {
                                        if (ratio <= 0.25) {
                                            $("#silenceBar .ui-progressbar-value").addClass("progress-bar-danger progress-bar-striped");
                                        }
                                    }

                                    if (!$("#silenceBar .ui-progressbar-value").hasClass('progress-bar-warning')) {
                                        if (ratio > 0.25 && ratio <= 0.6) {
                                            $(".ui-progressbar-value").toggleClass("progress-bar-danger progress-bar-warning");
                                        }
                                    }

                                    if (!$("#silenceBar .ui-progressbar-value").hasClass('progress-bar-success')) {
                                        if (ratio > 0.6 && ratio < 1) {
                                            $(".ui-progressbar-value").toggleClass("progress-bar-warning progress-bar-success");
                                        }
                                    }
                                }

                                else if (ratio == 1) {


                                    if (!$("#silenceBar .ui-progressbar-value").hasClass('progress-bar-info')) {


                                        $('#silenceBar').toggleClass("isDisable isNotValidated");

                                        $("#silenceBar .ui-progressbar-value").toggleClass("progress-bar-striped progress-bar-success progress-bar-info isDisable");
                                        if (data.data.fields.validateSilence == "no") {
                                            var validateButton = $("#silenceBar");
                                            validateButton.addClass('isNotValidated').removeClass('isDisable');
                                            $("#silenceBar .ui-progressbar-value").html("100%: Validez!");
                                        }


                                    }
                                }
                            }


                        });



                    }, 900);

                },
                error: function () {

                }
            });
        e.preventDefault(); //STOP default action

    });

    /* --- END OF SUBMIT AJAX ---*/

});