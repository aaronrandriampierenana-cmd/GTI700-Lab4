const { spawn } = require('child_process');
const readline = require('readline');
const path = require('path');

const SCRIPT = path.join(__dirname, 'python', 'sensors.py');
const MAX = 720;

const historiques = { temp: [], hum: [] }; // tableaux de [timestamp,valeur]

function ajouter(type, valeur) {
  if (valeur===null||valeur===undefined){
    return;
  }
  const timestamp=new Date().toLocaleString('fr-CA');
  historiques[type].push([timestamp, valeur]);
  if (historiques[type].length>MAX){
    historiques[type].shift(); //on enlève l'élément le plus ancien si on a trop de valeurs
  }
}

function derniere(type){
    if (historiques[type].length!=0){
        return historiques[type].at(-1)[1];
    }
    else return null;
}

function dernieres(type,n){
    if (historiques[type].length===0){
        return [];
    }
    return historiques[type].slice(-n);
}

function moyenne(type,n){
    if (historiques[type].length===0){
        return null;
    }
    if (historiques[type].length<n){
        const somme = historiques[type].reduce((total,element)=>total+element[1],0);
        return Number((somme/historiques[type].length).toFixed(1));
    }
    const liste=dernieres(type,n);
        const somme = liste.reduce((total,element)=>total+element[1],0);
        return Number((somme/n).toFixed(1)); // valeur arrondie à un chiffre
    return null;
}

let proc = null;

function demarrer() {
  proc = spawn('python3', ['-u', SCRIPT]);
  readline.createInterface({ input: proc.stdout }).on('line', (ligne) => {
    try {
      const mesure = JSON.parse(ligne);
      ajouter('temp', mesure.temp);
      ajouter('hum', mesure.hum);
    } catch (e) {
      console.error('Ligne ignorée (JSON invalide) :', ligne);
    }
  });

  proc.stderr.on('data', (d) => console.error('[python]', d.toString().trim()));

  proc.on('exit', (code) => {
    console.error(`Script Python arrêté (code ${code}), relance dans 3 s`);
    setTimeout(demarrer, 3000);
  });
}

// fermer le script quand node ferme
function arreter() {
  if (proc) {
    proc.removeAllListeners('exit');   // éviter la relance automatique
    proc.kill();
  }
  process.exit(0);
}
process.on('SIGINT', arreter);
process.on('SIGTERM', arreter);

module.exports = { demarrer, derniere, dernieres, moyenne };

if (require.main === module) {
  demarrer();
  setInterval(() => {
    console.log(`Température : ${derniere('temp')} °C | Humidité : ${derniere('hum')} %`);
  }, 3000);
}
