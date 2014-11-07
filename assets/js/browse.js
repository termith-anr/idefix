//document.location.href = '/browse.html';

$(document).ready(function() {

    var oTable = $('#browseTable').dataTable({
            "search" : {
                "regex" : true
            },
            ordering: true,
            dom : "ilfrtp",
            info : true,
            ajax: "/browse.json",
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
                    "next" : "Suivant",
                }
            },
            columns: [
                { data: 'wid' , visible : false , searchable: false},
                { data: 'fields.validationDocument', visible : false , searchable: false},
                { data: 'object' , className: "browseYear browseTd", searchable: true},
                { data: 'fields.title' , className: "browseTitle browseTd", searchable: true}
            ],

            "fnCreatedRow": function( row, td, index ) {

                var rowValue = oTable.fnGetData( index );

                if(rowValue['validationDocument'] == "yes"){

                    $(row).attr('class', 'trValidate');

                }
                else if((rowValue['validationMethods'] == "yes") && (rowValue['fields']['validationDocument'] == "no")) {

                    var ratioINIST = rowValue['progressSilenceKeywords'] ? rowValue['progressSilenceKeywords'] : 0,
                        ratioDocument = ((1+parseFloat(ratioINIST))/2)*100 + "%";

                    $(".browseTitle" ,row).css({
                        "background": "rgba(98,125,77,1)",
                        "background": "-moz-linear-gradient(left, rgba(69,69,69,0.1) " + ratioDocument + ", transparent " + ratioDocument + ")",
                        "background": "-webkit-gradient(left top, right top, color-stop(" + ratioDocument + ", rgba(69,69,69,0.1)), color-stop(" + ratioDocument + ", transparent)))",
                        "background": "-webkit-linear-gradient(left, rgba(69,69,69,0.1) " + ratioDocument + ", transparent " + ratioDocument + ")",
                        "background": "-o-linear-gradient(left, rgba(69,69,69,0.1) " + ratioDocument + ", transparent " + ratioDocument + ")",
                        "background": "-ms-linear-gradient(left, rgba(69,69,69,0.1) " + ratioDocument + ", transparent " + ratioDocument + ")",
                        "background": "linear-gradient(to right, rgba(69,69,69,0.1) " + ratioDocument + ", transparent " + ratioDocument + ")"
                    });


                }
                else if(rowValue['fields']['validationMethods'] == "no") {
                    var ratioMethods = rowValue['progressNotedKeywords'] ? rowValue['progressNotedKeywords'] : 0;

                    if (parseFloat(ratioMethods) > 0) {

                        var ratioDocument = ((parseFloat(ratioMethods)) / 2) * 100 + "%";

                            $(".browseTitle", row).css({
                                "background": "rgba(98,125,77,1)",
                                "background": "-moz-linear-gradient(left, rgba(69,69,69,0.1) " + ratioDocument + ", transparent " + ratioDocument + ")",
                                "background": "-webkit-gradient(left top, right top, color-stop(" + ratioDocument + ", rgba(69,69,69,0.1)), color-stop(" + ratioDocument + ", transparent)))",
                                "background": "-webkit-linear-gradient(left, rgba(69,69,69,0.1) " + ratioDocument + ", transparent " + ratioDocument + ")",
                                "background": "-o-linear-gradient(left, rgba(69,69,69,0.1) " + ratioDocument + ", transparent " + ratioDocument + ")",
                                "background": "-ms-linear-gradient(left, rgba(69,69,69,0.1) " + ratioDocument + ", transparent " + ratioDocument + ")",
                                "background": "linear-gradient(to right, rgba(69,69,69,0.1) " + ratioDocument + ", transparent " + ratioDocument + ")"
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

    $('#browseChangeList').on('change', function() {
        if( $(this).val() == 'traites'){
            oTable.fnFilter( 'yes' , 1 );
        }
        else if( $(this).val() == 'nonTraites'){

            oTable.fnFilter( 'no' , 1 );
        }
        else if( $(this).val() == 'tous'){
            oTable.fnFilter('',1);
        }
    } );

    $(window).scroll(function () {
        if ($(this).scrollTop() > 541) {
            thead.addClass("fixedThead");
        } else {
            thead.removeClass("fixedThead");
        }
    });



    // Get data-href of csv score & redirect to it

    var goToLocation  = function(element){
        window.location = element.currentTarget.getAttribute('data-href');
    };


    $('#exportResults').on('click' , goToLocation);

});