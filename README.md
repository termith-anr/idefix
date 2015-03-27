IDEFIX
======

IDEFIX is a notation interface of indexed Termith's keywords

*[learn more about termith](http://www.atilf.fr/ressources/termith/)*

![PM2](https://github.com/termith-anr/idefix/assets/pictures/interface.png)

 
  
   
# Summary
#### *[The Requirements](https://github.com/termith-anr/idefix#requirements)*
#### *[Standalone install](https://github.com/termith-anr/idefix#classic-install)* (Use it if you want to try/dev Idefix on a simple personal computer)
#### *[Install with APP manager](https://github.com/termith-anr/idefix#install-with-app-manager)* (Use it on a server , or if you want to start many apps locally)
#### *[List of options](https://github.com/termith-anr/idefix#list-of-config-options)*
#### *[User guide](https://docs.google.com/document/d/1Ea4bC-TBWlCTEf1r6YY3-1GP-blxpjxJm9jUGtATUV8/edit?usp=sharing)*
 
  
   


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

#### With Git:

- Clone our repo 
  ```
  git clone https://github.com/termith-anr/idefix.git
  ```

#### Without Git:

- *[Download our lastest ZIP](https://github.com/termith-anr/idefix/archive/master.zip)*
- Unzip the folder 

### Install

* Open a terminal (console) in the idefix previously downloaded folder 
* Launch the command (will download required modules) :

    ```
     npm install 
    ```

## Start IDEFIX

#### Create an idefix config file (folder.json)

* Must have the STRICTLY same name as your document folder with ".json" extension
* JSON config file must have to be next to document folder
* Write this default config in :

```json
 {
   "domain" : "Linguistique",
   "teiFormat" : "2014-11-01",
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

#### Lauch Idefix 

- With terminal , go to your idefix folder
- Start with this command :

```
    .idefix ~/Document/Folder
```

- ~/Document/Folder is the path of TEI documents

## Install with APP Manager 

More info about (*[castor-admin](https://github.com/madec-project/ezmaster)*)

* First follow the *[castor-admin install](https://github.com/madec-project/ezmaster#installation)*
* Go to *[IDEFIX Versions](https://github.com/termith-anr/idefix/releases)*  and copy the url "Source code(tar.gz)" you want. (Or via git for the currently dev version) 
* *[Download Idefix](https://github.com/termith-anr/idefix#download)* in ~/apps 
    ```
    cd ~/apps
    curl -L  https://urlExemple.tar.gz | tar zx
    ///REPLACE urlExemple.targz with the correct url////
    ```
* *[Install Idefix](https://github.com/termith-anr/idefix#install)*
* Start castor-admin (with at least one app installed in ~/apps )
```bash
    castor-admin ~/apps
```
* Via browser , go to *[localhost:35267](http://localhost:35267)*
* Add an instance app by clicking on "+ Add an instance"
* Fill the required infos
* Edit the config file by clicking on the params icon of the instance
* Writte your config (or import *[example](http:// #start-idefix)*) (DO NOT add options with the "--- Not Managed ---" , this could break administration) *[see options](https://github.com/termith-anr/idefix#list-of-config-options)*


## List of config options

* "Only Managed" means the option is used only with *[app manager](https://github.com/termith-anr/idefix#install-with-app-manager)*
* "Only Single Instance"  means the option DO NOT have to be in *[app manager](https://github.com/termith-anr/idefix#install-with-app-manager)* config (could break it)

##### title (REQUIRED/string) --- Only Managed ---

It's the title of the instance , a simple string

```json
"title": "A title"
```

##### port (REQUIRED/Number) --- Only Single Instance ---

You can ask idefix to use any port number

```json
"port": 3001
```
    
##### connexionURI (REQUIRED/String) --- Only Single Instance ---
    
This is the default connexion URI to the mongodb database, do not modify it
    
```json
"connexionURI" : "mongodb://localhost:27017/test/"
```

#### domain (REQUIRED/String)

This option will be the domain name which appears at the top of every notation page

```json
"domain" : "linguistique"
```


#### teiFormat (REQUIRED/String)

This option call the good keywords importer
That current list :

- "2015-02-13" (Phase II)
- "2014-11-01" (Phase I)


#### showSilence (OPTIONAL/Boolean)

You can enable/disable the possibility to view and mark

```json
"showSilence" : true
```

#### showArticle (OPTIONAL/Boolean)

You can enable/disable the possibility to get access to the full article

```json
"showArticle" : false
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

#### showPreference(OPTIONAL/Array)

You might want to specify which marks could give the ability to enter to the prefered list 

```json
"showPreference" : [0,2]
```

#### showCorrespondance(OPTIONAL/Array)

You might want to specify which marks could give the ability to enter to the correspondance list

```json
"showCorrespondance" : [1]
```

#### comments(OPTIONAL/Array)

The list of pre-defined words that you want to use for auto-completion comments

```json
"comments" : ["Commentaire 1","Commentaire 2","Commentaire 3", 10]
```


#### autoPertinence(OPTIONNAL/Boolean)

You can enable / disable auto-generation of pertinence score
If not provided , true is default
```json
"autoPertinence" : true
```

#### autoSilence(OPTIONNAL/Boolean)

You can enable / disable auto-generation of silence score
If not provided , true is default
```json
"autoPertinence" : true
```
 
 
#### documentFields(REQUIRED/Object)

Check *[castor-core documentFields](https://github.com/castorjs/castor-core#documentfields-1)* for more informations

- "$text" generate a field in mongo call "text" , used to filter documents in list of IDEFIX