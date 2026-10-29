const express = require('express');
const cors = require('cors');
const capteurs = require('./sensors');

const PORT = 8080;
const TYPES = ['temp', 'hum'];

const app = express();
app.use(cors());          // autorise le front (port 8889) à appeler cette API
capteurs.demarrer();

app.get('/capteurs/:type', (req, res) => {
  const type = req.params.type;
  if (!TYPES.includes(type)){
    return res.status(404).json({erreur: 'Capteur inconnu'});
  }
  return res.json(capteurs.derniere(type));
});

app.get('/capteurs/:type/:n', (req, res) => {
  const type =req.params.type;
  const n = Number(req.params.n);
  if (!TYPES.includes(type)){
    return res.status(404).json({erreur: 'Capteur inconnu'});
  }
  if (Number.isInteger(n)&& n>=1 && n<=720){ //si n est un entier entre 1 et 720 s car on mesure toutes les 3 secondes pendant 1h 
    return res.json(capteurs.dernieres(type,n));
  }
  return res.status(400).json({erreur:'Il faut entrer un entier entre 1 et 720'})
});

app.get('/capteurs/:type/:n/moy', (req, res) => {
  const type =req.params.type;
  const n = Number(req.params.n);
  if (!TYPES.includes(type)){
    return res.status(404).json({erreur: 'Capteur inconnu'});
  }
  if (Number.isInteger(n)&& n>=1 && n<=720){ //si n est un entier entre 1 et 720 car on mesure toutes les 3 secondes pendant 1h 
    return res.json(capteurs.moyenne(type,n));
  }
  return res.status(400).json({erreur:'Il faut entrer un entier entre 1 et 720'})
});

app.listen(PORT, () => console.log(`API sur http://localhost:${PORT}`));