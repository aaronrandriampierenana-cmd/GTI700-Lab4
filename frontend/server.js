
const express = require("express");
const path = require("path");

// On cree notre application web avec express
const app = express();

// Port demander pour le frontend
const PORT = 8889;

// On permet au navigateur de charger le css et les fichiers public
app.use(express.static(path.join(__dirname, "public")));

// Cette route affiche notre page avec les deux capteurs
app.get("/affichage", (req, res) => {
    // On envoie notre fichier html au navigateur
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// On demarre notre serveur web
app.listen(PORT, () => {
    console.log(`Serveur demarrer : http://localhost:${PORT}/affichage`);
});
