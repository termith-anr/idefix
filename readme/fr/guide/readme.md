

Projet TermITH
==============
![logoTermith](https://raw.githubusercontent.com/termith-anr/scripts-formats/master/Screens/jpeg/termihLogo.jpg)

OUTIL IDEFIX
============

######0. Page d'accueil d'IDEFIX######

![accueil](https://raw.githubusercontent.com/termith-anr/scripts-formats/master/Screens/png/accueil.png)

La page d'accueil permet de:

* visualiser le nombre total de documents;

* choisir le nombre de documents à afficher par page;

* faire une recherche de mot dans la liste de documents (sur le titre et le nom de fichier);

* afficher les documents par statut: Tous, Traités ou Non traités.

######1. Couleur de l'évaluation de la pertinence et couleur de l'évaluation du silence######

Sur la page d'accueil, le titre de certains documents prend un fond coloré:

* couleur **bleue** correspond à l'évaluation de la **pertinence** et indique le niveau de la progression de l'évaluation;

* couleur **grise** correspond à l'évaluation du **silence** et indique le niveau de la progression de l'évaluation.
![couleurPertinenceSilence](https://raw.githubusercontent.com/termith-anr/scripts-formats/master/Screens/png/couleurPertSilence.png)

**Remarques:**
Certains documents sont déjà colorés avant l'intervention de l'évaluateur. Cela veut dire des scores de pertinence ont été attribués automatiquement par comparaison avec l'indexation INIST. Ainsi, si le mot-clé est présent dans l'indexation INIST, le score 2 est attribué automatiquement.
L'évaluateur peut bien sûr modifier ce score.


######2. Sélectionner un document######

Cliquez sur un document pour le sélectionner.
![selectionDoc](https://raw.githubusercontent.com/termith-anr/scripts-formats/master/Screens/png/selectionDoc.png)



######4. Document ouvert######

Aprés avoir cliqué sur un document, il s'ouvre comme ci-dessous. Il contient:

* le titre;

* le résumé;

* la possibilité d'afficher le texte en cliquant sur le bouton prévu;

* le timer qui indique la durée totale passée sur un document. Il s'active autoamtiquement à l'ouverture du document. Il s'arrête automatiquement en plaçant la souris en dehors de la page en cours, en fermant le document en cours ou à la validation des deux évaluations (pertinence et silence);

* la discipline;

* la barre de progression pour l'évaluation de la pertinence dans un premier temps (la barre de progression pour le silence s'affichera après validation de la pertinence);

* toutes les méthodes d'indexation automatique à évaluer.
![documentOuvert](https://raw.githubusercontent.com/termith-anr/scripts-formats/master/Screens/png/ouvertureDoc.png)

EVALUER LA PERTINENCE DES METHODES
-----------
######5. Afficher les mots-clés d'une méthode d'indexation autoamtique######

Pour afficher les mots-clés d'une méthode, cliquez sur le nom de la méthode souhaitée.
Deux modes d'affichage au choix:

* afficher sous forme de grille (par défaut):

![AfficheMethode](https://raw.githubusercontent.com/termith-anr/scripts-formats/master/Screens/png/afficheMethode.png)

* afficher sous forme de liste:

![AfficheMethode](https://raw.githubusercontent.com/termith-anr/scripts-formats/master/Screens/png/afficheMethodeListe.png)

**Remarques:**

Le nom de la méthode en cours est mis en évidence par sa couleur (sur la colonne de gauche), et chapeaute la liste des mots-clés (au centre).

Chaque mot-clé est encadré d’un rectangle et porte un numéro qui désigne l’ordre de génération par la méthode d’indexation.

######6. Evaluer la pertinence d'un mot-clé d'une méthode######

Cliquez sur **0**, **1** ou **2** pour attribuer un score de pertinence au mot-clé.
![notePertinence](https://raw.githubusercontent.com/termith-anr/scripts-formats/master/Screens/png/notePertinence.png)


######7. Indiquer ou supprimer la forme préférée d'un mot-clé d'une méthode######

![preference](https://raw.githubusercontent.com/termith-anr/scripts-formats/master/Screens/png/preference.png)

######8. Saisir un commentaire######

![commentaire](https://raw.githubusercontent.com/termith-anr/scripts-formats/master/Screens/png/commentaire.jpg)

######9. Sauvegarder ou supprimer un commentaire et quitter la zone commentaire sans sauvegarder######

![ValiderCommentaire](https://raw.githubusercontent.com/termith-anr/scripts-formats/master/Screens/png/validerCommentaire.png)

######10. Chercher un mot-clé dans le résumé et le texte######

![chercheMot](https://raw.githubusercontent.com/termith-anr/scripts-formats/master/Screens/png/rechercheMot.png)

######11. Barre de progression et valider définitivement l'évaluation de la pertinence######

![barreProgression](https://raw.githubusercontent.com/termith-anr/scripts-formats/master/Screens/png/barreProgession.png)

######12. Afficher ou cacher les mots-clés de l'INIST######

![motInist](https://raw.githubusercontent.com/termith-anr/scripts-formats/blob/master/Screens/png/afficheMotInist.png)

EVALUER LE SILENCE DES METHODES
-----------
######13. Evaluer le silence d'une méthode d'indexation automatique par rapport aux mots-clés de l'INIST######

![evalSilence](https://raw.githubusercontent.com/termith-anr/scripts-formats/blob/master/Screens/png/evalMotInist.png)

######14. Valider définitivement l'évaluation du silence######

![validerSilence](https://raw.githubusercontent.com/termith-anr/scripts-formats/master/Screens/png/ValidationSilence.png)

######15. Exporter les résultats de l'évaluation######

![export](https://raw.githubusercontent.com/termith-anr/scripts-formats/master/Screens/png/export.png)
