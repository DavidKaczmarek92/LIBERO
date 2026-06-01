// src/features/results/MatchResultRow.tsx
import React from 'react';
import { Match, Team } from '../../types';
import { teamFlag } from '../../utils/flags';

interface Props {
  match: Match;
  teams: Team[];
  onSave: (homeGoals: number | null, awayGoals: number | null, extraTimeWinnerId: number | null) => void;
}

export const MatchResultRow: React.FC<Props> = ({ match, teams, onSave }) => {
  const homeTeam = teams.find(t => t.id === match.homeTeamId);
  const awayTeam = teams.find(t => t.id === match.awayTeamId);

  const [homeGoals, setHomeGoals] = React.useState<number | ''>(match.homeGoals ?? '');
  const [awayGoals, setAwayGoals] = React.useState<number | ''>(match.awayGoals ?? '');
  const [etWinner, setEtWinner] = React.useState<number | null>(match.extraTimeWinnerId ?? null);

  const isKnockout = match.phase !== 'group';
  const isDraw = homeGoals !== '' && awayGoals !== '' && homeGoals === awayGoals;

  const handleSave = () => {
    onSave(
      homeGoals === '' ? null : homeGoals,
      awayGoals === '' ? null : awayGoals,
      isKnockout && isDraw ? etWinner : null
    );
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex flex-wrap items-center gap-3 shadow-sm">
      <div className="flex-1 flex items-center justify-between min-w-[280px]">
        <span className="w-2/5 text-right font-semibold text-white flex items-center justify-end gap-2">
          <span className="text-sm">{homeTeam?.name ?? 'TBD'}</span>
          <span className="text-xl leading-none">{teamFlag(homeTeam?.name)}</span>
        </span>
        <div className="flex items-center gap-2 px-3">
          <input
            type="number"
            min="0"
            value={homeGoals}
            onChange={(e) => setHomeGoals(e.target.value === '' ? '' : parseInt(e.target.value))}
            className="bg-gray-700 border border-gray-600 rounded-lg px-2 py-1.5 w-12 text-center text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <span className="text-gray-400 font-bold">:</span>
          <input
            type="number"
            min="0"
            value={awayGoals}
            onChange={(e) => setAwayGoals(e.target.value === '' ? '' : parseInt(e.target.value))}
            className="bg-gray-700 border border-gray-600 rounded-lg px-2 py-1.5 w-12 text-center text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <span className="w-2/5 text-left font-semibold text-white flex items-center gap-2">
          <span className="text-xl leading-none">{teamFlag(awayTeam?.name)}</span>
          <span className="text-sm">{awayTeam?.name ?? 'TBD'}</span>
        </span>
      </div>

      {isKnockout && isDraw && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-semibold">Zwycięzca:</span>
          <select
            value={etWinner ?? ''}
            onChange={(e) => setEtWinner(parseInt(e.target.value) || null)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Wybierz...</option>
            {homeTeam && <option value={homeTeam.id}>{homeTeam.name}</option>}
            {awayTeam && <option value={awayTeam.id}>{awayTeam.name}</option>}
          </select>
        </div>
      )}

      <button
        onClick={handleSave}
        className="ml-auto bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-lg px-4 py-1.5 font-semibold transition-colors"
      >
        Zapisz wynik
      </button>
    </div>
  );
};
