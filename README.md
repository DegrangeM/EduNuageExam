<!-- https://badgen.net/badge/EduNuageExam/T%C3%A9l%C3%A9charger/0f81c1?icon=github -->
<a href="https://github.com/DegrangeM/EduNuageExam/releases/latest">![0f81c1](https://user-images.githubusercontent.com/53106394/220177662-84190745-6f65-44d8-aa69-57af03b523dd.svg)</a>

# EduNuageExam

*EduNuageExam est une solution permettant de faire composer les élèves dans une interface sécurisée.*

![image](https://user-images.githubusercontent.com/53106394/220195418-f24f704f-aecc-40d4-9669-50eb2a273fcb.png)

Il peut arriver que des élèves aient à composer des travaux notés sur ordinateur (par exemple dans le cadre d'une rédaction, ou bien par exemple des élèves qui bénéficieraient d'aménagements afin de rédiger sur ordinateur). Malheureusement certains en profitent pour tricher (utilisation de site de traduction en ligne par exemple).

Ce logiciel qui s'utilise conjointement avec le cloud de l'éducation nationnale (ou via un [autre cloud pris en charge](https://github.com/DegrangeM/EduNuageExam/wiki/Les-clouds-pris-en-charge)) permet de limiter les risques de triches en bloquant les élèves sur l'interface de rédaction afin d'éviter toute consultation d'un autre site web ou fichier présent sur l'ordinateur.

![image](https://user-images.githubusercontent.com/53106394/220179066-473031ce-4272-4149-a89c-691a4e7dfc54.png)


## Fonctionnement du logiciel (du point de vu de l'élève)

- L'élève lance le logiciel via le fichier `EduNuageExam.exe`.

- L'élève ouvre le lien du devoir (qui a par exemple été envoyé via la messagerie de son ENT).

- Le logiciel demande à l'élève s'il souhaite débuter l'examen. L'élève accepte (si possible devant l'enseignant).

- L'élève compose son devoir. L'application est en plein écran et il n'a pas accès au reste de son ordinateur.

- L'élève appelle l'enseignant qui donne à l'élève l'autorisation de quitter l'examen.

- L'élève quitte l'examen. Un message donne l'heure de début et de fin de l'examen et signale à l'enseignant tout [comportement suspect](https://github.com/DegrangeM/EduNuageExam/wiki/Les-comportements-suspects).

## Fonctionnement du logiciel (du point de vu de l'enseignant)

- L'enseignant créé son document partagé sur le cloud de l'Education Nationale (ou sur un [autre cloud pris en charge](https://github.com/DegrangeM/EduNuageExam/wiki/Les-clouds-pris-en-charge)) :

  - L'enseignant se rend sur le [cloud de l'éducation nationale](https://nuage.apps.education.fr/)

  - L'enseignant créé un nouveau document texte

    <img src="https://user-images.githubusercontent.com/53106394/220179566-dbba53de-b307-40a1-8424-5e454573b693.png" height="200" />

  - L'enseignant créé un lien de partage

    <img src="https://user-images.githubusercontent.com/53106394/220180416-05fc1114-80ac-4c4e-b793-bc0b9cdb14c1.png" height="200" />

  - L'enseignant donne les droits de modification

    <img src="https://user-images.githubusercontent.com/53106394/220180135-7a382ded-1ebb-4c43-8db4-6dd22192786e.png" height="200" />

  - L'enseignant copie le lien de partage et l'envoi à l'élève (via la messagerie de l'ent par exemple)

    <img src="https://user-images.githubusercontent.com/53106394/220180743-c187a880-747c-44d2-b6af-a5dde9bac5d3.png" />

- L'enseignant peut demander par précaution à l'élève de fermer tous les logiciels ouvert sur son ordinateur.

- L'élève lance le logiciel, ouvre le lien du devoir, et clic sur le bouton pour débuter l'examen (si possible devant l'enseignant).

- L'élève compose son devoir. L'application est en plein écran et il n'a pas accès au reste de son ordinateur.

- L'élève appelle l'enseignant puis l'enseignant donne à l'élève l'autorisation de quitter l'examen.

- L'enseignant vérifie la cohérence des informations qui s'affichent :
  - Date de début et de fin de l'examen (l'élève peut avoir quitté le logiciel entre temps ...)
  - Présence de [comportements suspects](https://github.com/DegrangeM/EduNuageExam/wiki/Les-comportements-suspects) ou non
  - Certains comportement suspect génère des captures d'écrans que l'enseignant peut consulter.

- L'enseignant retire le partage (pour éviter que l'élève puisse modifier le document à postériori)

  <img src="https://user-images.githubusercontent.com/53106394/220181775-ffaa88fc-fb51-480e-bb40-d3fdc30cd723.png" height="200" />

- L'enseignant peut ensuite consulter la copie à tout moment via le cloud de l'EN (astuce : il peut même consulter la copie pendant que l'élève la rédige !)

## Remarques et conseils

- Vous pouvez demander aux élèves de télécharger le logiciel (mais ne faites pas un lien directement vers ce site car il contient des informations sur les mesures de sécurités, préférez mettre en ligne le fichier zip du logiciel sur votre ent par exemple) mais cela permet aux élèves de tester le logiciel de leur côté et d'éventuellement chercher à contourner les sécurités. Une meilleure solution est de faire acheté par son établissement des clefs usb (1Go est largement suffisant !) et d'y mettre le logiciel. Vous pouvez ainsi brancher la clef avant le début de l'évaluation, puis la retirer à la fin de l'évaluation (et il suffit de mettre ces clefs usb à disposition des enseignants pour avoir un système très pratique).

- Un élève pourrait très bien avoir un complice hors établissement qui se connecte à son compte ENT et modifie le document en même temps que l'élève ... vous pouvez passer dans les rangs et vérifier en haut à droite si plus d'une personne est connecté au document.

- Pour éviter que l'élève utiliser les fonctionnalités de traduction et de correcteur orthographique (hors français) le menu `Outils` est désactivé. Cela veut aussi dire qu'il ne peut pas utiliser ce menu pour compter le nombre de mot par exemple.

- Si un élève a fermé le logiciel sans vous avoir montré le message de fin vous pouvez trouver dans le dossier `data` un fichier txt comportant toutes ces informations. Mais attention l'élève peut avoir tout simplement modifié ce fichier ... Il vaudrait mieux refaire passer l'évaluation à l'élève.

## Configuration de la page d'accueil

Par défaut le logiciel ouvre la page du moteur de recherche google. Vous pouvez modifier cette page par défaut en modifiant (au même endroit que le fichier `EduNuageExam.exe`) le fichier `home.txt` avec l'adresse url de votre choix.

Vous pouvez par exemple mettre l'adresse url de votre ENT. Les élèves n'ont alors plus qu'à se connecter pour accéder au message contenant le lien vers le fichier partagé.

Vous pouvez également mettre directement l'url du fichier partagé. Ainsi l'élève a juste à lancer le logiciel, mais cela nécessite alors de modifier le fichier `home.txt` à chaque évaluation.

## Limites du logiciel

Si ce logiciel permet de limiter le risque de triche, il ne permet pas de le bloquer entièrement. Le système d'enregristement des comportements suspects permet (s'il est correctement utilisé) de détecter certaines triches que le logiciel n'a pas réussi à bloqué. Si cela devrait être suffisement pour la quasi totalité des cas, il reste en revanche toujours des moyens avancés de contourner toutes ces mesures de sécurités. 

N'oubliez pas non plus que la triche peut avoir lieu par des moyens externes à l'ordinateur (téléphone, montre connecté, anti-sèche, etc.).

## Les sécurités mises en place

- La fenêtre du logiciel est mise en plein écran et le mode "Toujours au dessus" est activé.

- Si la fenêtre du logiciel n'est plus active, elle essaie de redevenir active.

- Le logiciel enregistre les comportements suspects et prend éventuellement des captures d'écran.

- Le presse-papier est vidé au lancement du logiciel
