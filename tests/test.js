
//var $ = require('jquery');

module.exports = {
    'LISTE DE DOCUMENTS': function (test) {
        test
            .open('http://localhost:3000')
            .assert.title().is('Liste des documents provenant des fichiers TEI - IDEFIX', 'Liste des documents Accessibles')

            .assert.numberOfElements('.trBody .browseTitle', 1, '1 document au chargement')
            .assert.val('#browseTable_filter .form-control', '', 'Value is OK')

            .setValue('#browseTable_filter .form-control', 'Abduction')
            .wait(2000)
            .assert.numberOfElements('.trBody .browseTitle', 1, '1 Doc aprés Filtrage')

            .wait(2000)
            .setValue('#browseTable_filter .form-control', '99')
            .wait(2000)
            .assert.val('#browseTable_filter .form-control', '99', 'Value is OK')
            .assert.numberOfElements('.trBody .browseTitle', 0, 'Aucun Doc aprés Filtrage')
            .$("#browseTable_filter .form-control")
                .execute(function(e){
                e.value = "";
            })
            .wait(2000)
            .done();
    }

};