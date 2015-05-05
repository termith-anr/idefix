

Projet TermITH
==============
![logoTermith](https://github.com/termith-anr/scripts-formats/blob/master/Screens/jpeg/termihLogo.jpg)

SCENARIO D'UTILISATION N°2 
===========================
EVALUATION DE L'INDEXATION
===========================
OUTIL IDEFIX
============


Protocole d'évaluation
==============================
Le scénario 2 a pour objectif d’évaluer la performance des différentes méthodes d’indexation utilisées dans Termith, par rapport aux pratiques d’indexation en vigueur à l’INIST.

Ce scénario se déroule en 4 phases :

* **Phase 1 :** évaluation de l’indexation produite par 2 méthodes à partir du résumé dans un domaine (linguistique)

* **Phase 2 :** évaluation de l’indexation produite par 2 méthodes à partir du texte intégral dans un domaine (linguistique)

* **Phase 3 :** évaluation de l’indexation produite par 4 à 6 méthodes à partir du résumé dans 4 domaines (linguistique, archéologie, sciences de l’information et chimie)

* **Phase 4 :** évaluation de l’indexation produite par 6+ méthodes à partir du texte intégral dans 4 domaines (linguistique, archéologie, sciences de l’information et chimie)

Pour chacune des phases, il s’agit d’évaluer :

* la **pertinence** de chaque mot-clé proposé;

* le **silence** de la méthode, en se basant sur l’indexation Inist.

**Consignes générales :**

* On ne consulte pas l’article en texte intégral quand on évalue l’indexation faite à partir du résumé;

* On ne modifie pas le score Termith quand on voit l’indexation Inist pour évaluer le silence de la méthode;



######1. Évaluation de la pertinence######
Cette tâche consiste à déterminer si un mot-clé est pertinent pour représenter la problématique de l’article ou du résumé.
Cette évaluation est formalisée par l’attribution d’un score de **0** à **2** :

* **Score 0 :** mot-clé non pertinent;

* **Score 1 :** mot-clé pertinent, mais pas dans la forme proposée;

* **Score 2 :** mot-clé pertinent.


**Cas particuliers :**

1. Le mot-clé n’est pas pertinent => score 0 + indiquer la raison en commentaire

2. Le mot-clé est pertinent, mais est une variante d’une forme préférentielle présente également dans l’indexation
    => score 1 + lien vers forme préférée dans l’indexation + score 2 à la forme préférée

3. Le mot-clé est pertinent, mais est une variante d’une forme préférentielle présente dans le texte, qui n’a pas été proposée dans l’indexation => score 1 + indiquer en commentaire : « forme préférée dans le texte : xxxx »

4. Le mot-clé est pertinent et est présent dans le texte => score 2

5. Le mot-clé est pertinent, mais est une variante d’une forme préférentielle qui n’est pas dans le texte => score 2 + indiquer en commentaire : « forme préférée pas dans le texte : xxx »



######2. Évaluation du silence######
Une fois l’évaluation de la pertinence terminée pour une méthode, il s’agit de repérer les mots-clés pouvant manquer à l’indexation proposée par cette méthode.
Ces mots-clés manquants sont recherchés dans l’indexation Inist, qui représente l’indexation de référence.
Cette tâche consiste donc à évaluer chaque mot-clé Inist en lui attribuant un score de **0** à **2** :

* **Score 0 :** le mot-clé ne manque pas à l’indexation Termith

* **Score 1 :** le mot-clé manque moyennement

* **Score 2** : le mot-clé manque absolument

**Cas particuliers :**

1. Le mot-clé ne manque pas parce qu’il est déjà présent dans l’indexation Termith => score 0 + lien vers mot-clé Termith correspondant (correspondance exacte ou approximative);

2. Le mot-clé ne manque pas parce qu’il provient d’une erreur d’indexation => score 0 + commentaire : « erreur d’indexation »;

3. Le mot-clé correspond à un mot plus ou moins important qui n’est pas présent dans le texte => score 1 + commentaire : « implicite » ou « générique » en fonction des cas;

4. Le mot-clé correspond un mot d'importance moindre qui est présent dans le texte => score 1;

5. Le mot-clé correspond à un mot important qui est présent dans le texte => score 2.



Manuel d'utilisation d'IDEFIX
==============================

######0. Page d'accueil d'IDEFIX######

![accueil](https://github.com/termith-anr/scripts-formats/blob/master/Screens/png/accueil.png)

La page d'accueil permet de:

* visualiser le nombre total de documents;

* choisir le nombre de documents à afficher par page;

* faire une recherche de mot dans la liste de documents (sur le titre et le nom de fichier);

* afficher les documents par statut: Tous, Traités ou Non traités.

######1. Couleur de l'évaluation de la pertinence et couleur de l'évaluation du silence######

Sur la page d'accueil, le titre de certains documents prend un fond coloré:

* couleur **bleue** correspond à l'évaluation de la **pertinence** et indique le niveau de la progression de l'évaluation;

* couleur **grise** correspond à l'évaluation du **silence** et indique le niveau de la progression de l'évaluation.
![couleurPertinenceSilence](https://github.com/termith-anr/scripts-formats/blob/master/Screens/png/couleurPertSilence.png)

**Remarques:**
Certains documents sont déjà colorés avant l'intervention de l'évaluateur. Cela veut dire des scores de pertinence ont été attribués automatiquement par comparaison avec l'indexation INIST. Ainsi, si le mot-clé est présent dans l'indexation INIST, le score 2 est attribué automatiquement.
L'évaluateur peut bien sûr modifier ce score.


######2. Sélectionner un document######

Cliquez sur un document pour le sélectionner.
![selectionDoc](https://github.com/termith-anr/scripts-formats/blob/master/Screens/png/selectionDoc.png)



######4. Document ouvert######

Aprés avoir cliqué sur un document, il s'ouvre comme ci-dessous. Il contient:

* le titre;

* le résumé;

* la possibilité d'afficher le texte en cliquant sur le bouton prévu;

* le timer qui indique la durée totale passée sur un document. Il s'active autoamtiquement à l'ouverture du document. Il s'arrête automatiquement en plaçant la souris en dehors de la page en cours, en fermant le document en cours ou à la validation des deux évaluations (pertinence et silence);

* la discipline;

* la barre de progression pour l'évaluation de la pertinence dans un premier temps (la barre de progression pour le silence s'affichera après validation de la pertinence);

* toutes les méthodes d'indexation automatique à évaluer.
![documentOuvert](https://github.com/termith-anr/scripts-formats/blob/master/Screens/png/ouvertureDoc.png)

EVALUER LA PERTINENCE DES METHODES
-----------
######5. Afficher les mots-clés d'une méthode d'indexation autoamtique######

Pour afficher les mots-clés d'une méthode, cliquez sur le nom de la méthode souhaitée.
Deux modes d'affichage au choix:

* afficher sous forme de grille (par défaut):

![AfficheMethode](https://github.com/termith-anr/scripts-formats/blob/master/Screens/png/afficheMethode.png)

* afficher sous forme de liste:

![AfficheMethode](https://github.com/termith-anr/scripts-formats/blob/master/Screens/png/afficheMethodeListe.png)

**Remarques:**

Le nom de la méthode en cours est mis en évidence par sa couleur (sur la colonne de gauche), et chapeaute la liste des mots-clés (au centre).

Chaque mot-clé est encadré d’un rectangle et porte un numéro qui désigne l’ordre de génération par la méthode d’indexation.

######6. Evaluer la pertinence d'un mot-clé d'une méthode######

Cliquez sur **0**, **1** ou **2** pour attribuer un score de pertinence au mot-clé.
![notePertinence](https://github.com/termith-anr/scripts-formats/blob/master/Screens/png/notePertinence.png)


######7. Indiquer ou supprimer la forme préférée d'un mot-clé d'une méthode######

![preference](https://github.com/termith-anr/scripts-formats/blob/master/Screens/png/preference.png)

######8. Saisir un commentaire######

![commentaire](https://github.com/termith-anr/scripts-formats/blob/master/Screens/png/commentaire.png)

######9. Sauvegarder ou supprimer un commentaire et quitter la zone commentaire sans sauvegarder######

![ValiderCommentaire](https://github.com/termith-anr/scripts-formats/blob/master/Screens/png/validerCommentaire.png)

######10. Chercher un mot-clé dans le résumé et le texte######

![chercheMot](https://github.com/termith-anr/scripts-formats/blob/master/Screens/png/rechercheMot.png)

######11. Barre de progression et valider définitivement l'évaluation de la pertinence######

![barreProgression](https://github.com/termith-anr/scripts-formats/blob/master/Screens/png/barreProgession.png)

######12. Afficher ou cacher les mots-clés de l'INIST######

![motInist](https://github.com/termith-anr/scripts-formats/blob/master/Screens/png/afficheMotInist.png)

EVALUER LE SILENCE DES METHODES
-----------
######13. Evaluer le silence d'une méthode d'indexation automatique par rapport aux mots-clés de l'INIST######

![evalSilence](https://github.com/termith-anr/scripts-formats/blob/master/Screens/png/evalMotInist.png)

######14. Valider définitivement l'évaluation du silence######

![validerSilence](https://github.com/termith-anr/scripts-formats/blob/master/Screens/png/ValidationSilence.png)

######15. Exporter les résultats de l'évaluation######

![export](https://github.com/termith-anr/scripts-formats/blob/master/Screens/png/export.png)
