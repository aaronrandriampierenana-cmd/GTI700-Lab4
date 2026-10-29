// On importe express pour notre serveur web
const express = require("express");

// Path sert a trouver le chemin de notre fichier html
const path = require("path");

// On cree notre application express
const app = express();

// Le port demander pour le frontend
const PORT = 8889;

// Cette route affiche notre page avec les deux capteurs
app.get("/affichage", (req, res) => {
    // On envoie le fichier html au navigateur
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// On demarre notre serveur web
app.listen(PORT, () => {
    console.log(`Serveur demarrer : http://localhost:${PORT}/affichage`);
});