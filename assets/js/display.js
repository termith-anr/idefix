/**
 * Created by matthias on 28/10/14.
 */
$(document).ready(function() {


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

            var id = $('#validateButton').attr('data-id');
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
            if ($('#inistKeywordsButton').css('display') == 'none') {
                $('#inistKeywordsButton').css('display', 'block');
            }
        }
    );

    /* --- END OF CHANGE METHOD ---*/


    /* ---SUBMIT AJAX FORMS --- */

    // Validation

    $('#validateButton').on('click', function () {

        var id = $(this).attr('data-id');
        var url = '/save/' + id;

        if (!$(this).hasClass('isValidated')) {
            $.ajax({
                type: "POST",
                url: url,
                data: [
                    { name: "key", value: "validate"} ,
                    { name: "val", value: "yes"}
                ],
                success: function (e) {
                    $('#validateButton').removeClass('isNotValidated').addClass('isValidated');
                    $.ajax({
                        type: "POST",
                        url: url,
                        data: [
                            { name: "key", value: "fields.validate"} ,
                            { name: "val", value: "yes"}
                        ]
                    });
                }
            });
        }
        else {
            $.ajax({
                type: "POST",
                url: url,
                data: [
                    { name: "key", value: "validate"} ,
                    { name: "val", value: "no"}
                ],
                success: function (e) {
                    $('#validateButton').removeClass('isValidated').addClass('isNotValidated');
                    $.ajax({
                        type: "POST",
                        url: url,
                        data: [
                            { name: "key", value: "fields.validate"} ,
                            { name: "val", value: "no"}
                        ]
                    });
                }
            });
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

                        // Check How many Keyworkds Are noted.

                        var pageId = $('#validateButton').attr('data-id');

                        $.getJSON( "/display/" + pageId + ".json", function( data ) {

                            var sourceKeywordsList = data.item.content.json.TEI.teiHeader.profileDesc.textClass.keywords,
                                nbSourceKeywordsListObject = Object.keys(sourceKeywordsList).length,
                                nbOfTotalSourceKeywords = 0;

                            for(var i = 0 ; i < nbSourceKeywordsListObject ; i ++){
                                if( (sourceKeywordsList[i].scheme != "inist-francis") && (sourceKeywordsList[i].scheme != "inist-pascal") && (sourceKeywordsList[i].scheme != "cc") && (sourceKeywordsList[i].scheme != "author") && (sourceKeywordsList[i]["xml#lang"] == "fr" )){
                                    var nbKW = Object.keys(sourceKeywordsList[i].term).length; // Get nb Of Keywords / Method
                                    nbOfTotalSourceKeywords += nbKW;
                                }
                            }


                            var notedKeywordsList = data.item.notedKeywords,
                                nbOfTotalNotedKeywords = 0;

                            for (var key in notedKeywordsList) {
                                var nbOfNotedKw = Object.keys(notedKeywordsList[key]).length; // Get nb Of Noted Keywords / Method
                                nbOfTotalNotedKeywords += nbOfNotedKw;
                            }

                            console.log(nbOfTotalNotedKeywords/nbOfTotalSourceKeywords);

                            if((nbOfTotalNotedKeywords/nbOfTotalSourceKeywords) === 1){
                                $('#validateButton').toggleClass("isDisable isNotValidated");
                                console.log("Tous les KW sont notés");
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
