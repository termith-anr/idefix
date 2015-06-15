//document.location.href = '/browse.html';

$(document).ready(function() {

    // Config DataTable
    var oTable = $('#browseTable').dataTable({
            "search" : {
                "regex" : true
            },
            ordering: true,
            dom : "ilfrtp",
            info : true,
            ajax: "/browse.json?flying=listeDocuments",
            serverSide: true,
            lengthMenu : [15,1,3,5,10,25,50,100,200,500],
            "language": {
                "emptyTable":     "Aucun document présent",
                "lengthMenu": " _MENU_ Document(s) / page",
                "search": "Rechercher:",
                "zeroRecords": "Aucun résultat ...",
                "info": "Il y a _TOTAL_ résultat(s)",
                "infoFiltered": "( filtrés sur _MAX_ )",
                "paginate": {
                    "previous": "Précédent",
                    "next" : "Suivant"
                }
            },
            columns: [
                { data: 'wid' , visible : false , searchable: false},
                { data: 'fields.validateSilence', visible : false , searchable: false},
                { data: 'basename' , className: "browseYear browseTd", searchable: true},
                { data: 'fields.title' , className: "browseTitle browseTd", searchable: true}
            ],
            stateSave: true,

            "fnCreatedRow": function( row, td, index ) {

                var rowValue = oTable.fnGetData( index );

                // IF Silence is 100% validated
                if(rowValue['fields']['validateSilence'] === "yes"){

                    $(row).attr('class', 'trValidate');

                }
                // IF Methods are 100% validated but Silence no
                else if((rowValue['fields']['validatePertinence'] === "yes") && (rowValue['fields']['validateSilence'] === "no")) {

                    var ratioSilence = rowValue['progressSilenceKeywords'] ? parseFloat(rowValue['progressSilenceKeywords'])*100 + "%" : 0;

                    $(".browseTitle" ,row).css({
                        "background": "rgba(69,69,69,0.1",
                        "background": "-moz-linear-gradient(left, rgba(69,69,69,0.1) " + ratioSilence + ", transparent " + ratioSilence + ")",
                        "background": "-webkit-gradient(left top, right top, color-stop(" + ratioSilence + ", rgba(69,69,69,0.1), color-stop(" + ratioSilence + ", transparent)))",
                        "background": "-webkit-linear-gradient(left, rgba(69,69,69,0.1) " + ratioSilence + ", transparent " + ratioSilence + ")",
                        "background": "-o-linear-gradient(left, rgba(69,69,69,0.1) " + ratioSilence + ", transparent " + ratioSilence + ")",
                        "background": "-ms-linear-gradient(left, rgba(69,69,69,0.1) " + ratioSilence + ", transparent " + ratioSilence + ")",
                        "background": "linear-gradient(to right, rgba(69,69,69,0.1) " + ratioSilence + ", transparent " + ratioSilence + ")"
                    });


                }
                // IF Methods are not validated
                else if(rowValue['fields']['validatePertinence'] === "no") {

                    var ratioMethods = rowValue['progressNotedKeywords'] ? rowValue['progressNotedKeywords'] : 0;

                    if (parseFloat(ratioMethods) > 0) {

                        var ratioPertinence = (parseFloat(ratioMethods)) * 100 + "%";

                            $(".browseTitle", row).css({
                                "background": "rgba(136,203,195,0.5)",
                                "background": "-moz-linear-gradient(left, rgba(136,203,195,0.5) " + ratioPertinence + ", transparent " + ratioPertinence + ")",
                                "background": "-webkit-gradient(left top, right top, color-stop(" + ratioPertinence + ", rgba(136,203,195,0.5)), color-stop(" + ratioPertinence + ", transparent)))",
                                "background": "-webkit-linear-gradient(left, rgba(136,203,195,0.5) " + ratioPertinence + ", transparent " + ratioPertinence + ")",
                                "background": "-o-linear-gradient(left, rgba(136,203,195,0.5) " + ratioPertinence + ", transparent " + ratioPertinence + ")",
                                "background": "-ms-linear-gradient(left, rgba(136,203,195,0.5) " + ratioPertinence + ", transparent " + ratioPertinence + ")",
                                "background": "linear-gradient(to right, rgba(136,203,195,0.5) " + ratioPertinence + ", transparent " + ratioPertinence + ")"
                            });

                    }
                }


            },

            fnDrawCallback: function(){

                $('tbody tr').on('click',function() {
                    var position =  oTable.fnGetPosition(this);
                    var docID = oTable.fnGetData( position );
                    document.location.href = "/display/" + docID.wid + '.html';
                }).addClass('trBody');
            }
        }),
        thead = $('#menuThead');

    console.log("oTable" , oTable);

    // DataTable filters
    $('#browseChangeList').on('change', function() {

        if( $(this).val() == 'traites'){
            oTable.fnFilter( 'yes' , 1 );
                localStorage['selecteur'] = "traites";
        }
        else if( $(this).val() == 'nonTraites'){
            oTable.fnFilter( 'no' , 1 );
                localStorage['selecteur'] = "nonTraites";
        }
        else if( $(this).val() == 'tous'){
            oTable.fnFilter('',1);
                localStorage['selecteur'] = "tous";
        }
    } );

    $(".guidesLink").on("click" , function(){
        $("body").css("overflow" , "hidden").append("<div style='top: 0;background: rgba(204, 106, 99, 0.85); color : #f5f5f5 ; font-size: 41px;width: 100vw; height: 100vh;display: flex;justify-content: center;align-items: center; position: fixed;'>" +
            "<span class='infosQuit glyphicon glyphicon-remove'></span>" +
            "<div class='btn btn-default exportButtons' data-href='http://termith-anr.github.io/scripts-formats/guides/readme.pdf'>Manuel Idefix</div>" +
            "<div class='btn btn-default exportButtons' data-href='http://termith-anr.github.io/scripts-formats/guides/protocoleEvaluationSc2.pdf'>Protocole d'évaluation</div>" +
            "</div>")
    });


    // Fixed top menu
    $(window).scroll(function () {
        if ($(this).scrollTop() > 541) {
            thead.addClass("fixedThead");
        } else {
            thead.removeClass("fixedThead");
        }
    });



    // Get data-href of csv score & redirect to it
    var goToLocation  = function(element){
        window.open(element.currentTarget.getAttribute('data-href') , '_blank' );
    };


    $("body").on('click' , ".exportButtons" ,goToLocation);

    $('#exportButton').on('click' , function(){
        $('#exportMenu').css("display" , "flex");
        $('body').css('overflow' , 'hidden');
    });

    $('body').on('click', ".infosQuit" , function(){
        console.log($(this).parent);
        $('body').css('overflow' , '');
        $(this).parent().hide();
    });

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
                $("#" + id).prepend("<img src='" + imgs[i] + "' class='imgInfos'/>").delay(650).css("display", "flex");
            }
        }
        else{
            $("#" + id).css("display", "flex")
        }
        $('body').css('overflow' , 'hidden');
    });


    $('.infosQuit').on('click', function(){
        $('body').css('overflow' , '');
        $('.informationsContent').hide();
        $(".informations").css('z-index' ,'');
    });

    if(localStorage['selecteur']){

        switch(localStorage['selecteur']){
            case 'traites':

                $('#browseChangeList option')[1].selected = true;

                break;

            case 'nonTraites':

                $('#browseChangeList option')[2].selected = true;

                break;

            case 'tous':

                $('#browseChangeList option')[0].selected = true;

                break;
        }
    }



});