
"use strict";

// Adresse du backend
const API_URL = "http://localhost:8080";

// On recupere les elements HTML pour les valeurs
const tempActuelle = document.getElementById("temp-actuelle");
const humActuelle = document.getElementById("hum-actuelle");

// On recupere le statut de connexion
const texteStatut = document.getElementById("texte-statut");

// Fonction pour demander une valeur au backend
async function recupererValeur(route) {
    // On envoie la demande au serveur
    const reponse = await fetch(API_URL + route);

    // On verifie si la demande a fonctionner
    if (!reponse.ok) {
        throw new Error("Erreur HTTP : " + reponse.status);
    }

    // On retourne les donnees recu
    return await reponse.json();
}

// Fonction pour afficher les valeurs des capteurs
async function mettreAJourCapteurs() {
    try {
        // On recupere la temperature et l'humidite
        const temperature = await recupererValeur("/capteurs/temp");
        const humidite = await recupererValeur("/capteurs/hum");

        // On affiche les valeurs dans la page
        tempActuelle.textContent = temperature;
        humActuelle.textContent = humidite;

        // On affiche que la connexion fonctionne
        texteStatut.textContent = "Serveur connecte";

    } catch (erreur) {
        // On affiche une erreur si le serveur repond pas
        texteStatut.textContent = "Erreur de connexion";

        // On affiche aussi l'erreur dans la console
        console.error("Erreur des capteurs :", erreur);
    }
}

// On charge les valeurs quand la page ouvre
mettreAJourCapteurs();

// On actualise les valeurs chaque 3 secondes
setInterval(mettreAJourCapteurs, 3000);
