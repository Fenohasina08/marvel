// Import des modules
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
// Pour gérer les chemins en ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
app.use(cors());
// Route pour lire le JSON
app.get('/api/characters', (req, res) => {
  const dataPath = path.join(__dirname, 'characters.json');
  
  fs.readFile(dataPath, 'utf-8', (err, jsonData) => {
    if (err) {
      return res.status(500).json({ error: 'Impossible de lire le fichier' });
    }
    const data = JSON.parse(jsonData);
    res.json(data);
  });
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur backend démarré sur http://localhost:${PORT}`);
});
