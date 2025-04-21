Project Motus est une application de jeu basée sur le populaire jeu Motus. Le but est de deviner un mot secret en un nombre limité de tentatives. Le projet est structuré en deux parties : un frontend construit avec React.js et un backend utilisant Node.js et Express.js.


Motus est un jeu où le joueur doit deviner un mot secret, en entrant des lettres à chaque tentative. Après chaque tentative, des indices sont donnés sous forme de couleur :

  Rouge : La lettre est à la bonne position.

  Jaune : La lettre est présente mais à la mauvaise position.

  Bleu : La lettre n’est pas présente dans le mot.

Ce projet inclut une gestion de la base de données pour stocker les informations sur les parties en cours et les utilisateurs, ainsi qu’un API qui permet de générer et récupérer des mots à deviner en fonction de la difficulté choisie.

Stack Technologique

Frontend : React.js

Backend : Node.js avec Express.js

Base de données : Prisma + SQLite

API externe : Trouve-Mot API

Installation
Prérequis

----------------------------------------------------------------------------------------
Avant de commencer, assurez-vous d’avoir installé Node.js et npm sur votre machine. Si vous n'avez pas ces outils, vous pouvez les installer à partir de nodejs.org.

Installation de l'application

Allez dans le dossier du backend et installez les dépendances :

cd motus-backend
npm install

Ensuite, allez dans le dossier du frontend et installez les dépendances :

  cd ../motus-frontend
  npm install

Lancer le projet

Lancez le backend dans le dossier motus-backend :   npm start

Lancez le frontend dans le dossier motus-frontend :   npm start


Le frontend sera accessible à http://localhost:3000 et le backend à http://localhost:5000.
