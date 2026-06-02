// src/features/picks/TournamentPickForm.tsx
import React, { useState, useEffect } from 'react';
import { Team } from '../../types';
import { getTournamentPick, saveTournamentPick } from '../../db/picks';
import { useThemeContext } from '../../hooks/ThemeContext';

interface Props {
  playerId: number;
  teams: Team[];
}

export const TournamentPickForm: React.FC<Props> = ({ playerId, teams }) => {
  const { isLight } = useThemeContext();
  const [championTeamId, setChampionTeamId] = useState<number | null>(null);
  const [topScorer, setTopScorer] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [initialChampion, setInitialChampion] = useState<number | null>(null);
  const [initialScorer, setInitialScorer] = useState('');

  useEffect(() => {
    const load = async () => {
      const data = await getTournamentPick(playerId);
      if (data) {
        setChampionTeamId(data.championTeamId);
        setTopScorer(data.topScorerName);
        setInitialChampion(data.championTeamId);
        setInitialScorer(data.topScorerName);
      } else {
        setChampionTeamId(null);
        setTopScorer('');
        setInitialChampion(null);
        setInitialScorer('');
      }
    };
    load();
  }, [playerId]);

  const hasChanged = championTeamId !== initialChampion || topScorer !== initialScorer;

  const handleSave = async () => {
    setSaving(true);
    await saveTournamentPick(playerId, championTeamId, topScorer);
    setInitialChampion(championTeamId);
    setInitialScorer(topScorer);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className={`rounded-xl p-6 border space-y-4 ${isLight ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
      <h3 className={`text-base font-bold uppercase tracking-widest ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>🏆 Typy turniejowe</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-400">Typowany mistrz</label>
          <select
            value={championTeamId ?? ''}
            onChange={(e) => setChampionTeamId(parseInt(e.target.value) || null)}
            className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isLight ? 'bg-gray-100 border-gray-300 text-gray-900' : 'bg-gray-700 border-gray-600 text-white'}`}
          >
            <option value="">Wybierz drużynę...</option>
            {teams.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-400">Typowany król strzelców</label>
          <input
            type="text"
            value={topScorer}
            onChange={(e) => setTopScorer(e.target.value)}
            placeholder="Imię i nazwisko zawodnika..."
            className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500 ${isLight ? 'bg-gray-100 border-gray-300 text-gray-900' : 'bg-gray-700 border-gray-600 text-white'}`}
          />
        </div>
      </div>
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          disabled={!hasChanged || saving}
          className={`text-white rounded-lg px-6 py-2.5 font-semibold transition-colors min-w-[180px] text-center ${
            saved ? 'bg-green-600'
            : !hasChanged || saving ? 'bg-gray-600 opacity-50 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-500'
          }`}
        >
          {saving ? '⏳ Zapis...' : saved ? '✅ Zapisano' : 'Zapisz typy turniejowe'}
        </button>
      </div>
    </div>
  );
};
