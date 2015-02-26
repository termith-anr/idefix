/**
 * Created by matthias on 28/10/14.
 */
$(document).ready(function() {



    // ProgressBar & Timer ( getting json info )
    var validateMethodBar = $('#validateMethodBar'),
        validateDocument = $('#validateDocument'),
        pageId = $('#validateMethodBar').attr('data-id'),
        config = {};


    var hideElements = function(){

            //Hide preference & corresp if options enabled
            var notedDiv = $('.methodsKeywords .keywordsMethodsDisplayDone');

            if(config.showPrefered) {
                $('input:checked' , notedDiv).each(function(index){
                    for(var key in config.showPrefered ) {
                        if ($(this).val().toString() === config.showPrefered[key].toString()) {
                            var divKeywords = ($(this).parents('.keywordsMethodsDisplayDone'));
                            $('.formNotedKeywordsPref' ,divKeywords).css('display', '').addClass('preferenceAvailable');
                            $('.divComments' , divKeywords).addClass('commentsRight');
                            break;
                        }
                    }
                });
            }


            notedDiv = $('#keywordsInist .keywordsMethodsDisplayDone');

            if(config.showCorresp) {
                $('input:checked' , notedDiv).each(function(index){
                    for(var key in config.showCorresp ) {
                        if ($(this).val().toString() === config.showCorresp[key].toString()) {
                            var divKeywords = ($(this).parents('.keywordsMethodsDisplayDone'));
                            $('.formNotedKeywordsCorresp' ,divKeywords).css('display', '').addClass('preferenceAvailable');
                            $('.divComments' , divKeywords).addClass('commentsRight');
                            break;
                        }
                    }
                });
            }

        };


    // Pre-Written function by twitter api
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
            console.log("source : " , data);
            var inputs = $('.inputComment'),
                configData = data;
            inputs.typeahead(
                {
                    hint: true,
                    highlight: true,
                    minLength: 1
                },
                {
                name: 'data',
                displayKey: 'value',
                source: substringMatcher(configData)
                }
            );
        };


    $.getJSON("/display/" + pageId + ".json", function (data) {


            var timeJob = data.data.timeJob ? parseFloat(data.data.timeJob) : 0,
                url = '/save/' + pageId,
                stop = (data.data.validationDocument == "yes") ? timeJob : null;

            // INIT TIMMER
            $('#timer').runner({
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

            $('#startOrStop').click(function() {
                if($(this).hasClass('isRunning')){
                    $('#timer').runner('stop');
                    $(this).toggleClass('isRunning stopped glyphicon-play glyphicon-pause stopedByButton');
                    var timerInfo = $('#timer').runner('info'),
                        timeToSave = timerInfo.time;


                    $.ajax({
                        type: "POST",
                        url: url,
                        data: [
                            { name: "key", value: "timeJob"} ,
                            { name: "val", value: timeToSave}
                        ]
                    });
                }

                else if ($(this).hasClass('stopped')){
                    $('#timer').runner('start');
                    $(this).toggleClass('isRunning stopped glyphicon-play glyphicon-pause stopedByButton');
                }
            });

            $('#bodyBrowse').mouseleave(function() {
                if($('#startOrStop').hasClass('isRunning')){
                    $('#timer').runner('stop');
                    $('#startOrStop').toggleClass('isRunning stopped glyphicon-play glyphicon-pause');
                    var timerInfo = $('#timer').runner('info'),
                        timeToSave = timerInfo.time;

                    $.ajax({
                        type: "POST",
                        url: url,
                        data: [
                            { name: "key", value: "timeJob"} ,
                            { name: "val", value: timeToSave}
                        ]
                    });

                }
            });

            $('#bodyBrowse').mouseenter(function() {
                if(!$('#startOrStop').hasClass('stopedByButton')) {
                    if ($('#startOrStop').hasClass('stopped')) {
                        $('#timer').runner('start');
                        $('#startOrStop').toggleClass('isRunning stopped glyphicon-play glyphicon-pause');
                    }
                }
            });

            $('#divNavMiddle a').on('click' , function(){

                var href = this.href,
                    timerInfo = $('#timer').runner('info'),
                    timeToSave = timerInfo.time;


                $.ajax({
                    type: "POST",
                    url: url,
                    data: [
                        { name: "key", value: "timeJob"} ,
                        { name: "val", value: timeToSave}
                    ],
                    success: function(){
                        window.location.href = href;
                    }
                });

                return false;


            });

            if(data.data.fields.validationDocument == "no"){
                $.getJSON( "/config.json" , function(object){
                    config = object;
                    hideElements();
                    typeAHead(config.comments);
                });
            }

            if(data.data.fields.validationMethods == "no") {

                var startPageRatio = 0;

                if (data.data.progressNotedKeywords) {
                    startPageRatio = parseFloat(data.data.progressNotedKeywords);
                }

                validateMethodBar.progressbar({ max: 1, value: startPageRatio });

                $(".ui-progressbar-value", validateMethodBar).html((startPageRatio * 100).toFixed() + "%");


                if (startPageRatio <= 0.25) {
                    $(".ui-progressbar-value", validateMethodBar).addClass("progress-bar-striped progress-bar-danger progress-bar-striped isDisable");
                }

                if (startPageRatio > 0.25 && startPageRatio <= 0.6) {
                    $(".ui-progressbar-value", validateMethodBar).addClass("progress-bar-striped progress-bar-warning isDisable");
                }


                if (startPageRatio > 0.6 && startPageRatio < 1) {
                    $(".ui-progressbar-value", validateMethodBar).addClass("progress-bar-striped progress-bar-success isDisable");
                }


                if (startPageRatio === 1) {
                    $(".ui-progressbar-value", validateMethodBar).addClass("progress-bar-info");

                    if (data.data.fields.validationMethods == "no") {
                        $(".ui-progressbar-value", validateMethodBar).parent().addClass('isNotValidated');
                        $(".ui-progressbar-value", validateMethodBar).html('100% : VALIDEZ!');
                    }


                }



            }

            else if (data.data.fields.validationMethods == "yes") {

                validateMethodBar.progressbar({ max: 1, value: 1 });

                $(".ui-progressbar-value", validateMethodBar).parent().addClass('isValidated');
                $(".ui-progressbar-value", validateMethodBar).html(" 100%");

                var startPageRatio = 0;

                if (data.data.progressSilenceKeywords) {
                    startPageRatio = parseFloat(data.data.progressSilenceKeywords);
                }

                validateDocument.progressbar({ max: 1, value: startPageRatio });

                $(".ui-progressbar-value", validateDocument).html((startPageRatio * 100).toFixed() + "%");


                if (startPageRatio <= 0.25) {
                    $(".ui-progressbar-value", validateDocument).addClass("progress-bar-striped progress-bar-danger progress-bar-striped isDisable");
                }

                if (startPageRatio > 0.25 && startPageRatio <= 0.6) {
                    $(".ui-progressbar-value", validateDocument).addClass("progress-bar-striped progress-bar-warning isDisable");
                }


                if (startPageRatio > 0.6 && startPageRatio < 1) {
                    $(".ui-progressbar-value", validateDocument).addClass("progress-bar-striped progress-bar-success isDisable");
                }


                if (startPageRatio === 1) {
                    $(".ui-progressbar-value", validateDocument).addClass("progress-bar-info");

                    if (data.data.fields.validationDocument == "no") {
                        $(".ui-progressbar-value", validateDocument).parent().addClass('isNotValidated');
                        $(".ui-progressbar-value", validateDocument).html('100% : VALIDEZ!');
                    }
                    else if (data.data.fields.validationDocument == "yes") {
                        $(".ui-progressbar-value", validateDocument).parent().addClass('isValidated');
                        $(".ui-progressbar-value", validateDocument).html('100%');
                    }



                }

            }


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
            ],
            url = '/delete/' + pageId;
        $.ajax({
            type: "POST",
            url: url,
            data: arr,
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
            var url = '/save/' + pageId;
            event.preventDefault();
            $.ajax({
                type: "POST",
                url: url,
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
        var url = '/save/' + pageId,
            span = $(this),
            divComment = $(this).parents('.divComments'),
            form = $('form' ,divComment);
            $.ajax({
                type: "POST",
                url: url,
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

            var id = $('#validateMethodBar').attr('data-id');
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

    $('#validateMethodBar , #validateDocument').on('click', function (e) {

        if($(this).attr('id') == "validateMethodBar" ){

            var barre  = $("#validateMethodBar"),
                barreField = "validationMethods",
                type = "Méthodes";

        }
        else if($(this).attr('id') == "validateDocument" ){

            var barre  = $("#validateDocument"),
                barreField = "validationDocument",
                type = "Inist";

        }


        if(barre.attr('aria-valuenow') != "1"){
            return;
        }

        if (!barre.hasClass('isValidated')) {
            if(confirm('Souhaitez-vous valider définitivement les Mot-Clés ' +  type  + '?')) {

                var id = barre.attr('data-id');
                var url = '/save/' + id;

                $.ajax({
                    type: "POST",
                    url: url,
                    data: [
                        { name: "key", value: barreField} ,
                        { name: "val", value: "yes"}
                    ],
                    success: function (e) {

                        barre.removeClass('isNotValidated').addClass('isValidated');
                        $.ajax({
                            type: "POST",
                            url: url,
                            data: [
                                { name: "key", value: "fields." + barreField} ,
                                { name: "val", value: "yes"}
                            ]
                        });

                        if(barreField == "validationMethods"){
                            var progressDoc = 0;
                            $.getJSON("/display/" + pageId + ".json", function (data) {
                                progressDoc = data.data.progressSilenceKeywords ? data.data.progressSilenceKeywords : 0;
                                validateDocument.show();

                                var startPageRatio = 0;

                                if (data.data.progressSilenceKeywords) {
                                    startPageRatio = parseFloat(data.data.progressSilenceKeywords);
                                }

                                validateDocument.progressbar({ max: 1, value: startPageRatio });

                                $(".ui-progressbar-value", validateDocument).html((startPageRatio * 100).toFixed() + "%");


                                if (startPageRatio <= 0.25) {
                                    $(".ui-progressbar-value", validateDocument).addClass("progress-bar-striped progress-bar-danger progress-bar-striped isDisable");
                                }

                                if (startPageRatio > 0.25 && startPageRatio <= 0.6) {
                                    $(".ui-progressbar-value", validateDocument).addClass("progress-bar-striped progress-bar-warning isDisable");
                                }


                                if (startPageRatio > 0.6 && startPageRatio < 1) {
                                    $(".ui-progressbar-value", validateDocument).addClass("progress-bar-striped progress-bar-success isDisable");
                                }


                                if (startPageRatio === 1) {
                                    $(".ui-progressbar-value", validateDocument).addClass("progress-bar-info").removeClass('isDisable');

                                    if (data.data.fields.validationDocument == "no") {
                                        $(".ui-progressbar-value", validateDocument).parent().addClass('isNotValidated').removeClass('isDisable');
                                        $(".ui-progressbar-value", validateDocument).html('100% : VALIDEZ!');
                                    }
                                    else if (data.data.fields.validationDocument == "yes") {
                                        $(".ui-progressbar-value", validateDocument).parent().addClass('isValidated');
                                        $(".ui-progressbar-value", validateDocument).html('100%');
                                    }



                                }
                            });
                            var inpuChecked = $('.methodsKeywords .formNotedKeyword input:checked ');
                            $(".methodsKeywords :input").prop("disabled", true);
                            $('.methodsKeywords .formNotedKeywordsPreference , .methodsKeywords .divComments').hide();
                            $(".ui-progressbar-value", barre).removeClass('isNotValidated').addClass('isValidated').html('100%');

                            $('#inistKeywordsButton').show();


                        }
                        else if (barreField = "validationDocument"){
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

    // Keywords
    $(".formNotedKeyword input, .formNotedKeyword select").change(function (e) {
        var id = $(this).parent().attr('id');
        var postData = $(this).parent().serializeArray();
        var formURL = $(this).parent().attr("action");
        var li = $(this).parent().parent();


        $('#' + id + ' .loading').html('<span class="loader-quart" style="display: table-cell;"></span>').show();


        $.ajax(
            {
                url: formURL,
                type: "POST",
                data: postData,
                success: function (e) {
                    setTimeout(function () {

                        var checkType = (postData[0].value).toString();

                        $('#' + id + ' .loading').html('<span class="loader-quart-ok" style="display: table-cell;"></span>').fadeOut(750);
                        if (!li.hasClass("keywordsMethodsDisplayDone")) {
                            li.addClass("keywordsMethodsDisplayDone");
                            li.removeClass("keywordsMethodsisplay");
                        }
                        if((checkType.indexOf('silence') >= 0) && (checkType.indexOf('correspondance') <= 0)) { // If it's a silence  notation ( not corresp )
                            if (config.showCorresp) { // If options is enable + isArray
                                for (var key in config.showCorresp) { //For all options values
                                    if ((postData[1].value).toString() === (config.showCorresp[key]).toString()) { //If sent value is in options
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
                        else if((checkType.indexOf('eval') > 0) && (checkType.indexOf('exclude') <= 0)) {// If it's an eval score notation ( not pref )
                            if (config.showPrefered) {// If options is enable + isArray
                                for (key in config.showPrefered) {//For all options values
                                    if ((postData[1].value).toString() === (config.showPrefered[key]).toString()) {//If sent value is in options
                                        li.children('.formNotedKeywordsPref').css('display', '').addClass('preferenceAvailable');
                                        li.children('.divComments').addClass('commentsRight');
                                        break; //Stop checking options values
                                    }
                                    else {//If sent value not in options
                                        li.children('.formNotedKeywordsPref').css('display', 'none').removeClass('preferenceAvailable');
                                        li.children('.divComments').removeClass('commentsRight');
                                        if( $('.formNotedKeywordList option:selected' , li).val() != '<exclude>' ){ //If a pref was selected

                                            postData[1].value = '<exclude>';

                                            /*Point to exclude*/
                                            var arr = (postData[0].value).split('.');
                                            arr[(arr.length -1)] = 'exclude';
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

                        var pageId = $('#validateMethodBar').attr('data-id');

                        $.getJSON( "/display/" + pageId + ".json", function( data ) {

                            var evalKeywords = data.data.keywords.eval,
                                silenceKeywords = data.data.keywords.silence,
                                nbEvalWords = Object.keys(evalKeywords).length, // Number of Eval methods
                                nbSilenceWords = (data.data.keywords.silence[0]['size']) * nbEvalWords, // Number of Silence Keywords * nbEvalWords
                                nbOfTotalSourceKeywords = 0;

                            if(data.data.fields.validationMethods == "no") {


                                for (var i = 0; i < nbEvalWords; i++) {
                                        var nbKW = evalKeywords[i]['size'] ; // Get nb Of Keywords / Method
                                        nbOfTotalSourceKeywords += nbKW;
                                }


                            var notedKeywordsList = data.data.keywords.eval,
                                nbOfTotalNotedKeywords = 0;

                                    for (var key in notedKeywordsList) {
                                            for( i = 0 ; i < (notedKeywordsList[key].term.length) ; i++){
                                                if(notedKeywordsList[key].term[i].score){
                                                    nbOfTotalNotedKeywords++;
                                                }
                                            }
                                    }


                            var ratio = nbOfTotalNotedKeywords/nbOfTotalSourceKeywords;


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


                                $("#validateMethodBar").progressbar({
                                    value: ratio
                                });


                                if(ratio < 1) {

                                    $("#validateMethodBar .ui-progressbar-value").html((ratio * 100).toFixed() + "%");


                                    if (!($("#validateMethodBar .ui-progressbar-value").hasClass('progress-bar-danger'))) {
                                        if (ratio <= 0.25) {
                                            $("#validateMethodBar .ui-progressbar-value").addClass("progress-bar-danger progress-bar-striped");
                                        }
                                    }

                                    if (!$("#validateMethodBar .ui-progressbar-value").hasClass('progress-bar-warning')) {
                                        if (ratio > 0.25 && ratio <= 0.6) {
                                            $(".ui-progressbar-value").toggleClass("progress-bar-danger progress-bar-warning");
                                        }
                                    }

                                    if (!$("#validateMethodBar .ui-progressbar-value").hasClass('progress-bar-success')) {
                                        if (ratio > 0.6 && ratio < 1) {
                                            $(".ui-progressbar-value").toggleClass("progress-bar-warning progress-bar-success");
                                        }
                                    }
                                }

                                if (ratio == 1) {


                                    if (!$("#validateMethodBar .ui-progressbar-value").hasClass('progress-bar-info')) {
                                        $("#validateMethodBar .ui-progressbar-value").toggleClass("progress-bar-striped progress-bar-success progress-bar-info isDisable isNotValidated");
                                        if (data.data.fields.validationDocument == "no") {
                                            var validateMethodButton = $("#validateMethodBar");
                                            validateMethodButton.addClass('isNotValidated');
                                            $("#validateMethodBar .ui-progressbar-value").html("100% : Validez !");
                                        }

                                    }

                                }
                            }


                            else if(data.data.fields.validationMethods == "yes") {




                                var nbNotedSilence = 0;


                                for (var key in silenceKeywords) {
                                    for(var word in silenceKeywords[key].term){
                                            if((silenceKeywords[key].term[word].score) || (silenceKeywords[key].term[word].score == '0' )) {
                                                ++nbNotedSilence;
                                            }
                                        }
                                }

                                //console.log(' nbNotedSilence/nbSilenceWords ' , nbNotedSilence , ' / ' ,nbSilenceWords);


                                var ratio = nbNotedSilence/nbSilenceWords;

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


                                $("#validateDocument").progressbar({
                                    value: ratio
                                });

                                if(ratio < 1) {


                                    $("#validateDocument .ui-progressbar-value").html((ratio * 100).toFixed() + "%");


                                    if (!($("#validateDocument .ui-progressbar-value").hasClass('progress-bar-danger'))) {
                                        if (ratio <= 0.25) {
                                            $("#validateDocument .ui-progressbar-value").addClass("progress-bar-danger progress-bar-striped");
                                        }
                                    }

                                    if (!$("#validateDocument .ui-progressbar-value").hasClass('progress-bar-warning')) {
                                        if (ratio > 0.25 && ratio <= 0.6) {
                                            $(".ui-progressbar-value").toggleClass("progress-bar-danger progress-bar-warning");
                                        }
                                    }

                                    if (!$("#validateDocument .ui-progressbar-value").hasClass('progress-bar-success')) {
                                        if (ratio > 0.6 && ratio < 1) {
                                            $(".ui-progressbar-value").toggleClass("progress-bar-warning progress-bar-success");
                                        }
                                    }
                                }

                                else if (ratio == 1) {


                                    if (!$("#validateDocument .ui-progressbar-value").hasClass('progress-bar-info')) {


                                        $('#validateDocument').toggleClass("isDisable isNotValidated");

                                        $("#validateDocument .ui-progressbar-value").toggleClass("progress-bar-striped progress-bar-success progress-bar-info isDisable");
                                        if (data.data.fields.validationDocument == "no") {
                                            var validateButton = $("#validateDocument");
                                            validateButton.addClass('isNotValidated').removeClass('isDisable');
                                            $("#validateDocument .ui-progressbar-value").html("100%: Validez!");
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
