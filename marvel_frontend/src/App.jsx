 import React, { useState, useEffect } from 'react';

function App() {
  const [characters, setCharacters] = useState([]); // Liste des personnages
  const [editingId, setEditingId] = useState(null); // ID du personnage en édition
  const [newName, setNewName] = useState('');       // Nom temporaire pendant l'édition

  // Récupérer les personnages depuis le backend
  useEffect(() => {
    fetch('http://localhost:3001/api/characters')
      .then(res => res.json())
      .then(data => setCharacters(data.characters))
      .catch(err => console.error('Erreur:', err));
  }, []);

  // Supprimer un personnage
  const deleteCharacter = (id) => {
    fetch(`http://localhost:3001/api/characters/${id}`, { method: 'DELETE' })
      .then(() => {
        setCharacters(characters.filter(char => char.id !== id));
      })
      .catch(err => console.error('Erreur suppression:', err));
  };

  // Commencer l'édition
  const startEditing = (char) => {
    setEditingId(char.id); // mettre l'ID de la ligne en édition
    setNewName(char.name); // pré-remplir l'input avec le nom actuel
  };

  const saveEdit = (id) => {
  if (newName.trim() === '') return alert("Le nom ne peut pas être vide !");
  
  fetch(`http://localhost:3001/api/characters/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: newName })
  })
    .then(res => res.json())
    .then(updatedChar => {
      setCharacters(characters.map(char => char.id === id ? updatedChar : char));
      setEditingId(null); // <-- bouton redevient Edit ici
    })
    .catch(err => console.error('Erreur mise à jour:', err));
};
 

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 flex text-center items-center">Tableau des personnages</h1>
          <div className="searchbutton">
              <input type="search" name="recherche" id=""
                  className='bg-red-500 w-[20vw] h-[2vh] m-2 p-5'/>
              <button type="submit"
              
              className='bg-blue-400 w-[10vw] h-[4vh] rounded-4xl '>Rechercher</button>
          </div>
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

                {/* Champ Nom éditable */}
                <td className="py-2 px-4 border-b">
                  {editingId === char.id ? (
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder={char.name}
                      className="border border-gray-300 rounded px-2 py-1"
                    />
                  ) : (
                    char.name
                  )}
                </td>

                <td className="py-2 px-4 border-b">{char.realName}</td>
                <td className="py-2 px-4 border-b">{char.universe}</td>

                {/* Boutons Actions */}
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
                  
                    onClick={() => alert("Voulez-vous suppr ?") ? startEditing(char) : deleteCharacter(char.id)  }
                    className="text-white bg-red-400 border border-red-500 rounded px-2 py-1 w-[5vw]"
                  >
                    Suppr
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
