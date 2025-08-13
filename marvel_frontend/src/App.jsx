import React, { useState, useEffect } from 'react';

function App() {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/characters')
      .then(res => res.json())
      .then(data => setCharacters(data.characters))
      .catch(err => console.error('Erreur:', err));
  }, []);

  // Supprimer un personnage
  const deleteCharacter = (id) => {
    setCharacters(characters.filter(char => char.id !== id));
  };

  // Editer un personnage (exemple simple : prompt pour changer le nom)
  const editCharacter = (id) => {
    const newName = prompt("Nouveau nom :");
    if (newName) {
      setCharacters(characters.map(char => 
        char.id === id ? { ...char, name: newName } : char
      ));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Tableau des personnages</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Nom</th>
              <th className="py-2 px-4 border-b">Noms</th>
              <th className="py-2 px-4 border-b">Univers</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {characters.map(char => (
              <tr key={char.id} className="text-center hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{char.id}</td>
                <td className="py-2 px-4 border-b">{char.name}</td>
                <td className="py-2 px-4 border-b">{char.realName}</td>
                <td className="py-2 px-4 border-b">{char.universe}</td>
                <td className="py-2 px-4 border-b">
                  <button 
                    onClick={() => editCharacter(char.id)}
                    className="text-blue-500 hover:underline mr-2"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => deleteCharacter(char.id)}
                    className="text-red-500 hover:underline"
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
