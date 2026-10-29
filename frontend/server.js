// On importe express pour faire notre serveur web
const express = require("express");

// On cree notre application
const app = express();

// Le port demander pour le frontend
const PORT = 8889;

// Cette route sert a afficher notre page web
app.get("/affichage", (req, res) => {
    // Pour le moment on affiche juste un message pour tester
    res.send("Bienvenue sur le front-end GTI700 !");
});

// On demarre le serveur sur le port 8889
app.listen(PORT, () => {
    console.log(`Serveur demarrer : http://localhost:${PORT}/affichage`);
});