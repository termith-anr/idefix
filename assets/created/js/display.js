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

    $.ajax({
        url: configPage,
        dataType: 'json',
        async: false,
        success: function(data) {
            config = data;
            seuil = config.circleSeuil ? config.circleSeuil : 1;
        }
    });


    $('.searchKeywords').on('click' , function(){
        var keywordText = $(this).prev().text(),
            teiContent;
        // Si article complet jamais chargé
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
                    if ($(".highlight", teiContent).length < 1) {
                        teiContent.highlight(keywordText);
                    }
                    if ($(".highlight", teiContent).length >= 1) {
                        $('#buttonFullArticle').trigger("click");
                        $(".contentTei .highlight:first").attr('id', 'firstHighlight');
                        setTimeout(function () {
                            $("#fullArticleSection").animate({scrollTop: $('#firstHighlight').position().top}, 'slow');
                        }, 800);
                    }
                    else if( $("#sectionArticle .highlight").length >= 1){
                        $("#sectionArticle .highlight:first").attr('id', 'firstHighlight');
                        setTimeout(function () {
                            $("#sectionArticle").scroller("scroll" , "#sectionArticle #firstHighlight" , 800);
                        }, 800);
                    }
                    else if($("#h1DisplayDocs .h1Highlight").length <= 0){
                        alert("Le mot n'a pa été trouvé ou est présent sous une autre forme");
                    }

                });
            }
            else{
                if ( $("#sectionArticle .highlight").length >= 1 ){
                    $("#sectionArticle .highlight:first").attr('id', 'firstHighlight');
                    setTimeout(function () {
                        $("#sectionArticle").scroller("scroll" , "#sectionArticle #firstHighlight" , 800);
                    }, 800);
                }
                else if($("#h1DisplayDocs .h1Highlight").length <= 0){
                    alert("Le mot n'a pa été trouvé ou est présent sous une autre forme");
                }
            }

        }
        // Si article complet déja chargé
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
                if ($(".highlight", teiContent).length < 1) {
                    teiContent.highlight(keywordText);
                }
                if ($(".highlight", teiContent).length >= 1) {
                    $(".contentTei .highlight:first").attr('id', 'firstHighlight');
                    $('#buttonFullArticle').trigger("click");
                    setTimeout(function () {
                        $("#fullArticleSection").animate({scrollTop: $('#firstHighlight').position().top}, 'slow');
                    }, 700);
                }
                else if ( $("#sectionArticle .highlight").length >= 1 ){
                    $("#sectionArticle .highlight:first").attr('id', 'firstHighlight');
                    setTimeout(function () {
                        $("#sectionArticle").scroller("scroll" , "#sectionArticle #firstHighlight" , 800);
                    }, 800);
                }
                else if($("#h1DisplayDocs .h1Highlight").length <= 0){
                    alert("Le mot n'a pa été trouvé ou est présent sous une autre forme")
                }
            }
            else{
                if ( $("#sectionArticle .highlight").length >= 1 ){
                    $("#sectionArticle .highlight:first").attr('id', 'firstHighlight');
                    setTimeout(function () {
                        $("#sectionArticle").scroller("scroll" , "#sectionArticle #firstHighlight" , 800);
                    }, 800);
                }
                else if($("#h1DisplayDocs .h1Highlight").length <= 0){
                    alert("Le mot n'a pa été trouvé ou est présent sous une autre forme");
                }
            }

        }

    });

    //Hide preference & corresp if options enabled
    var hideElements = function(){

        var notedDiv = $('.methodsKeywords .keywordsMethodsDisplayDone');

        if(config.showPreference) {
            $('input:checked' , notedDiv).each(function(index){
                for(var i = 0 ; i < config.showPreference.length ; i++ ) {
                    if ($(this).val().toString() === config.showPreference[i].toString()) {
                        var divKeywords = ($(this).parents('.keywordsMethodsDisplayDone'));
                        $('.formNotedKeywordsPref' ,divKeywords).css('display', '').addClass('preferenceAvailable');
                        break;
                    }
                }
            });
        }


        notedDiv = $('#keywordsInist .keywordsMethodsDisplayDone');

        if(config.showCorrespondance) {
            $('input:checked' , notedDiv).each(function(index){
                for(var i = 0 ; i < config.showCorrespondance.length ; i++ ) {
                    if ($(this).val().toString() === config.showCorrespondance[i].toString()) {
                        var divKeywords = ($(this).parents('.keywordsMethodsDisplayDone'));
                        $('.formNotedKeywordsCorresp' ,divKeywords).css('display', '').addClass('preferenceAvailable');
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
        currentScores = parseFloat(currentScores);

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
            var imgs = $("#" + id).attr('data-src').split("/;/");
            for(var i = 0 ; i < imgs.length ; i++){
                $("#" + id).prepend("<img src='" + imgs[i] + "' class='imgInfos' style='order : " + i + "'/>").delay(650).css("display", "flex");
            }
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


    //Get mongo data
    $.getJSON(contentPage, function (data) {

        // If silence are validated , stop timer at saved score
        var timeJob = data.data.timeJob ? parseFloat(data.data.timeJob) : 0,
            stop = (data.data.fields.validateSilence == "yes") ? timeJob : null;

        if(config.coloredDocument) {
            maxScores = data.data.fields.maxScores;
            currentScores = parseInt(data.data.fields.currentScores);
            minScores = data.data.fields.minScores;
            calculScores();
        }



        // INIT TIMMER
        timer.runner({
            autostart: true,
            startAt: timeJob,
            stopAt : stop,
            milliseconds: true,
            format: function(time){
                var timeSeconds = (time / 1000),
                    hours = Math.floor(timeSeconds / 3600),
                    minutes = Math.floor((timeSeconds % 3600)/60),
                    seconds = Math.floor((timeSeconds % 3600) - (minutes*60));

                return  hours + "h " + minutes + "mn " + seconds + "s";
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

            $('.divCommentsBlocked').each(function () {
                if($(".inputComment", this)[0].value){
                    $(this).attr("title", $(".inputComment", this)[0].value);
                }
            });

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
        if(data.data.fields.validateSilence === "no" || config.unlockIDEFIX){
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
        }

        hideElements();

        $('.divCommentsBlocked[title][title!=""] , .divComments[title][title!=""]').tooltipster({
            animation: 'fade',
            delay: 250,
            theme: 'tooltipster-light',
            touchDevices: false,
            trigger: 'hover',
            position: 'bottom',
            hideOnClick : true
        });
        $('.divCommentsBlocked , .divComments').not("[title]").tooltipster({
            animation: 'fade',
            delay: 500,
            theme: 'tooltipster-light',
            touchDevices: false,
            trigger: 'hover',
            position: 'bottom',
            content : "Commentaire vide",
            hideOnClick : true
        });
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
        var toDelete = $(this).parents('.divFormComments').children('form').children('input[name="key"]').val().toString(),
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
                var divComments = span.parents(".divComments");
                $(".divFormComments", divComments).css("background" , "#27ae60");
                setTimeout(function () {
                    $(".divFormComments" , divComments).css('background', "");
                    $('.inputComment' ,divComments).typeahead('val' , '');
                    $(divComments).tooltipster("content" , "Commentaire vide");
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
            otherBtn = $(this).closest('.btn'),
            btn = $(this).parents(".btn");

        e.stopPropagation();
        btn.css({
            borderRadius : "0px",
            position: "absolute",
            maxHeight: "none",
            height: "210px",
            width: "375px",
            top: "calc(50% - 125px)",
            left: "calc(50% - 172.5px)"
        });
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
        //Valider
        if (keycode == '13') {
            event.preventDefault();
            $.ajax({
                type: "POST",
                url: savePage,
                data: postData,
                success: function (e) {

                    var divComments = input.parents(".divComments"),
                    divFormComments = $('.divFormComments', divComment);
                    $(".divFormComments", divComments).css("background" , "#27ae60");
                    $(".tooltipster-base").hide();
                    setTimeout(function () {
                        $(".divFormComments" , divComments).css('background', "");
                        $(".quitSpanComment" , divComments).css("display" , "");
                        divComments.removeClass('divCommentsOpened');
                        $(".divFormComments" , divComments).hide();
                        $(".etcSpanComment" , divComments).fadeIn();

                        divFormComments.parents(".btn").removeAttr("style");

                        var otherBtn = divComments.closest('.btn');

                        divComments.parents(".btn").css("border-radius" , "");
                        otherBtn.siblings().css('opacity', '');
                        otherBtn.siblings().css('visibility', '');
                        otherBtn.siblings().removeClass('no-transition');
                        otherBtn.css('box-shadow', '');
                        otherBtn.css('overflow', '');
                    }, 750);
                    $(divComments).tooltipster("content",  postData[1].value);
                }
            });
        }
        //Quiter
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

            divFormComments.parents(".btn").removeAttr("style");
            otherBtn.siblings().css('transition', '');
            otherBtn.siblings().css('opacity', '');
            otherBtn.siblings().css('visibility', '');
            otherBtn.css('box-shadow', '');
            otherBtn.css('overflow', '');
        }
    });


    $('.quitSpanComment').on('click', function (e) {
        e.stopPropagation();
        $(this).parents(".btn").removeAttr("style");
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
            form = $('form' ,divComment),
            postData = form.serializeArray();
        $.ajax({
            type: "POST",
            url: savePage,
            data: form.serializeArray(),
            success: function (e) {
                var divComments = span.parents(".divComments");
                $(".divFormComments", divComments).css("background", "#27ae60");
                $(".tooltipster-base").hide();
                setTimeout(function () {
                    $(".divFormComments", divComments).css('background', "");
                    $(".quitSpanComment", divComments).css("display", "");
                    divComments.removeClass('divCommentsOpened');
                    $(".divFormComments", divComments).hide();
                    $(".etcSpanComment", divComments).fadeIn();
                    var otherBtn = divComments.closest('.btn');
                    span.parents(".btn").removeAttr("style");

                    otherBtn.siblings().css('opacity', '');
                    otherBtn.siblings().css('visibility', '');
                    otherBtn.siblings().removeClass('no-transition');
                    otherBtn.css('box-shadow', '');
                    otherBtn.css('overflow', '');
                }, 750);
                $(divComments).tooltipster("content",  postData[1].value);
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
            if ($('.divOnResume').css('display') == 'none') {
                $('#listOrGrid span').hide();
                $('.divOnResume').css('display', 'flex').siblings().not(".divHoverH1Display").hide();
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
            $("#keywordsInist .magicButton").attr("data-id" , nb[1]);
            if ($('.divOnResume').css('display') == 'flex') {
                $('.divOnResume').hide();
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

                $.ajax({
                    type: "POST",
                    url: savePage,
                    data: [
                        { name: "key", value: "fields." + barreField } ,
                        { name: "val", value: "yes"}
                    ],
                    success: function (e) {

                        barre.removeClass('isNotValidated').addClass('isValidated');
                        $(".methodLinkround").removeClass("isNotValidated isValidated").removeAttr("style").each(function(index, element){
                            var nbMethod = $(element).attr("id").split("-")[1];
                            var nbKwRestant = $("#keywordsInist .btn[data-nb='" + nbMethod + "']").length  - $("#keywordsInist .keywordsMethodsDisplayDone[data-nb='" + nbMethod  + "']").length
                            $(element).tooltipster("content" ,  "Il reste " + nbKwRestant + " mot(s) Silences")
                        });

                        if(barreField == "validatePertinence"){
                            var progressSilence = 0;
                            $.getJSON(contentPage, function (data) {
                                progressSilence = data.data.progressSilenceKeywords ? data.data.progressSilenceKeywords : 0;

                                var silenceRatio = 0;

                                if (progressSilence) {
                                    silenceRatio = parseFloat(progressSilence);
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
                            $(".methodsKeywords .formNotedKeywordList").each(function(){
                                var pref = $("option:selected" , this).val();

                                if( pref && ($("option:selected" , this).val() != "<preference>")){
                                    $(this)
                                        .css({
                                        background: "grey",
                                        color : "white",
                                        border : "none"
                                    })
                                        .prop("disabled", true);
                                }
                                else{
                                    $(this).parents(".formNotedKeywordsPreference").hide();
                                }
                            });
                            $('.methodsKeywords .divComments').each(function(){
                               var comment = $(".tt-input" , this).val();
                                if(comment){
                                    $(this)
                                    .css({
                                    background: "grey",
                                    color : "white",
                                    border : "none"
                                    })
                                    .toggleClass("divCommentsBlocked divComments")
                                    .prop("disabled", true);
                                }
                                else{
                                    $(this).hide();
                                }
                            });

                            $(".ui-progressbar-value", barre).removeClass('isNotValidated').addClass('isValidated').html('100%');

                            $('#inistKeywordsButton').show();
                            $(".methodsKeywords .magicButton").remove();
                        }
                        else if (barreField == "validateSilence"){
                            $('#timer').runner('stop');
                            $('#startOrStop').hide();
                            var inpuChecked = $('#keywordsInist .formNotedKeyword input:checked ');
                            $(".ui-progressbar-value", barre).removeClass('isNotValidated').addClass('isValidated').html('100%');

                            $('#keywordsInist .formNotedKeywordList').each(function(){
                                var corresp = $("option:selected" , this).val();

                                if( corresp && ($("option:selected" , this).val() != "<corresp>")){
                                    $(this)
                                        .css({
                                            background: "grey",
                                            color : "white",
                                            border : "none"
                                        })
                                        .prop("disabled", true);
                                }
                                else{
                                    $(this).parents(".formNotedKeywordsPreference").hide();
                                }
                            });

                            $('#keywordsInist .divComments').each(function(){
                                var comment = $(".tt-input" , this).val();
                                if(comment){
                                    $(this)
                                        .css({
                                            background: "grey",
                                            color : "white",
                                            border : "none"
                                        })
                                        .toggleClass("divCommentsBlocked divComments")
                                        .prop("disabled", true);
                                }
                                else{
                                    $(this).hide();
                                }
                            });

                            $("#keywordsInist .magicButton").remove();

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

    $(".formNotedKeyword select option").on("click" , function(e){
        e.stopPropagation();
        e.preventDefault();
    });

    $(".formNotedKeyword select").on("click" , function(e){
        e.stopPropagation();
        e.preventDefault();
        previousSelectionId = $(this).find(":selected").attr("data-id");
        currentIdToDelete = $(this).parents(".keywordsMethodsDisplayDone").attr("data-id");
    });

    $(".formNotedKeywordList").on("change" , function(e) {

        e.stopPropagation();
        e.preventDefault();

        var type = "",
            estlie = "",
            option = $(this),
            motType = option.val(),
            btn = option.parents(".keywordsMethodsDisplayDone"),
            xmlid = $("option[value='" + motType +"']" , btn).attr("data-id"),
            nomLiaison = "",
            idBtn = btn.attr("data-id"),
            selector = $("select" , btn);

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
                            $("option[value='" + motType + "']" , btn).attr("style", "background: #FF847C;color:#fff");
                            $(selector).prop('selectedIndex', -1).parents("form").attr("title" , "Ce lien vient d'être supprimé !");

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

                                var oldArrSplit = oldArr.split(',,');

                                // var indexArr = $.inArray(currentIdToDelete, oldArrSplit);
                                var indexArr = oldArrSplit.indexOf(currentIdToDelete);

                                //SI l'id a supprimer est dans le tableau
                                if (indexArr > -1) {
                                    var oldArrSplit2 = oldArrSplit.slice(0);
                                    oldArrSplit2.splice(indexArr, 1);

                                    arrToDelete = oldArrSplit2.join(",,");

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
                            $(".formNotedKeywordsPreference" ,btn).attr("title" , motType);
                            $("option", selector).removeAttr("selected").removeAttr("style");
                            $("option[value='" + motType + "']" , btn).attr("style", "background: #FF847C;color:#fff");
                            $("option[value='" + motType + "']" , btn).prop("selected", true);

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

                                        var oldArrSplit = oldArr.split(',,');

                                        // var indexArr = $.inArray(currentIdToDelete, oldArrSplit);
                                        var indexArr = oldArrSplit.indexOf(currentIdToDelete);

                                        //SI l'id a supprimer est dans le tableau
                                        if (indexArr > -1) {
                                            var oldArrSplit2 = oldArrSplit.slice(0);
                                            oldArrSplit2.splice(indexArr, 1);

                                            arrToDelete = oldArrSplit2.join(",,");

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

    $(".formNotedKeyword input + label").on("mouseover", function(e){
        e.stopPropagation();
        e.preventDefault();
        var form = $(this).parent();
        previousScore = parseInt($(":checked + label", form).text());

    });

    // KEYWORDS
    $(".formNotedKeyword input").change(function (e) {
        e.stopPropagation();
        e.preventDefault();
        var id = $(this).parent().attr('id');
        var serialized = $(this).parent().serializeArray(),
            postData = filter(serialized, "unserialized" ,"type"),
            form = $(this).parent(),
            formURL = form.attr("action"),
            li = $(this).parent().parent(),
            clickedScore = parseInt($(this).val());

        if((previousScore === 0) && ($(this).parent().parent().parent().attr("id") === "keywordsInist") && (clickedScore == 1 || clickedScore == 2)){
            $("select" , li).click();
            $("select" , li).val("deletemenow").change();
        }
        else if((previousScore === 1) && ($(this).parent().parent().parent().attr("class") === "methodsKeywords")  && (clickedScore == 0 || clickedScore == 2)){
            $("select" , li).val("deletemenow").change();
        }


        $('#' + id + ' .loading').html('<span class="loader-quart" style="display: table-cell;"></span>').show();

        $.ajax(
            {
                url: formURL,
                type: "POST",
                data: postData,
                success: function (e) {


                    if(config.coloredDocument) {
                        currentScores += parseInt((parseInt(clickedScore) - parseInt(previousScore)));
                        calculScores();
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
                    }

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
                            if (config.showCorrespondance) { // If options is enable + isArray
                                for (var i = 0 ; i< config.showCorrespondance.length ; i++) { //For all options values
                                    if ((postData[1].value).toString() === (config.showCorrespondance[i]).toString()) { //If sent value is in options
                                        $('.formNotedKeywordsCorresp' , li).css('display', 'inline-block');
                                        $('.divComments' , li).css('display' , 'inline-block');
                                        isGood = true;
                                        break; //Stop checking options values
                                    }
                                }
                                if(!isGood){
                                    var index  = (postData[0].value).split(".")[1];
                                    $('.formNotedKeywordsCorresp' , li).css('display', 'none').removeClass('preferenceAvailable');
                                    $('.divComments' , li).css('display', '');

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
                            if (config.showPreference) {// If options is enable + isArray
                                for(var i = 0 ; i < config.showPreference.length ; i++) {//For all options values
                                    if ((postData[1].value).toString() === (config.showPreference[i]).toString()) {//If sent value is in options
                                        $('.formNotedKeywordsPref' , li).css('display', 'inline-block');
                                        $('.divComments', li).css('display' , 'inline-block');
                                        isGood = true;
                                        break; //Stop checking options values
                                    }
                                }
                                if(!isGood){
                                    var index  = (postData[0].value).split(".")[1];
                                    $('.formNotedKeywordsPref' , li).css('display', 'none').removeClass('preferenceAvailable');
                                    $('.divComments' , li).css('display' , '');
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

                        methodConcerned.tooltipster("content",  methodConcerned.attr("title"));
                        methodConcerned.attr("title" , "");

                    }, 900);

                },
                error: function () {

                }
            });
        e.preventDefault(); //STOP default action

    });

    /* --- END OF SUBMIT AJAX ---*/

    $(".magicButton").on("click" , function(){

        $("body").children().css({
            filter : "grayscale(100%)",
            opacity : 0.6
        });
        $("body").append("<div class='infoMessage'><span class='loader-quart' style='display: table-cell;'></span></div>");

        var nb = $(this).attr("data-id"),
            type = $(this).attr("data-type"),
            nbMatch = 0 ,
            arr = [],
            currentKwdsList = (type === "method") ? $(".btn" , "#method" + nb + "ListOfKeywords") : $(".inistForMethod-" + nb , "#keywordsInist"),
            otherKwdsList = (type === "method") ? $("#method" + nb + "ListOfKeywords").siblings(".methodsKeywords")  : $(".inistForMethod-" + nb, "#keywordsInist").siblings(".btn:not(.inistForMethod-" + nb + ")");

            // Pour chaque mot termith en cours
            currentKwdsList.each(function(index, value){
                var currentKw = value,
                    currentWord = $(".keywordsText" , currentKw).text().toUpperCase(),
                    currentScore = $("input:checked" , currentKw) ? $("input:checked" , currentKw).val() : null;


                if(type === "method"){
                    otherKwdsList
                        // Pour chaque autre méthode
                        .each(function (index, value) {
                            var otherMethod = value;
                            // Pour chaque autre mot dans l'autre méthode :
                            $("input:checked", otherMethod).parents(".btn").each(function(index, value){
                                var otherKw = value,
                                    otherWord = $(".keywordsText", otherKw).text().toUpperCase(),
                                    otherScore = $("input:checked", otherKw) ? $("input:checked", otherKw).val() : null;
                                // Si mots sont identiques & le mot n'a pas déjà été noté & (le mot en cours ne posséde pas de score ou les cores sont differents)
                                if ((currentWord === otherWord) && (arr.indexOf(otherWord) <= -1) && (!currentScore && currentScore!= 0) && (otherScore)) {
                                    arr.push(otherWord);
                                    var currentKey = $(".formNotedKeyword input[type='hidden'][name='key']", currentKw).val().split(".")[1],
                                        current2Check = $(".formNotedKeyword input[type='radio'][value='" + otherScore + "']", currentKw).attr("id"),
                                        otherComment = $(".tt-input", otherKw).val();

                                    $("label[for='" + current2Check + "']").trigger("click");
                                    nbMatch++;
                                    //Envoi du commentaire
                                    $.ajax(
                                        {
                                            url: savePage,
                                            type: "POST",
                                            data: [
                                                { name: "key", value: "keywords." + currentKey + ".comment"} ,
                                                { name: "val", value: otherComment}
                                            ],
                                            success: function () {
                                                $(".inputComment", currentKw).typeahead('val', otherComment);
                                                $(".divComments", currentKw).tooltipster("content", otherComment);

                                            }
                                        }
                                    );
                                }
                            });
                        });
                }
                else if (type === "silence"){
                    otherKwdsList
                        // Pour chaque uutres mots
                        .each(function(index, value){
                            var otherKw = value,
                                otherWord = $(".keywordsText", otherKw).text().toUpperCase(),
                                otherScore = $("input:checked", otherKw) ? $("input:checked", otherKw).val() : null;
                            // Si mots sont identiques & (le mot en cours ne posséde pas de score ou les cores sont differents)
                            if ((currentWord === otherWord) && (arr.indexOf(otherWord) <= -1) && (!currentScore && currentScore!= 0) && (otherScore) ) {
                                arr.push(otherWord);
                                var currentKey = $(".formNotedKeyword input[type='hidden'][name='key']", currentKw).val().split(".")[1],
                                    current2Check = $(".formNotedKeyword input[type='radio'][value='" + otherScore + "']", currentKw).attr("id"),
                                    otherComment = $(".tt-input", otherKw).val();

                                $("label[for='" + current2Check + "']").trigger("click");
                                nbMatch++;
                                //Envoi du commentaire
                                $.ajax(
                                    {
                                        url: savePage,
                                        type: "POST",
                                        data: [
                                            { name: "key", value: "keywords." + currentKey + ".comment"} ,
                                            { name: "val", value: otherComment}
                                        ],
                                        success: function () {
                                            $(".inputComment", currentKw).typeahead('val', otherComment);
                                            $(".divComments", currentKw).tooltipster("content", otherComment);
                                        }
                                    }
                                );
                            }
                        });

                }
            });
            setTimeout(function(){
                $(".infoMessage").html( nbMatch + " mot(s) traité(s) !").delay(750).fadeOut(750 ,function() {
                    $(this).remove();
                    $("body").children().css({
                        filter : "",
                        opacity : ""
                    });
                });
            }, 750);

    });
});