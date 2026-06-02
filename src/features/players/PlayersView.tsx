// src/features/players/PlayersView.tsx
import React, { useState, useEffect } from 'react';
import { Player } from '../../types';
import { getPlayers, addPlayer, deletePlayer } from '../../db/players';
import { useThemeContext } from '../../hooks/ThemeContext';

export const PlayersView: React.FC = () => {
  const { isLight } = useThemeContext();
  const [players, setPlayers] = useState<Player[]>([]);
  const [newName, setNewName] = useState('');

  const loadPlayers = async () => {
    const data = await getPlayers();
    setPlayers(data);
  };

  useEffect(() => {
    loadPlayers();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      await addPlayer(newName.trim());
      setNewName('');
      loadPlayers();
    } catch (err) {
      alert('Błąd podczas dodawania gracza: ' + err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Czy na pewno chcesz usunąć tego gracza? Wszystkie jego typy zostaną usunięte.')) {
      await deletePlayer(id);
      loadPlayers();
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Imię i nazwisko gracza..."
          className={`border rounded-lg px-4 py-2.5 flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500 ${isLight ? 'bg-gray-100 border-gray-300 text-gray-900' : 'bg-gray-700 border-gray-600 text-white'}`}
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-6 py-2.5 font-semibold transition-colors"
        >
          Dodaj gracza
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {players.map((player) => (
          <div key={player.id} className={`rounded-xl p-4 shadow-md flex justify-between items-center border transition-colors ${isLight ? 'bg-white border-gray-200 hover:border-gray-300' : 'bg-gray-800 border-gray-700 hover:border-gray-600'}`}>
            <span className={`text-base font-semibold ${isLight ? 'text-gray-900' : 'text-white'}`}>{player.name}</span>
            <button
              onClick={() => handleDelete(player.id)}
              className="text-gray-500 hover:text-red-400 p-2 transition-colors rounded-lg hover:bg-red-400/10"
              title="Usuń gracza"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
        {players.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500 italic">
            Brak graczy. Dodaj pierwszego gracza powyżej.
          </div>
        )}
      </div>
    </div>
  );
};
