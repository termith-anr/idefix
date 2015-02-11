IDEFIX
======

IDEFIX is a notation interface of indexed Termith's keywords

*[learn more about termith](http://www.atilf.fr/ressources/termith/)*

![PM2](http://feb.imghost.us/LCOC.png)

### Requirements 

- *[Node.Js](http://nodejs.org/)*

- *[MongoDB](http://www.mongodb.org/)*

  ex: (Ubuntu)

  ```
  curl -sL https://deb.nodesource.com/setup | sudo bash
  sudo apt-get install -y nodejs
  ```

- Google Chrome (>31) OR Firefox (>26)

- A folder with your xml-tei files in


## Install IDEFIX

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

## Config Options

##### port

You can ask idefix to use this port number

```json
"port": 3000
```
    
##### connexionURI
    
This is the default connexion URI to the mongodb database, do not modify it
    
```json
"connexionURI" : "mongodb://localhost:27017/test/"
```

#### filters

THIS IS REQUIRED to get IDEFIX working , it's about nunjucks filters

```json
"filters" : {
     "split" : "split",
     "add2Array" : "add2Array"
}
```

