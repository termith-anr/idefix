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
        contentPage = '/display/' + pageId + ".json",
        configPage = "/config.json",
        config = {},
        timer = $('#timer'),
        bodyBrowse = $('#bodyBrowse'),
        startOrStop= $('#startOrStop');


    $.getJSON( configPage , function(object){
        config = object;
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


    //Get mongo data
    $.getJSON(contentPage, function (data) {

            // If silence are validated , stop timer at saved score
            var timeJob = data.data.timeJob ? parseFloat(data.data.timeJob) : 0,
                stop = (data.data.validateSilence == "yes") ? timeJob : null;

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

            // If silence are not validated
            if(data.data.fields.validateSilence == "no"){
                //Get config infos & call functions
                hideElements();
                typeAHead(config.comments);
            }

            if(data.data.fields.validatePertinence == "no") {

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

                    if (data.data.fields.validatePertinence == "no") {
                        $(".ui-progressbar-value", pertinenceBar).parent().addClass('isNotValidated');
                        $(".ui-progressbar-value", pertinenceBar).html('100% : VALIDEZ!');
                    }


                }



            }

            else if (data.data.fields.validatePertinence == "yes") {

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


        });


    /* --- DELETE A COMMENT --- */
    $('.trashComment').on('click' , function(){
        console.log('Je vais te supprimer ! ');
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
                    $('.inputComment' ,divComments).val('');
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

    $('.inputComment').keydown(function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which),
            postData = $(this).parents('form').serializeArray(),
            input = $(this),
            id = $(this).parent().attr('data-id');
            console.log('data: ' , postData);
        if (keycode == '13') {
            event.preventDefault();
            $.ajax({
                type: "POST",
                url: savePage,
                data: postData,
                success: function (e) {

                    var divComments = input.parents(".divComments");
                    $(".divFormComments", divComments).css("background" , "#27ae60");
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

    var isFullArticleShow = 'no',
        fullLoaded = 'no';

    $('#buttonFullArticle').on('click', function (e) {
        e.stopPropagation();
        if (isFullArticleShow == 'no') {

            var id = $('#pertinenceBar').attr('data-id');
            $('#contentDisplay').hide();
            $(this).css({
                height: '100%',
                width: '100%',
                opacity: 1
            });

            $('#closeFullArticle').show(400);
            $('#spanFullArticle').hide();

            if (fullLoaded == 'no') {
                $('#fullArticleSection').load('/dump/' + id + '.xml').delay(560).fadeIn(400).delay(400).addClass('fullArticleSectionShow');
            }
            else {
                $('#fullArticleSection').delay(550).fadeIn();
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

    $("#sectionArticle , #keywordsDisplayDiv").scroller({
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
        if ($(this).css('opacity') !== '0.15') {
            if ($('#abstractFullLenght').css('display') == 'none') {
                $('#listOrGrid span').hide();
                $('#abstractFullLenght').css('display', 'block').siblings().not(".divHoverH1Display").hide();
                $('#keywordsInist').hide();
                $(".methodsKeywords").css('width', '100%');
                $("#inistKeywordsButton ").hide();
                $("#inistKeywordsButton > span").html('Afficher INIST');
                $("#inistKeywordsButton").css('background', 'rgba(204, 106, 99, 0.6)');
                $(".methodLinkround").css('borderColor', '');
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
                $('#methodButton-' + nb[1]).css('borderColor', '#CC6A63').siblings().css('borderColor', '');
            }
            if ($("#method" + nb[1] + 'ListOfKeywords').css('display') == 'none') {
                $('.methodsKeywords').not('#method' + nb[1] + 'ListOfKeywords').hide("slide", { direction: "right" }, 500);
                $('#method' + nb[1] + 'ListOfKeywords').show("slide", { direction: "left" }, 500);
                $('#methodButton-' + nb[1]).css('borderColor', '#CC6A63').siblings().css('borderColor', '');
                $('#keywordsInist .btn-default').hide();
                $('.inistForMethod-' + nb[1]).fadeIn().css('display', '');
            }
        }
    );

    /* --- END OF CHANGE METHOD ---*/



    /* ---SUBMIT AJAX FORMS --- */

    // Validation

    $('#pertinenceBar , #silenceBar').on('click', function (e) {

        if($(this).attr('id') == "pertinenceBar" ){

            var barre  = $("#pertinenceBar"),
                barreField = "validatePertinence",
                type = "Méthodes";

        }
        else if($(this).attr('id') == "silenceBar" ){

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
                        { name: "key", value: barreField} ,
                        { name: "val", value: "yes"}
                    ],
                    success: function (e) {

                        barre.removeClass('isNotValidated').addClass('isValidated');
                        $.ajax({
                            type: "POST",
                            url: savePage,
                            data: [
                                { name: "key", value: "fields." + barreField} ,
                                { name: "val", value: "yes"}
                            ]
                        });

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

                                console.log(silenceBar);

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
                                        $(".ui-progressbar-value", silenceBar).parent().addClass('isNotValidated').removeClass('isDisable');
                                        $(".ui-progressbar-value", silenceBar).html('100% : VALIDEZ!');
                                    }
                                    else if (data.data.fields.validateSilence == "yes") {
                                        $(".ui-progressbar-value", silenceBar).parent().addClass('isValidated');
                                        $(".ui-progressbar-value", silenceBar).html('100%');
                                    }



                                }
                            });
                            var inpuChecked = $('.methodsKeywords .formNotedKeyword input:checked ');
                            $(".methodsKeywords :input").prop("disabled", true);
                            $('.methodsKeywords .formNotedKeywordsPreference , .methodsKeywords .divComments').hide();
                            $(".ui-progressbar-value", barre).removeClass('isNotValidated').addClass('isValidated').html('100%');

                            $('#inistKeywordsButton').show();


                        }
                        else if (barreField == "validateSilence"){
                            $('#timer').runner('stop');
                            $('#startOrStop').hide();
                            var inpuChecked = $('#keywordsInist .formNotedKeyword input:checked ');
                            $("#keywordsInist :input").prop("disabled", true);
                            $('#keywordsInist .formNotedKeywordsPreference , #keywordsInist .divComments').hide();
                            $(".ui-progressbar-value", barre).removeClass('isNotValidated').addClass('isValidated').html('100%');

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

    // KEYWORDS
    $(".formNotedKeyword input, .formNotedKeyword select").change(function (e) {
        var id = $(this).parent().attr('id');
        var serialized = $(this).parent().serializeArray(),
            postData = filter(serialized, "unserialized" ,"type"),
            formURL = $(this).parent().attr("action"),
            li = $(this).parent().parent();

        $('#' + id + ' .loading').html('<span class="loader-quart" style="display: table-cell;"></span>').show();

        $.ajax(
            {
                url: formURL,
                type: "POST",
                data: postData,
                success: function (e) {
                    setTimeout(function () {

                        var checkType = (serialized[0].value + "-" + serialized[2].value).toString();

                        $('#' + id + ' .loading').html('<span class="loader-quart-ok" style="display: table-cell;"></span>').fadeOut(750);
                        if (!li.hasClass("keywordsMethodsDisplayDone")) {
                            li.addClass("keywordsMethodsDisplayDone");
                            li.removeClass("keywordsMethodsisplay");
                        }
                        if((checkType.indexOf('silence') >= 0) && (checkType.indexOf('correspondance') < 0)) { // If it's a silence  notation ( not corresp )
                            console.log("SILENCE !!!");
                            if (config.showCorrespondance) { // If options is enable + isArray
                                for (var key in config.showCorrespondance) { //For all options values
                                    if ((postData[1].value).toString() === (config.showCorrespondance[key]).toString()) { //If sent value is in options
                                        li.children('.formNotedKeywordsCorresp').css('display', '').addClass('preferenceAvailable');
                                        li.children('.divComments').addClass('commentsRight');
                                        break; //Stop checking options values
                                    }
                                    else { //If sent value not in options
                                        li.children('.formNotedKeywordsCorresp').css('display', 'none').removeClass('preferenceAvailable');
                                        li.children('.divComments').removeClass('commentsRight');
                                        if( $('.formNotedKeywordList option:selected' , li).val() != '<corresp>' ){ //If a pref was selected

                                            postData[1].value = '<corresp>';

                                            /*Point to exclude*/
                                            var arr = (postData[0].value).split('.');
                                            arr[(arr.length -1)] = 'correspondance';
                                            postData[0].value = arr.join('.');

                                            $.ajax({
                                                url: formURL,
                                                type: "POST",
                                                data: postData,
                                                success: function (e) {
                                                    $('.formNotedKeywordList option:selected' , li).removeAttr('selected');
                                                }
                                            });
                                        }
                                    }
                                }
                            }
                        }
                        else if((checkType.indexOf('pertinence') >= 0) && (checkType.indexOf('preference') < 0)) {// If it's an eval score notation ( not pref )
                            if (config.showPreference) {// If options is enable + isArray

                                for (key in config.showPreference) {//For all options values
                                    if ((postData[1].value).toString() === (config.showPreference[key]).toString()) {//If sent value is in options
                                        li.children('.formNotedKeywordsPref').css('display', '').addClass('preferenceAvailable');
                                        li.children('.divComments').addClass('commentsRight');
                                        break; //Stop checking options values
                                    }
                                    else {//If sent value not in options
                                        li.children('.formNotedKeywordsPref').css('display', 'none').removeClass('preferenceAvailable');
                                        li.children('.divComments').removeClass('commentsRight');
                                        if( $('.formNotedKeywordList option:selected' , li).val() != '<preference>' ){ //If a pref was selected

                                            postData[1].value = '<preference>';

                                            /*Point to exclude*/
                                            var arr = (postData[0].value).split('.');
                                            arr[(arr.length -1)] = 'preference';
                                            postData[0].value = arr.join('.');

                                            $.ajax({
                                                url: formURL,
                                                type: "POST",
                                                data: postData,
                                                success: function (e) {
                                                    $('.formNotedKeywordList option:selected' , li).removeAttr('selected');
                                                }
                                            });
                                        }
                                    }
                                }
                            }
                        }
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


                            if(data.data.fields.validatePertinence == "no") { // Si Les méthodes ne sont pas déjà validées

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
