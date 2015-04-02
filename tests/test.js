
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
            .wait(700)
            .assert.numberOfElements('.trBody .browseTitle', 1, '1 DOCUMENT APRES FILTRE POSITIF !')


            //RESET PAGE
            .reload()

            // Set dataTable search to abduction wich sould return the only doc
            .setValue('#browseTable_filter .form-control', 'Une phrase inexistante')
            .wait(700)
            .assert.doesntExist('.trBody .browseTitle', '0 DOCUMENT APRES FILTRE NEGATIF!')

            //RESET PAGE
            .reload()

            //Select filter "non traité"
            .click('#browseChangeList')
            .click('#browseChangeList option[value="nonTraites"]')
            .wait(700)
            .assert.doesntExist('.trBody .browseTitle','0 DOCUMENT APRES FILTRE NON TRAITE!')

            .done();
    }

};