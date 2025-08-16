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

// Middleware
app.use(cors());
app.use(express.json()); // Permet de lire les données JSON du body

// Chemin du fichier JSON
const dataPath = path.join(__dirname, 'characters.json');

/**
 * ROUTE GET : Récupérer tous les personnages
 */
app.get('/api/characters', (req, res) => {
  fs.readFile(dataPath, 'utf-8', (err, jsonData) => {
    if (err) {
      return res.status(500).json({ error: 'Impossible de lire le fichier' });
    }
    const data = JSON.parse(jsonData);
    res.json(data);
  });
});

/**
 * ROUTE PUT : Modifier un personnage spécifique
 */
app.put('/api/characters/:id', (req, res) => {
  const charId = parseInt(req.params.id);
  const { name } = req.body;

  // Lire le fichier JSON
  fs.readFile(dataPath, 'utf-8', (err, jsonData) => {
    if (err) return res.status(500).json({ error: 'Impossible de lire le fichier' });

    const data = JSON.parse(jsonData);
    const charIndex = data.characters.findIndex(c => c.id === charId);

    if (charIndex === -1) return res.status(404).json({ error: 'Personnage non trouvé' });

    // Modifier le nom du personnage
    data.characters[charIndex].name = name;

    // Réécrire le fichier JSON
    fs.writeFile(dataPath, JSON.stringify(data, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'Impossible de sauvegarder le fichier' });

      // Renvoie le personnage modifié
      res.json(data.characters[charIndex]);
    });
  });
});

/**
 * ROUTE DELETE : Supprimer un personnage spécifique
 */
app.delete('/api/characters/:id', (req, res) => {
  const charId = parseInt(req.params.id);

  // Lire le fichier JSON
  fs.readFile(dataPath, 'utf-8', (err, jsonData) => {
    if (err) return res.status(500).json({ error: 'Impossible de lire le fichier' });

    const data = JSON.parse(jsonData);
    const newCharacters = data.characters.filter(c => c.id !== charId);

    // Vérifie si un personnage a été supprimé
    if (newCharacters.length === data.characters.length) {
      return res.status(404).json({ error: 'Personnage non trouvé' });
    }

    // Réécrire le fichier JSON
    const newData = { characters: newCharacters };
    fs.writeFile(dataPath, JSON.stringify(newData, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'Impossible de sauvegarder le fichier' });

      res.json({ message: 'Personnage supprimé avec succès' });
    });
  });
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur backend démarré sur http://localhost:${PORT}`);
});
