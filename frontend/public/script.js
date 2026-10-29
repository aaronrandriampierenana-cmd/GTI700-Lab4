
"use strict";

// Adresse du backend
const API_URL = "http://localhost:8080";

// On recupere les elements HTML pour les valeurs
const tempActuelle = document.getElementById("temp-actuelle");
const humActuelle = document.getElementById("hum-actuelle");
const tempMoyenne = document.getElementById("temp-moyenne");
const humMoyenne = document.getElementById("hum-moyenne");
const tableTemp = document.getElementById("table-temp");
const tableHum = document.getElementById("table-hum");

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

// On affiche les 30 mesures dans un tableau
function afficherTableau(tableau, mesures) {
    // On vide le tableau avant de mettre les nouvelles mesures
    tableau.innerHTML = "";

    // On passe sur chaque mesure recue
    mesures.forEach((mesure) => {
        const ligne = document.createElement("tr");

        // La mesure contient ue date et une valeur
        const date = document.createElement("td");
        const valeur = document.createElement("td");

        date.textContent = mesure[0];
        valeur.textContent = mesure[1];

        // On ajoute les deux case dans la ligne
        ligne.appendChild(date);
        ligne.appendChild(valeur);

        // On ajoute la ligne au tableau
        tableau.appendChild(ligne);
    });
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

        // On recupere les 30 dernieres mesures
        const historiqueTemp = await recupererValeur("/capteurs/temp/30");
        const historiqueHum = await recupererValeur("/capteurs/hum/30");

        // On recupere les moyennes des 30 mesures
        const moyenneTemp = await recupererValeur("/capteurs/temp/30/moy");
        const moyenneHum = await recupererValeur("/capteurs/hum/30/moy");

        // On affiche que la connexion fonctionne
        texteStatut.textContent = "Serveur connecte"; 

        // On affiche les moyennes
        tempMoyenne.textContent = moyenneTemp;
        humMoyenne.textContent = moyenneHum;

        // On remplit les deux tableaux
        afficherTableau(tableTemp, historiqueTemp);
        afficherTableau(tableHum, historiqueHum);



    } catch (erreur) {
        // On affiche une erreur si le serveur repond pas
        texteStatut.textContent = "Erreur de connexion";

        // On affiche aussi l'erreur dans la console
        console.error("Erreur des capteurs :", erreur);
    }
}

// Test temporaire pour voir notre interface sans backend
function testerAffichage() {

    // Quelques mesures pour tester les tableaux
    const historiqueTemp = [
        ["2026-10-29 14:30:00", 22.5],
        ["2026-10-29 14:30:03", 22.7],
        ["2026-10-29 14:30:06", 22.6],
        ["2026-10-29 14:30:09", 22.8],
        ["2026-10-29 14:30:12", 22.9]
    ];

    const historiqueHum = [
        ["2026-10-29 14:30:00", 45.2],
        ["2026-10-29 14:30:03", 45.4],
        ["2026-10-29 14:30:06", 45.1],
        ["2026-10-29 14:30:09", 45.6],
        ["2026-10-29 14:30:12", 45.3]
    ];

    // On affiche les valeurs actuelles
    tempActuelle.textContent = 22.9;
    humActuelle.textContent = 45.3;

    // On affiche les moyennes des donnees de test
    tempMoyenne.textContent = "22.7";
    humMoyenne.textContent = "45.3";

    // On rempli les deux tableaux
    afficherTableau(tableTemp, historiqueTemp);
    afficherTableau(tableHum, historiqueHum);

    // On indique que ce sont des donnees de test
    texteStatut.textContent = "Mode test - donnees fictives";
}


// On teste notre affichage sans le backend
testerAffichage();

// On desactive les appels API pendant notre test
// mettreAJourCapteurs();
// setInterval(mettreAJourCapteurs, 3000);
