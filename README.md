IDEFIX
======

IDEFIX is a notation interface of indexed Termith's keywords

*[learn more about termith](http://www.atilf.fr/ressources/termith/)*

![PM2](http://feb.imghost.us/LCOC.png)

### Requirements 

- *[Node.Js](http://nodejs.org/)*

  ex: (Ubuntu)

  ```
  curl -sL https://deb.nodesource.com/setup | sudo bash
  sudo apt-get install -y nodejs
  ```

- *[MongoDB](http://www.mongodb.org/)*

- Google Chrome (>31) OR Firefox (>26)

- A folder with your xml-tei files in


# Install IDEFIX

## Classic install

### Download

#### Via Git:

- Clone our repo 
  ```
  git clone https://github.com/termith-anr/idefix.git
  ```

#### Without Git:

- *[Download our lastest ZIP](https://github.com/termith-anr/idefix/archive/master.zip)*
- Unzip the folder 


### Install

* Open a terminal (Console) onto the idefix downloaded folder 
* Launch the command (this will download the required modules)

    ```
     npm install 
    ```

## Start IDEFIX

#### Create an idefix settings files (folder-xml-tei.json)

* Must have the STRICTLY same name as your folder-xml-tei with ".json" extension
* JSON config file must have to be next to the folder-xml-tei
* Import this default config in

```json
 {
   "port": 3000,
   "connexionURI" : "mongodb://localhost:27017/test/",
   "filters" : {
     "split" : "split",
     "add2Array" : "add2Array"
   },
   "domain" : "A domain exemple",
   "inistKeywords" : true,
   "fullArticle" : true,
   "exports" : {
     "csv" : true,
     "xml" : true,
     "zipXML" : true
   },
  "showPrefered" : [1],
  "showCorresp" : [0],
  "comments" : ["Commentaire 1" , "argentine" , "japon" , "matthias" , "préférence" , 42],
   "loaders" : [
     {
       "script" : "castor-load-xml",
       "pattern" : "**/*.xml"
     },
     {
       "script" : "castor-load-raw",
       "pattern" : "**/*.xml"
     },
     {
       "script" : "keywords.js",
       "pattern" : "**/*.xml",
         "options": {
         "keywordsSilencePath" : "TEI.teiHeader.profileDesc.textClass.keywords",
         "keywordsEvalPath"    : "TEI.teiHeader.profileDesc.textClass.keywords"
       }
     },
     {
       "script" : "autoScore.js",
       "pattern" : "**/*.xml",
         "options": {
         "autoScore" : true,
         "autoEval"  : true,
         "autoSilence": true
       }
     }
   ],
   "documentFields" : {
     "title" : {
       "path" : ["content.json.TEI.teiHeader.fileDesc.titleStmt.title.0.#text" , "content.json.TEI.teiHeader.fileDesc.titleStmt.title.#text"],
       "coalesce": true,
       "textizer" : "trim()",
       "noindex" : true
 
     }, 
     "abstract" : {
       "path" : ["content.json.TEI.teiHeader.profileDesc.abstract.0.p.#text","content.json.TEI.teiHeader.profileDesc.abstract.p.#text"],
       "coalesce": true,
       "noindex" : true
     },
       "validationMethods" : {
       "path" : "validationMethods",
       "default" : "no",
       "textizer" : "trim()"
     },
       "validationDocument" : {
       "path" : "validationDocument",
       "default" : "no",
       "textizer" : "trim()"
     }
     
   }
 
 }
```

#### Lauch Idefix 
```
~/Download/IdefixFolder/.idefix ~/Document/XML-TEI-Folder
```

## Install with APP Manager 

More info about (*[castor-admin](https://github.com/madec-project/castor-admin)*)

* First follow the *[castor-admin install](https://github.com/madec-project/castor-admin#installation)*
* Start castor-admin (with at least one app installed in ~/apps )
```bash
castor-admin ~/apps
```
* Via browser , go to *[localhost:35267](http://localhost:35267)*
* Add an instance app by clicking on "+ Add an instance"
* Fill the required infos
* Edit the config file by clicking on the params icon of the instance
* Create your config with options (or import it under) (DO NOT add options with the "--- Not Managed ---" , this could break administration) *[see options](https://github.com/termith-anr/idefix#config-options)*
```json
 {
   "title" : "An Instance"
   "filters" : {
     "split" : "split",
     "add2Array" : "add2Array"
   },
   "domain" : "A domain exemple",
   "inistKeywords" : true,
   "fullArticle" : true,
   "exports" : {
     "csv" : true,
     "xml" : true,
     "zipXML" : true
   },
  "showPrefered" : [1],
  "showCorresp" : [0],
  "comments" : ["Commentaire 1" , "argentine" , "japon" , "matthias" , "préférence" , 42],
   "loaders" : [
     {
       "script" : "castor-load-xml",
       "pattern" : "**/*.xml"
     },
     {
       "script" : "castor-load-raw",
       "pattern" : "**/*.xml"
     },
     {
       "script" : "keywords.js",
       "pattern" : "**/*.xml",
         "options": {
         "keywordsSilencePath" : "TEI.teiHeader.profileDesc.textClass.keywords",
         "keywordsEvalPath"    : "TEI.teiHeader.profileDesc.textClass.keywords"
       }
     },
     {
       "script" : "autoScore.js",
       "pattern" : "**/*.xml",
         "options": {
         "autoScore" : true,
         "autoEval"  : true,
         "autoSilence": true
       }
     }
   ],
   "documentFields" : {
     "title" : {
       "path" : ["content.json.TEI.teiHeader.fileDesc.titleStmt.title.0.#text" , "content.json.TEI.teiHeader.fileDesc.titleStmt.title.#text"],
       "coalesce": true,
       "textizer" : "trim()",
       "noindex" : true
 
     }, 
     "abstract" : {
       "path" : ["content.json.TEI.teiHeader.profileDesc.abstract.0.p.#text","content.json.TEI.teiHeader.profileDesc.abstract.p.#text"],
       "coalesce": true,
       "noindex" : true
     },
       "validationMethods" : {
       "path" : "validationMethods",
       "default" : "no",
       "textizer" : "trim()"
     },
       "validationDocument" : {
       "path" : "validationDocument",
       "default" : "no",
       "textizer" : "trim()"
     }
     
   }
 
 }
```

## List of config options

* "Only Managed" means the option is used only with *[app manager](https://github.com/termith-anr/idefix#install-with-app-Manager)*
* "Not Managed"  means the option DO NOT have to be in *[app manager](https://github.com/termith-anr/idefix#install-with-app-Manager)* config (could break it)

##### title (REQUIRED/string) --- Only Managed ---

It's the title of the instance , a simple string

```json
"title": "A title"
```

##### port (REQUIRED/Number) --- Not Managed ---


You can ask idefix to use any port number

```json
"port": 3000
```
    
##### connexionURI (REQUIRED/String) --- Not Managed ---
    
This is the default connexion URI to the mongodb database, do not modify it
    
```json
"connexionURI" : "mongodb://localhost:27017/test/"
```

#### filters (REQUIRED/Object)

THIS IS REQUIRED to get IDEFIX working , it's about nunjucks filters

```json
"filters" : {
     "split" : "split",
     "add2Array" : "add2Array"
}
```

#### domain (REQUIRED/String)

This option will be the domain name which appears at the top of every notation page

```json
"domain" : "linguistique"
```

#### inistKeywords (OPTIONAL/Boolean)

You can enable/disable the possibility to view and mark

```json
"inistKeywords" : true
```

#### fullArticle (OPTIONAL/Boolean)

You can enable/disable the possibility to get access to the full article

```json
"fullArticle" : false
```

#### exports(OPTIONAL/Object)

You can enable/disable any export type (Bool form)

* csv , export all results (marks,time,..) as a csv files

* xml, export the source xml-files enriched with marks as a single tei-corpus file

* zipXML, export the source xml-files enriched with marks as many as xml-source files into a Zipped xml-folder

```json
"exports" : {
    "csv" : true,
    "xml" : true,
    "zipXML" : true
  }
```

#### showPrefered(OPTIONAL/Array)

You might want to specify which marks could give the ability to enter to the prefered list 

```json
"showPrefered" : [0,2]
```

#### showCorresp(OPTIONAL/Array)

You might want to specify which marks could give the ability to enter to the correspondance list

```json
"showCorresp" : [1]
```

#### comments(OPTIONAL/Array)

The list of pre-defined words that you want to use for auto-completion comments

```json
"comments" : ["Commentaire 1","Commentaire 2","Commentaire 3", 10]
```


#### loader(REQUIRED/Array of Objects)

* castor-load-xml
 Required to import xml-files into mongoDB as json/bson
 ```json
 {
   "script" : "castor-load-xml",
   "pattern" : "**/*.xml"
 }
 ```

* castor-load-raw
 Required to import xml-files into mongoDB as raw
 ```json
 {
   "script" : "castor-load-raw",
   "pattern" : "**/*.xml"
 }
 ```

* Keywords 
 Required to specify silence keywords & methods leywords paths (for flexibility)
 ```json
 {
   "script" : "keywords.js",
   "pattern" : "**/*.xml",
    "options": {
         "keywordsSilencePath" : "TEI.teiHeader.profileDesc.textClass.keywords",
         "keywordsEvalPath"    : "TEI.teiHeader.profileDesc.textClass.keywords"
    }
 }
 ```

* autoScore

 Required to specify if you want to enable autoscore
 
 Autoscore is an automated notation of keywords at start
 
 * autoScore : Enable/Disable silence & methods autoscore
 * autoEval: Enable/Disable methods autoscore
 * autoSilence: Enable/Disable silence autoscore

 ```json
 {
    "script" : "autoScore.js",
    "pattern" : "**/*.xml",
    "options": {
         "autoScore" : true,
         "autoEval"  : true,
         "autoSilence": true
    }
 }
 ```
 
#### documentFields(REQUIRED/Object)

Check *[castor-core documentFields](https://github.com/castorjs/castor-core#documentfields-1)* for more informations about them

* title 
    * options: 
        * path (can contain à string or an array of dot notation path)
* abstract
    * options: 
            * path (can contain à string or an array of dot notation path)