 import React, { useState, useEffect } from 'react';

function App() {
  const [characters, setCharacters] = useState([]); // Liste des personnages
  const [editingId, setEditingId] = useState(null); // ID du personnage en édition
  const [editingCharacter, setEditingCharacter] = useState({
    name: '',
    realName: '',
    universe: ''
  });
  const [showForm, setShowForm] = useState(false);  // Afficher le formulaire d'ajout
  const [newCharacter, setNewCharacter] = useState({
    name: '',
    realName: '',
    universe: ''
  });

  // Récupérer les personnages depuis le backend
  useEffect(() => {
    fetch('http://localhost:3001/api/characters')
      .then(res => res.json())
      .then(data => setCharacters(data.characters))
      .catch(err => console.error('Erreur:', err));
  }, []);

  // Supprimer un personnage
  const deleteCharacter = (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce personnage ?")) return;
    fetch(`http://localhost:3001/api/characters/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(data => {
        setCharacters(data.characters);
      })
      .catch(err => console.error('Erreur suppression:', err));
  };

  // Commencer l'édition
  const startEditing = (char) => {
    setEditingId(char.id);
    setEditingCharacter({
      name: char.name,
      realName: char.realName,
      universe: char.universe
    });
  };

  // Sauvegarder la modification
  const saveEdit = (id) => {
    const { name, realName, universe } = editingCharacter;
    if (!name.trim() || !realName.trim() || !universe.trim()) {
      return alert("Tous les champs doivent être remplis !");
    }

    fetch(`http://localhost:3001/api/characters/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingCharacter) // envoyer tous les champs
    })
      .then(res => res.json())
      .then(updatedChar => {
        setCharacters(characters.map(char => char.id === id ? updatedChar : char));
        setEditingId(null);
      })
      .catch(err => console.error('Erreur mise à jour:', err));
  };

  // Ajouter un nouveau personnage
  const addCharacter = () => {
    if (!newCharacter.name || !newCharacter.realName || !newCharacter.universe) {
      alert("Tous les champs doivent être remplis !");
      return;
    }

    const nextId = characters.length > 0 ? Math.max(...characters.map(c => c.id)) + 1 : 1;
    const characterToAdd = { id: nextId, ...newCharacter };

    setCharacters([...characters, characterToAdd]);
    setNewCharacter({ name: '', realName: '', universe: '' });
    setShowForm(false);

    fetch('http://localhost:3001/api/characters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(characterToAdd)
    })
      .then(res => res.json())
      .then(data => console.log('Personnage ajouté:', data))
      .catch(err => console.error(err));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 flex text-center items-center">
        Tableau des personnages
      </h1>

      <div className="overflow-x-auto mt-5">
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Surnom</th>
              <th className="py-2 px-4 border-b">Noms</th>
              <th className="py-2 px-4 border-b">Univers</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {characters.map(char => (
              <tr key={char.id} className="text-center hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{char.id}</td>

                {/* Edition Nom */}
                <td className="py-2 px-4 border-b">
                  {editingId === char.id ? (
                    <input
                      type="text"
                      value={editingCharacter.name}
                      onChange={(e) =>
                        setEditingCharacter({ ...editingCharacter, name: e.target.value })
                      }
                      className="border border-gray-300 rounded px-2 py-1"
                    />
                  ) : (
                    char.name
                  )}
                </td>

                {/* Edition Nom Réel */}
                <td className="py-2 px-4 border-b">
                  {editingId === char.id ? (
                    <input
                      type="text"
                      value={editingCharacter.realName}
                      onChange={(e) =>
                        setEditingCharacter({ ...editingCharacter, realName: e.target.value })
                      }
                      className="border border-gray-300 rounded px-2 py-1"
                    />
                  ) : (
                    char.realName
                  )}
                </td>

                {/* Edition Univers */}
                <td className="py-2 px-4 border-b">
                  {editingId === char.id ? (
                    <input
                      type="text"
                      value={editingCharacter.universe}
                      onChange={(e) =>
                        setEditingCharacter({ ...editingCharacter, universe: e.target.value })
                      }
                      className="border border-gray-300 rounded px-2 py-1"
                    />
                  ) : (
                    char.universe
                  )}
                </td>

                <td className="py-2 px-4 border-b flex justify-center">
                  {editingId === char.id ? (
                    <button
                      onClick={() => saveEdit(char.id)}
                      className="text-white bg-green-400 border border-green-500 rounded px-2 py-1 w-[5vw] mr-2"
                    >
                      Sauvegarder
                    </button>
                  ) : (
                    <button
                      onClick={() => startEditing(char)}
                      className="text-white bg-blue-400 border border-blue-500 rounded px-2 py-1 w-[5vw] mr-2"
                    >
                      Edit
                    </button>
                  )}

                  <button
                    onClick={() => deleteCharacter(char.id)}
                    className="text-white bg-red-400 border border-red-500 rounded px-2 py-1 w-[5vw]"
                  >
                    Suppr
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Bouton Add */}
        <div className="flex justify-center mt-4">
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
          >
            Add
          </button>
        </div>

        {/* Formulaire d'ajout */}
        {showForm && (
          <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
            <input
              type="text"
              placeholder="Surnom"
              value={newCharacter.name}
              onChange={(e) => setNewCharacter({ ...newCharacter, name: e.target.value })}
              className="border p-2 rounded mr-2"
            />
            <input
              type="text"
              placeholder="Nom réel"
              value={newCharacter.realName}
              onChange={(e) => setNewCharacter({ ...newCharacter, realName: e.target.value })}
              className="border p-2 rounded mr-2"
            />
            <input
              type="text"
              placeholder="Univers"
              value={newCharacter.universe}
              onChange={(e) => setNewCharacter({ ...newCharacter, universe: e.target.value })}
              className="border p-2 rounded mr-2"
            />
            <button
              onClick={addCharacter}
              className="bg-green-500 hover:bg-green-600 text-white py-1 px-4 rounded"
            >
              Ajouter
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-400 hover:bg-gray-500 text-white py-1 px-4 rounded ml-2"
            >
              Annuler
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
