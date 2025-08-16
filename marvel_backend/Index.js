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

// Vérifier que le fichier JSON existe sinon le créer
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, JSON.stringify({ characters: [] }, null, 2));
}

// Fonction utilitaire pour lire les données
const readData = () => {
  try {
    const jsonData = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(jsonData);
  } catch (e) {
    return { characters: [] };
  }
};

// Fonction utilitaire pour écrire les données
const writeData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// ✅ GET : récupérer tous les personnages
app.get('/api/characters', (req, res) => {
  const data = readData();
  res.json(data);
});

// ✅ PUT : modifier un personnage
app.put('/api/characters/:id', (req, res) => {
  const charId = parseInt(req.params.id);
  const { name, realName, universe } = req.body;

  const data = readData();
  const charIndex = data.characters.findIndex(c => c.id === charId);

  if (charIndex === -1) return res.status(404).json({ error: 'Personnage non trouvé' });

  // Mettre à jour uniquement les champs envoyés
  if (name !== undefined) data.characters[charIndex].name = name;
  if (realName !== undefined) data.characters[charIndex].realName = realName;
  if (universe !== undefined) data.characters[charIndex].universe = universe;

  writeData(data);
  res.json(data.characters[charIndex]);
});

// ✅ DELETE : supprimer un personnage (IDs conservés)
app.delete('/api/characters/:id', (req, res) => {
  const charId = parseInt(req.params.id);
  const data = readData();

  const newCharacters = data.characters.filter(c => c.id !== charId);
  if (newCharacters.length === data.characters.length) {
    return res.status(404).json({ error: 'Personnage non trouvé' });
  }

  writeData({ characters: newCharacters });
  res.json({ message: 'Personnage supprimé avec succès', characters: newCharacters });
});

// ✅ POST : ajouter un personnage
app.post('/api/characters', (req, res) => {
  const { name, realName, universe } = req.body;

  if (!name || !realName || !universe) {
    return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
  }

  const data = readData();
  const newId = data.characters.length > 0
    ? Math.max(...data.characters.map(c => c.id)) + 1
    : 1;

  const newCharacter = { id: newId, name, realName, universe };
  data.characters.push(newCharacter);

  writeData(data);
  res.status(201).json({ character: newCharacter });
});

app.listen(PORT, () => {
  console.log(`✅ Serveur backend démarré sur http://localhost:${PORT}`);
});
