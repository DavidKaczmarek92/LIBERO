// src/features/standings/StandingsView.tsx
import React, { useState, useEffect } from 'react';
import { Standing } from '../../types';
import { getStandings } from '../../db/standings';

export const StandingsView: React.FC = () => {
  const [standings, setStandings] = useState<Standing[]>([]);

  useEffect(() => {
    const load = async () => {
      setStandings(await getStandings());
    };
    load();
  }, []);

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-xl">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-900/50 border-b border-slate-700">
          <tr>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Miejsce</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Gracz</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Punkty</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Mistrz</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Król strzelców</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/50">
          {standings.map((s) => (
            <tr key={s.player.id} className="hover:bg-slate-700/30 transition-colors">
              <td className="px-6 py-4 font-bold text-slate-400">#{s.rank}</td>
              <td className="px-6 py-4 font-medium text-white">{s.player.name}</td>
              <td className="px-6 py-4 text-right">
                <span className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full font-bold">
                  {s.totalPoints}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                {s.championCorrect ? <span className="text-green-500">✓</span> : <span className="text-slate-600">—</span>}
              </td>
              <td className="px-6 py-4 text-center">
                {s.topScorerCorrect ? <span className="text-green-500">✓</span> : <span className="text-slate-600">—</span>}
              </td>
            </tr>
          ))}
          {standings.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-10 text-center text-slate-500 italic">
                Brak zarejestrowanych graczy.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
