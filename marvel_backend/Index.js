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
app.use(express.json());

const dataPath = path.join(__dirname, 'characters.json');

// ✅ GET : récupérer tous les personnages
app.get('/api/characters', (req, res) => {
  fs.readFile(dataPath, 'utf-8', (err, jsonData) => {
    if (err) return res.status(500).json({ error: 'Impossible de lire le fichier' });
    const data = JSON.parse(jsonData);
    res.json(data);
  });
});

// ✅ PUT : modifier un personnage
app.put('/api/characters/:id', (req, res) => {
  const charId = parseInt(req.params.id);
  const { name, realName, universe } = req.body;

  fs.readFile(dataPath, 'utf-8', (err, jsonData) => {
    if (err) return res.status(500).json({ error: 'Impossible de lire le fichier' });

    const data = JSON.parse(jsonData);
    const charIndex = data.characters.findIndex(c => c.id === charId);

    if (charIndex === -1) return res.status(404).json({ error: 'Personnage non trouvé' });

    // Mettre à jour tous les champs
    data.characters[charIndex].name = name;
    data.characters[charIndex].realName = realName;
    data.characters[charIndex].universe = universe;

    fs.writeFile(dataPath, JSON.stringify(data, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'Impossible de sauvegarder le fichier' });

      res.json(data.characters[charIndex]);
    });
  });
});

// ✅ DELETE : supprimer un personnage et réattribuer les IDs
app.delete('/api/characters/:id', (req, res) => {
  const charId = parseInt(req.params.id);

  fs.readFile(dataPath, 'utf-8', (err, jsonData) => {
    if (err) return res.status(500).json({ error: 'Impossible de lire le fichier' });

    let data = JSON.parse(jsonData);

    // Supprimer le personnage
    let newCharacters = data.characters.filter(c => c.id !== charId);

    if (newCharacters.length === data.characters.length) {
      return res.status(404).json({ error: 'Personnage non trouvé' });
    }

    // Réattribuer les IDs automatiquement (1,2,3...)
    newCharacters = newCharacters.map((c, index) => ({ ...c, id: index + 1 }));

    const newData = { characters: newCharacters };
    fs.writeFile(dataPath, JSON.stringify(newData, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'Impossible de sauvegarder le fichier' });

      res.json({ message: 'Personnage supprimé avec succès', characters: newCharacters });
    });
  });
});

// ✅ POST : ajouter un personnage
app.post('/api/characters', (req, res) => {
  const { name, realName, universe } = req.body;

  if (!name || !realName || !universe) {
    return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
  }

  fs.readFile(dataPath, 'utf-8', (err, jsonData) => {
    if (err) return res.status(500).json({ error: 'Impossible de lire le fichier' });

    const data = JSON.parse(jsonData);

    // Générer un nouvel id
    const newId = data.characters.length > 0
      ? Math.max(...data.characters.map(c => c.id)) + 1
      : 1;

    const newCharacter = { id: newId, name, realName, universe };
    data.characters.push(newCharacter);

    fs.writeFile(dataPath, JSON.stringify(data, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'Impossible de sauvegarder le fichier' });

      res.status(201).json({ character: newCharacter });
    });
  });
});

app.listen(PORT, () => {
  console.log(`✅ Serveur backend démarré sur http://localhost:${PORT}`);
});
