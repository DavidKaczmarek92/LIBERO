// src/features/picks/TournamentPickForm.tsx
import React, { useState, useEffect } from 'react';
import { Team } from '../../types';
import { getTournamentPick, saveTournamentPick } from '../../db/picks';

interface Props {
  playerId: number;
  teams: Team[];
}

export const TournamentPickForm: React.FC<Props> = ({ playerId, teams }) => {
  const [championTeamId, setChampionTeamId] = useState<number | null>(null);
  const [topScorer, setTopScorer] = useState('');

  useEffect(() => {
    const load = async () => {
      const data = await getTournamentPick(playerId);
      if (data) {
        setChampionTeamId(data.championTeamId);
        setTopScorer(data.topScorerName);
      } else {
        setChampionTeamId(null);
        setTopScorer('');
      }
    };
    load();
  }, [playerId]);

  const handleSave = async () => {
    await saveTournamentPick(playerId, championTeamId, topScorer);
    alert('Typy turniejowe zapisane!');
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 space-y-4">
      <h3 className="text-lg font-bold text-white uppercase tracking-wider">Typy turniejowe</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-400">Typowany mistrz</label>
          <select
            value={championTeamId ?? ''}
            onChange={(e) => setChampionTeamId(parseInt(e.target.value) || null)}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Wybierz drużynę...</option>
            {teams.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-400">Typowany król strzelców</label>
          <input
            type="text"
            value={topScorer}
            onChange={(e) => setTopScorer(e.target.value)}
            placeholder="Imię i nazwisko zawodnika..."
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-6 py-2 font-medium transition-colors"
        >
          Zapisz typy turniejowe
        </button>
      </div>
    </div>
  );
};
