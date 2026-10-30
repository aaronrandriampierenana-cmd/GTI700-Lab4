
const express = require("express");
const path = require("path");

// On cree notre application web avec express
const app = express();

// Port demander pour le frontend
const PORT = 8889;

// Adresse du backend (Raspberry Pi A), vue depuis le navigateur du client (C)
// Exemple : BACKEND_URL=http://192.168.1.50:8080 node server.js
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

// On donne l'adresse du backend au code JS du navigateur
app.get("/config.js", (req, res) => {
    res.type("application/javascript");
    res.send(`const API_URL = ${JSON.stringify(BACKEND_URL)};`);
});

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
    console.log(`Backend utilise : ${BACKEND_URL}`);
});
