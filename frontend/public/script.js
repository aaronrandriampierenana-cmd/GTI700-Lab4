
"use strict";

// L'adresse du backend (API_URL) vient de /config.js, fourni par le serveur frontend

// On recupere les elements de la page
const tempActuelle = document.getElementById("temp-actuelle");
const humActuelle = document.getElementById("hum-actuelle");
const tempMoyenne = document.getElementById("temp-moyenne");
const humMoyenne = document.getElementById("hum-moyenne");
const tableTemp = document.getElementById("table-temp");
const tableHum = document.getElementById("table-hum");
const texteStatut = document.getElementById("texte-statut");

// On garde les graphique pour les mettre a jour
let graphiqueTemp = null;
let graphiqueHum = null;

// On evite de lancer deux mise a jour en meme temps
let chargement = false;

// Fonction pour verifier la reponse du serveur
// Meme principe que dans annexe C.2
function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.status + ": " + response.statusText);
    }

    return response;
}

// On fait une requete avec fetch comme dans l'annexe
function recupererValeur(route) {
    return fetch(API_URL + route)
        .then(handleErrors)
        .then(response => response.json());
}

// On affiche les mesure dans le tableau
function afficherTableau(tableau, mesures) {
    // On vide les anciennes lignes
    tableau.innerHTML = "";

    // On ajoute chaque mesure
    mesures.forEach(mesure => {
        const ligne = document.createElement("tr");
        const date = document.createElement("td");
        const valeur = document.createElement("td");

        date.textContent = mesure[0];
        valeur.textContent = mesure[1];

        ligne.appendChild(date);
        ligne.appendChild(valeur);
        tableau.appendChild(ligne);
    });
}

// On transforme la date pour garder seulement l'heure
function obtenirHeure(timestamp) {
    // On accepte une date en texte ou un timestamp numerique
    let date;

    if (typeof timestamp === "number") {
        date = new Date(timestamp);
    } else {
        date = new Date(String(timestamp).replace(" ", "T"));
    }

    // Si la date marche pas on affiche la valeur recu
    if (isNaN(date.getTime())) {
        return String(timestamp);
    }

    // Format HH:mm:ss
    return [
        String(date.getHours()).padStart(2, "0"),
        String(date.getMinutes()).padStart(2, "0"),
        String(date.getSeconds()).padStart(2, "0")
    ].join(":");
}

// On cree ou on modifie un graphique
function afficherGraphique(idCanvas, mesures, couleur, graphique) {
    const heures = mesures.map(mesure => obtenirHeure(mesure[0]));
    const valeurs = mesures.map(mesure => Number(mesure[1]));

    // Si le graphique existe on change juste les valeurs
    if (graphique !== null) {
        graphique.data.labels = heures;
        graphique.data.datasets[0].data = valeurs;
        graphique.update();

        return graphique;
    }

    // Sinon on cree un nouveau graphique
    return new Chart(document.getElementById(idCanvas), {
        type: "line",

        data: {
            labels: heures,
            datasets: [{
                data: valeurs,
                borderColor: couleur,
                backgroundColor: couleur,
                borderWidth: 2,
                tension: 0.2,
                pointRadius: 3,
                fill: false
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: false
                }
            },

            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Heure"
                    }
                },

                y: {
                    title: {
                        display: true,
                        text: "Valeur"
                    }
                }
            }
        }
    });
}

// On recupere les donnees des 6 routes
function mettreAJourCapteurs() {
    // On attend que la demande precedente finisse
    if (chargement) {
        return;
    }

    chargement = true;

    // On demande les 6 valeurs au backend
    Promise.all([
        recupererValeur("/capteurs/temp"),
        recupererValeur("/capteurs/hum"),
        recupererValeur("/capteurs/temp/30"),
        recupererValeur("/capteurs/hum/30"),
        recupererValeur("/capteurs/temp/30/moy"),
        recupererValeur("/capteurs/hum/30/moy")
    ])
    .then(data => {
        // On recupere les reponse
        const temperature = data[0];
        const humidite = data[1];
        const historiqueTemp = data[2];
        const historiqueHum = data[3];
        const moyenneTemp = data[4];
        const moyenneHum = data[5];

        // On affiche les valeur actuelle
        tempActuelle.textContent = temperature;
        humActuelle.textContent = humidite;

        // On affiche les moyenne
        tempMoyenne.textContent = moyenneTemp;
        humMoyenne.textContent = moyenneHum;

        // On rempli les tableaux
        afficherTableau(tableTemp, historiqueTemp);
        afficherTableau(tableHum, historiqueHum);

        // On met a jour les deux graphique
        graphiqueTemp = afficherGraphique(
            "graph-temp",
            historiqueTemp,
            "#e85d66",
            graphiqueTemp
        );

        graphiqueHum = afficherGraphique(
            "graph-hum",
            historiqueHum,
            "#4285e8",
            graphiqueHum
        );

        texteStatut.textContent = "Serveur connecte";
    })
    .catch(error => {
        // On affiche une erreur si la connexion marche pas
        texteStatut.textContent = "Erreur de connexion";
        console.log("Une erreur est survenue: " + error);
    })
    .finally(() => {
        chargement = false;
    });
}


/*
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

    // On affiche les deux graphiques avec les donnees de test
    graphiqueTemp = afficherGraphique(
        "graph-temp",
        historiqueTemp,
        "#e85d66",
        graphiqueTemp
    );

    graphiqueHum = afficherGraphique(
        "graph-hum",
        historiqueHum,
        "#4285e8",
        graphiqueHum
    );
}


// On teste notre affichage sans le backend
testerAffichage();
*/

// On charge les donnees au debut
 mettreAJourCapteurs();

// On recommence chaque 3 secondes
 setInterval(mettreAJourCapteurs, 3000);
