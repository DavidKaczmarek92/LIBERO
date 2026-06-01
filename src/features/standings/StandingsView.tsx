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
    <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-xl">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-900 border-b border-gray-700">
          <tr>
            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">#</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Gracz</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Punkty</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Mistrz</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Król strzelców</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {standings.map((s, i) => (
            <tr key={s.player.id} className={`transition-colors hover:bg-gray-700/50 ${i === 0 ? 'bg-indigo-900/20' : ''}`}>
              <td className="px-6 py-4 font-bold text-gray-400">
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${s.rank}`}
              </td>
              <td className="px-6 py-4 font-semibold text-white">{s.player.name}</td>
              <td className="px-6 py-4 text-right">
                <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full font-bold text-sm">
                  {s.totalPoints} pkt
                </span>
              </td>
              <td className="px-6 py-4 text-center text-lg">
                {s.championCorrect ? '✅' : <span className="text-gray-600">—</span>}
              </td>
              <td className="px-6 py-4 text-center text-lg">
                {s.topScorerCorrect ? '✅' : <span className="text-gray-600">—</span>}
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
  );
};
