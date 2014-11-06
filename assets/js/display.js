/**
 * Created by matthias on 28/10/14.
 */
$(document).ready(function() {

    var validateMethodBar = $('#validateMethodBar'),
        validateDocument = $('#validateDocument'),
        pageId = $('#validateMethodBar').attr('data-id');


        $.getJSON("/display/" + pageId + ".json", function (data) {

            if(data.item.fields.validationMethods == "no") {

                var startPageRatio = 0;

                if (data.item.progressNotedKeywords) {
                    startPageRatio = parseFloat(data.item.progressNotedKeywords);
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

                    if (data.item.fields.validationMethods == "no") {
                        $(".ui-progressbar-value", validateMethodBar).parent().addClass('isNotValidated');
                        $(".ui-progressbar-value", validateMethodBar).html('100% : VALIDEZ');
                    }


                }



            }

            else if (data.item.fields.validationMethods == "yes") {

                validateMethodBar.progressbar({ max: 1, value: 1 });

                $(".ui-progressbar-value", validateMethodBar).parent().addClass('isValidated');
                $(".ui-progressbar-value", validateMethodBar).html(" 100%");

                var startPageRatio = 0;

                if (data.item.progressSilenceKeywords) {
                    startPageRatio = parseFloat(data.item.progressSilenceKeywords);
                }

                validateDocument.progressbar({ max: 1, value: startPageRatio });

                $(".ui-progressbar-value", validateDocument).html((startPageRatio * 100).toFixed() + "%");


                if (validateDocument <= 0.25) {
                    $(".ui-progressbar-value", validateDocument).addClass("progress-bar-striped progress-bar-danger progress-bar-striped isDisable");
                }

                if (validateDocument > 0.25 && startPageRatio <= 0.6) {
                    $(".ui-progressbar-value", validateDocument).addClass("progress-bar-striped progress-bar-warning isDisable");
                }


                if (validateDocument > 0.6 && startPageRatio < 1) {
                    $(".ui-progressbar-value", validateDocument).addClass("progress-bar-striped progress-bar-success isDisable");
                }


                if (startPageRatio === 1) {
                    $(".ui-progressbar-value", validateDocument).addClass("progress-bar-info");

                    if (data.item.fields.validationMethods == "no") {
                        $(".ui-progressbar-value", validateDocument).parent().addClass('isNotValidated');
                        $(".ui-progressbar-value", validateDocument).html('100% : VALIDEZ');
                    }


                }

                if (data.item.fields.validationDocument == "yes") {

                }

            }


        });




    /* --- SHOW/ADD COMMENT--- */

    $('.divComments').on('click', function (e) {
        var divComment = $(this),
            quitSpan = $('.quitSpanComment', this),
            etcSpan = $('.etcSpanComment', this),
            divFormComments = $('.divFormComments', this);
        e.stopPropagation();
        etcSpan.hide();
        divComment.addClass('divCommentsOpened');
        quitSpan.show();
        divFormComments.show();
        $('.inputComment', this).focus();
    });

    $('.inputComment').keydown(function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        var postData = $(this).parent().serializeArray();
        var id = $(this).parent().attr('data-id');
        var input = $(this);
        if (keycode == '13') {
            var url = '/save/' + id;
            event.preventDefault();
            $.ajax({
                type: "POST",
                url: url,
                data: postData,
                success: function (e) {
                    input.css({
                        'box-shadow': '0px 2px 4px 0px green'
                    });
                    setTimeout(function () {
                        input.css('box-shadow', '');
                    }, 750);
                }
            });
        }
        else if (keycode == '27') {
            var divComment = $(this).closest('.divComments'),
                quitSpan = $('.quitSpanComment', divComment),
                etcSpan = $('.etcSpanComment', divComment),
                divFormComments = $('.divFormComments', divComment);
            quitSpan.hide();
            divComment.removeClass('divCommentsOpened');
            divFormComments.hide();
            etcSpan.fadeIn();
        }
    });

    $('.quitSpanComment').on('click', function (e) {
        e.stopPropagation();
        $(this).hide();
        var parr = $(this).parent();
        parr.removeClass('divCommentsOpened');
        $('.divFormComments', parr).hide();
        $('.etcSpanComment', parr).fadeIn();

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

    $("#sectionArticle").on('click', function () {
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
                barreField = "validationMethods";

        }
        else if($(this).attr('id') == "validateDocument" ){

            var barre  = $("#validateDocument"),
                barreField = "validationDocument";

        }

        console.log(barreField);



        if(barre.attr('aria-valuenow') != "1"){
            return;
        }

        if (!barre.hasClass('isValidated')) {
            if(confirm('Souhaitez-vous valider définitivement les Mot-Clés Méthodes ?')) {

                var id = barre.attr('data-id');
                var url = '/save/' + id;

                console.log( "url1 : " , url );


                $.ajax({
                    type: "POST",
                    url: url,
                    data: [
                        { name: "key", value: barreField} ,
                        { name: "val", value: "yes"}
                    ],
                    success: function (e) {

                        console.log( "urlprofond : " , url );

                        barre.removeClass('isNotValidated').addClass('isValidated');
                        $.ajax({
                            type: "POST",
                            url: url,
                            data: [
                                { name: "key", value: "fields." + barreField} ,
                                { name: "val", value: "yes"}
                            ],
                            success : function(){
                                console.log(" fields passé ");
                            }
                        });

                        if(barreField == "validationMethods"){
                            var inpuChecked = $('.methodsKeywords .formNotedKeyword input:checked ');
                            $(".methodsKeywords :input").prop("disabled", true);
                            $('.methodsKeywords .formNotedKeywordsPreference , .divComments').hide();
                            validateDocument.progressbar({ max: 1, value: 0 });
                            validateDocument.show();

                            $('#inistKeywordsButton').show();


                        }
                        else if (barreField = "validationDocument"){
                            var inpuChecked = $('#keywordsInist .formNotedKeyword input:checked ');
                            $("#keywordsInist :input").prop("disabled", true);
                            $('#keywordsInist .formNotedKeywordsPreference , .divComments').hide();
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
                        $('#' + id + ' .loading').html('<span class="loader-quart-ok" style="display: table-cell;"></span>').fadeOut(750);
                        if (!li.hasClass("keywordsMethodsDisplayDone")) {
                            li.addClass("keywordsMethodsDisplayDone");
                            li.removeClass("keywordsMethodsisplay");
                            li.children('.formNotedKeywordsPreference').css('display', '');
                        }
                        li.css('box-shadow', '0px 1px 4px 0px green');
                        setTimeout(function () {
                            li.css('box-shadow', '');
                        }, 750);


                        // Check How many Keyworkds Are noted & update progressbar

                        var pageId = $('#validateMethodBar').attr('data-id');

                        $.getJSON( "/display/" + pageId + ".json", function( data ) {

                            var sourceKeywordsList = data.item.content.json.TEI.teiHeader.profileDesc.textClass.keywords,
                                nbSourceKeywordsListObject = Object.keys(sourceKeywordsList).length,
                                nbOfTotalSourceKeywords = 0;

                            if(data.item.fields.validationMethods == "no") {


                                for (var i = 0; i < nbSourceKeywordsListObject; i++) {
                                    if ((sourceKeywordsList[i].scheme != "inist-francis") && (sourceKeywordsList[i].scheme != "inist-pascal") && (sourceKeywordsList[i].scheme != "cc") && (sourceKeywordsList[i].scheme != "author") && (sourceKeywordsList[i]["xml#lang"] == "fr" )) {
                                        var nbKW = Object.keys(sourceKeywordsList[i].term).length; // Get nb Of Keywords / Method
                                        nbOfTotalSourceKeywords += nbKW;
                                    }
                                }


                            var notedKeywordsList = data.item.notedKeywords,
                                nbOfTotalNotedKeywords = 0;

                                    for (var key in notedKeywordsList) {
                                        if((key.indexOf("inist")) == -1) {
                                            var nbOfNotedKw = Object.keys(notedKeywordsList[key]).length; // Get nb Of Noted Keywords / Method
                                            nbOfTotalNotedKeywords += nbOfNotedKw;
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


                                if (ratio === 1) {
                                    $('#validateMethodBar').toggleClass("isDisable isNotValidated");
                                }


                                $("#validateMethodBar").progressbar({
                                    value: ratio
                                });

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

                                if (!$("#validateMethodBar .ui-progressbar-value").hasClass('progress-bar-info')) {
                                    if (ratio === 1) {
                                        $("#validateMethodBar .ui-progressbar-value").toggleClass("progress-bar-striped progress-bar-success progress-bar-info");
                                        if (data.item.fields.validate == "no") {
                                            var validateMethodButton = $("#validateMethodBar");
                                            validateMethodButton.addClass('isNotValidated');
                                            $("#validateMethodBar .ui-progressbar-value").html("METHODES : 100% , VALIDEZ");
                                        }

                                    }

                                }
                            }


                            else if(data.item.fields.validationMethods == "yes") {


                                for (var i = 0; i < nbSourceKeywordsListObject; i++) {
                                    if (((sourceKeywordsList[i].scheme == "inist-francis") || (sourceKeywordsList[i].scheme == "inist-pascal")) && (sourceKeywordsList[i]["xml#lang"] == "fr" )) {
                                        var nbKW = Object.keys(sourceKeywordsList[i].term).length; // Get nb Of Keywords / Method
                                        nbOfTotalSourceKeywords += nbKW;
                                        nbOfTotalSourceKeywords *= 2;
                                    }
                                }


                                var notedKeywordsList = data.item.notedKeywords,
                                    nbOfTotalSilenceKeywords = 0;


                                for (var key in notedKeywordsList) {
                                    if(key.indexOf("inist") > -1) {
                                        for(var method in notedKeywordsList[key]){
                                            var nbOfNotedKw = Object.keys(notedKeywordsList[key][method]).length;
                                            nbOfTotalSilenceKeywords += nbOfNotedKw;
                                        }

                                    }
                                }


                                var ratio = nbOfTotalSilenceKeywords/nbOfTotalSourceKeywords;


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


                                if (ratio === 1) {
                                    $('#validateDocument').toggleClass("isDisable isNotValidated");
                                }


                                $("#validateDocument").progressbar({
                                    value: ratio
                                });

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

                                if (!$("#validateDocument .ui-progressbar-value").hasClass('progress-bar-info')) {
                                    if (ratio === 1) {
                                        $("#validateDocument .ui-progressbar-value").toggleClass("progress-bar-striped progress-bar-success progress-bar-info");
                                        if (data.item.fields.validate == "no") {
                                            var validateMethodButton = $("#validateDocument");
                                            validateMethodButton.addClass('isNotValidated');
                                            $("#validateDocument .ui-progressbar-value").html("INIST : 100% , VALIDEZ");
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
