// src/features/standings/StandingsView.tsx
import React, { useState, useEffect } from 'react';
import { Standing, Team } from '../../types';
import { getStandings } from '../../db/standings';
import { getTournamentResult, saveTournamentResult } from '../../db/picks';
import { getTeams } from '../../db/matches';
import { useThemeContext } from '../../hooks/ThemeContext';
import { TeamSelect } from '../../components/TeamSelect';
import { teamFlag } from '../../utils/flags';

export const StandingsView: React.FC = () => {
  const { isLight } = useThemeContext();
  const [standings, setStandings] = useState<Standing[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [championTeamId, setChampionTeamId] = useState<number | null>(null);
  const [topScorerName, setTopScorerName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [initialChampionTeamId, setInitialChampionTeamId] = useState<number | null>(null);
  const [initialTopScorerName, setInitialTopScorerName] = useState('');

  const loadAll = async () => {
    const [s, t, r] = await Promise.all([getStandings(), getTeams(), getTournamentResult()]);
    setStandings(s);
    setTeams(t);
    if (r) {
      setChampionTeamId(r.championTeamId);
      setTopScorerName(r.topScorerName);
      setInitialChampionTeamId(r.championTeamId);
      setInitialTopScorerName(r.topScorerName);
    } else {
      setInitialChampionTeamId(null);
      setInitialTopScorerName('');
    }
  };

  useEffect(() => { loadAll(); }, []);

  const hasChanged = championTeamId !== initialChampionTeamId || topScorerName !== initialTopScorerName;

  const handleSaveResult = async () => {
    setSaving(true);
    await saveTournamentResult(championTeamId, topScorerName);
    setInitialChampionTeamId(championTeamId);
    setInitialTopScorerName(topScorerName);
    const s = await getStandings();
    setStandings(s);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Panel wyników turnieju */}
      <div className={`rounded-xl border p-5 shadow ${isLight ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-l-2 border-indigo-500 pl-3 mb-4">Wyniki turnieju</h3>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-1 min-w-[220px] max-w-[280px]">
            <label className="text-xs font-semibold text-gray-400">Mistrz turnieju</label>
            <TeamSelect
              value={championTeamId}
              onChange={setChampionTeamId}
              teams={teams}
              placeholder="— nie ustawiono —"
              disabled={saving || saved}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-400">Król strzelców</label>
            <input
              type="text"
              value={topScorerName}
              onChange={e => setTopScorerName(e.target.value)}
              placeholder="Imię i nazwisko..."
              disabled={saving || saved}
              className={`border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed ${isLight ? 'bg-gray-100 border-gray-300 text-gray-900' : 'bg-gray-700 border-gray-600 text-white'}`}
            />
          </div>
          <button
            onClick={handleSaveResult}
            disabled={!hasChanged || saving || saved}
            className={`text-white text-sm rounded-lg px-5 py-2.5 font-semibold transition-colors min-w-[110px] text-center ${
              saved ? 'bg-green-600' : !hasChanged || saving ? 'bg-gray-600 opacity-50 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'
            }`}
          >
            {saving ? '⏳ Zapis...' : saved ? '✅ Zapisano' : 'Zapisz wyniki'}
          </button>
        </div>
      </div>

      {/* Tabela */}
    <div className={`rounded-xl overflow-hidden border shadow-xl ${isLight ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
      <table className="w-full text-left border-collapse">
        <thead className={`border-b ${isLight ? 'bg-gray-50 border-gray-200' : 'bg-gray-900 border-gray-700'}`}>
          <tr>
            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">#</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Gracz</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Punkty</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Mistrz</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Król strzelców</th>
          </tr>
        </thead>
        <tbody className={`divide-y ${isLight ? 'divide-gray-100' : 'divide-gray-700'}`}>
          {standings.map((s, i) => (
            <tr key={s.player.id} className={`transition-colors ${
              i === 0
                ? isLight ? 'bg-indigo-50 hover:bg-indigo-100/60' : 'bg-indigo-900/20 hover:bg-indigo-900/30'
                : isLight ? 'hover:bg-gray-50' : 'hover:bg-gray-700/50'
            }`}>
              <td className="px-4 py-4 font-bold text-gray-400 text-center">
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
              </td>
              <td className={`px-6 py-4 font-semibold ${isLight ? 'text-gray-900' : 'text-white'}`}>{s.player.name}</td>
              <td className="px-6 py-4 text-right">
                <span className="bg-indigo-500/20 text-indigo-500 px-3 py-1 rounded-full font-bold text-sm">
                  {s.totalPoints} pkt
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                {s.championPickName
                  ? <span className={`inline-flex items-center gap-1 text-sm font-medium ${s.championCorrect ? 'text-green-400' : isLight ? 'text-gray-700' : 'text-gray-300'}`}>
                      {s.championCorrect && '✅ '}{teamFlag(s.championPickName)} {s.championPickName}
                    </span>
                  : <span className="text-gray-400 text-sm">—</span>
                }
              </td>
              <td className="px-6 py-4 text-center">
                {s.topScorerPickName
                  ? <span className={`inline-flex items-center gap-1 text-sm font-medium ${s.topScorerCorrect ? 'text-green-400' : isLight ? 'text-gray-700' : 'text-gray-300'}`}>
                      {s.topScorerCorrect && '✅ '}{s.topScorerPickName}
                    </span>
                  : <span className="text-gray-400 text-sm">—</span>
                }
              </td>
            </tr>
          ))}
          {standings.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">
                Brak zarejestrowanych graczy.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </div>
  );
};
