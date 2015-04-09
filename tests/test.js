
//var $ = require('jquery');

module.exports = {
    'LISTE DE DOCUMENTS': function (test) {
        test
            // Start Navigator + Check if page index + check number of doc === 1
            .open('http://localhost:3000')
            .assert.title().is('Liste des documents provenant des fichiers TEI - IDEFIX', 'LISTE DOCS BIEN ACCESSIBLE !')
            .assert.numberOfElements('.trBody .browseTitle', 1, '1 DOCUMENT SEMBLE BIEN PRESENT !')
            .assert.text('#browseTable_info').is('Il y a 1 résultat(s)' , 'DATATABLE INDIQUE LUI AUSSI 1 FICHIER')

            // Set dataTable search to abduction wich sould return the only doc
            .setValue('#browseTable_filter .form-control', 'Abduction')
            .wait(3000)
            .assert.numberOfElements('.trBody .browseTitle', 1, '1 DOCUMENT APRES FILTRE POSITIF !')


            //RESET PAGE
            .reload()
            .wait(3000)

            // Set dataTable search to abduction wich sould return the only doc
            .setValue('#browseTable_filter .form-control', 'Une phrase inexistante')
            .wait(3000)
            .assert.exists('.dataTables_empty', '0 DOCUMENT APRES FILTRE NEGATIF!')

            .done();
    },

    'CLICKS- LISTE DE DOCUMENTS' :function(test){
        test
            .open('http://localhost:3000')
            .wait(3000)

            //Select filter "non traité"
            .assert.doesntExist('.dataTables_empty','1 DOCUMENT AVANT FILTRE TRAITE!')
            .click('#browseChangeList')
            .wait(3000)
            .click('#browseChangeList option[value="traites"]')
            .wait(3000)
            .assert.exists('.dataTables_empty','0 DOCUMENT APRES FILTRE TRAITE!')

            //RESET PAGE
            .reload()
            .wait(3000)

            //Click on document:
            .assert.doesntExist('.dataTables_empty','0IL Y A DES DOCS')
            .assert.numberOfElements('.trBody .browseTitle', 1, '1 DOCUMENT SEMBLE BIEN PRESENT !')
            .click("tbody tr")
            .wait(3000)
            .assert.title().is('Liste des documents provenant des fichiers TEI - IDEFIX2', 'LISTE DOCS BIEN ACCESSIBLE !')

    }

};