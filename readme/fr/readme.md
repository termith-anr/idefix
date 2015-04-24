IDEFIX
======

IDEFIX est une interface graphique de notation de mot clés pour des fichiers XML-TEI

*[En savoir plus sur Termith](http://www.atilf.fr/ressources/termith/)*

![IDEFIX](https://raw.githubusercontent.com/termith-anr/idefix/master/assets/pictures/interface.png)


# Sommaire
#### *[Les prérequis](https://github.com/termith-anr/idefix/tree/master/readme/fr#les-pr%C3%A9requis-1)*
#### *[Installation sans serveur](https://github.com/termith-anr/idefix/tree/master/readme/fr#installation-sans-serveur)* (Use it if you want to try/dev Idefix on a simple personal computer)
#### *[Installation avec ezMaster](https://github.com/termith-anr/idefix/tree/master/readme/fr#installation-avec-ezmaster)* (Use it on a server , or if you want to start many apps locally)
#### *[Liste des options](https://github.com/termith-anr/idefix/tree/master/readme/fr#liste-des-options)*
#### *[Guide utilisateur](https://github.com/termith-anr/idex/tree/master/readme/fr/guide)* 
  
   
### Les prérequis 

- Votre OS doit être de type UNIX ( linux / Mac ) , Windows non supporté

- *[Node.Js](http://nodejs.org/)* (Version >= 10)

- *[MongoDB](http://www.mongodb.org/)*

- Le navigateur Firefox (Version > 26)

- Un dossier contenant vos fichiers TEI


# Installer IDEFIX

## Installation sans serveur

### Téléchargement

#### Avec Git:

- Ouvrir l'invite de commande et lancer :
  ```
  git clone https://github.com/termith-anr/idefix.git
  ```

#### Sans Git:

- *[Télécharger la dernier version](https://github.com/termith-anr/idefix/archive/master.zip)*
- Décompressez l'archive

### Installation

* Rendez-vous dans le dossier issu de l'extraction de l'archive:

    ```
     cd dossierExtraitAvecGit
    ```
    
* Pour installer idefix tapez :

    ```
     npm install 
    ```

## Lancer IDEFIX

#### Créer un fichier de configuration

* Ce fichier doit posséder exactement le même nom que le dossier contenant vos fichiers TEI et avoir ".json" comme extension
* Ce fichier JSON doit être placé à côté du dossier de fichiers
```
├── Ordinateur/
│   ├── nomDeDossier.json
│   ├── nomDeDossier
│   │   ├── fichier-tei-1.xml
│   │   ├── fichier-tei-2.xml
│   │   ├── ...
│   │   ├── fichier-tei-x.xml
```
* Ensuite remplissez ce fichier avec les paramétres suivants :

```json
 {
   "domain" : "Linguistique",
   "teiFormat" : "2015-02-013",
   "showSilence" : true,
   "showArticle" : true,
   "showPreference" : [1],
   "showCorrespondance" : [1,2],
   "autoPertinence" : true,
   "autoSilence" : true,
   "exports" : {
     "csv" : true,
     "xml" : true,
     "zipXML" : true
   },
   "comments" : ["Commentaire 1" , "Commentaire 2"  , "Commentaire 3"  , "Commentaire 4"  , "Un loooong commentaire" , 2015],
   "documentFields" : {
     "$text": {
       "get" : ["fields.title","basename"],
       "join": " | "
     }
   }
 
 }
```

#### Lancement 

- Grâce au terminal dans votre dossier contenant l'application idefix lancez :

```
    .idefix ~/Document/nomDeDossier
```

- ~/Document/nomDeDossier est le lien vers le dossier contenant vos fichiers TEI

## Installation avec ezMaster

Plus d'info sur (*[ezMaster](https://github.com/madec-project/ezmaster)*)

* Installer *[ezMaster](https://github.com/madec-project/ezmaster#installation)* (installation en anglais)
* Rendez-vous sur *[Liste des version](https://github.com/termith-anr/idefix/tree/master/readme/en/releases)* d'Idefix et copiez le lien "source code" lié au fichier tar.gz d ela version souhaitée
* *[Téléchargez Idefix](https://github.com/termith-anr/idefix/tree/master/readme/en#download)* dans ~/apps 
    ```
    cd ~/apps
    
    curl -L  https://exemple.tar.gz | tar zx
    
    ///Remplacez exemple.targz avec le bon lienn////
    ```
* *[Installez Idefix](https://github.com/termith-anr/idefix/tree/master/readme/fr#installation)*
* Lancer ezMaster
```bash
    ezMaster ~/apps
```
* Dans votre navigateur , rendez-vous sur --> *[localhost:35267](http://localhost:35267)*
* Ajouter une instance en cliquant sur "+ Add an instance"
* Rentrez les informations demandées (à titres indicatives pour leur gestion).
* Editer la configuration de l'instance en cliquant sur le bouton de paramétres de l'instance ajoutée
* Appuyez sur "text" en hauteur pour switcher en mode texte 
* Copiez-Collez la *[configuration de base](https://github.com/termith-anr/idefix/tree/master/readme/fr#cr%C3%A9er-un-fichier-de-configuration)*) 
* Ajoutez vos propres options si voulu ( /!\ Ne pas ajouter les option "--- Non ezMaster ---" ) *[Voir la liste d'option](https://github.com/termith-anr/idefix/tree/master/readme/fr#liste-des-options)*


## Liste des options

* "ezMaster Seulement" précise que cette option n'est à utiliser qu'avec *[ezMaster](https://github.com/termith-anr/idefix/tree/master/readme/fr#install-with-app-manager)*
* "Non ezMaster"  précise que cette option est à ne pas utiliser avec *[ezMaster](https://github.com/termith-anr/idefix/tree/master/readme/en#install-with-app-manager)* config (could break it)

##### title (OBLIGATOIRE/texte) --- ezMaster Seulement ---

Le titre de l'instance dans ezMaster ( à gauche )

```json
"title": "A title"
```

##### port (OBLIGATOIRE/Nombre) --- Non ezMaster ---

Demande à Idefix d'utiliser un port en particulier

```json
"port": 3001
```
    
##### connexionURI (OBLIGATOIRE/texte) --- Non ezMaster ---
    
Il s'agit de la connexion à mongoDB , IDEFIX utilise une base "Test" simple , cette option ne devrait pas être utilisée
    
```json
"connexionURI" : "mongodb://localhost:27017/test/"
```

#### domain (OBLIGATOIRE/texte)

Décrit le type de fichier du corpus ( chimie , linguistique ... )

```json
"domain" : "linguistique"
```


#### teiFormat (OBLIGATOIRE/texte)

Choix de la version du format des fichiers TEI
Voici la liste actuelle :

- "2015-02-13" (Phase II)
- "2014-11-01" (Phase I)


#### showSilence (OPTIONAL/Boolean)

Activer/Desactiver la visualisation des silences 

```json
"showSilence" : true
```

#### showArticle (OPTIONAL/Boolean)

Activer/Desactiver la visualisation de l'article complet

```json
"showArticle" : false
```

#### exports(OPTIONAL/Object)

Activer/Desactiver certaines formes d'exports

* csv , exporte tout (note,temps passé,..) dans un fichier csv

* xml, Exporte tous les fichiers en un seul corpus TEI

* zipXML, retourne chaque fichier avec leurs scores

```json
"exports" : {
    "csv" : true,
    "xml" : true,
    "zipXML" : true
  }
```

#### showPreference(OPTIONAL/Tableau)

Tableau contenant les valeur ou l'on souhaite pouvoir acceder aux préférences

```json
"showPreference" : [0,2]
```

#### showCorrespondance(OPTIONAL/Tableau)

Tableau contenant les valeur ou l'on souhaite pouvoir acceder aux correspondances

```json
"showCorrespondance" : [1]
```

#### comments(OPTIONAL/Tableau)

Un tableau contenant une liste de commentaires souvent utilisés , ces commentaires seront proposés dans l'interface

```json
"comments" : ["Commentaire 1","Commentaire 2","Commentaire 3"]
```


#### autoPertinence(OPTIONNAL/Boolean)

Activer/Desactiver la génération automatique de score pour les pertinences
Activé par default
```json
"autoPertinence" : true
```

#### autoSilence(OPTIONNAL/Boolean)

Activer/Desactiver la génération automatique de score pour les silences
Activé par default
```json
"autoPertinence" : true
```
 
 
#### documentFields(OBLIGATOIRE/Object)

Plus d'infos sur *[castor-core documentFields](https://github.com/castorjs/castor-core#documentfields-1)*

- "$text" ajoute un document mongo nommée "text" , utilisé dans le filtre de recherche sur la page d'accueil d'IDEFIX




-Si vous pensez avoir trouvé un bug ajoutez une issue sur : *[github issue](https://github.com/termith-anr/idefix/tree/master/readme/en/issues/new)*



