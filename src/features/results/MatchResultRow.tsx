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
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 flex flex-wrap items-center gap-4">
      <div className="flex-1 flex items-center justify-between min-w-[300px]">
        <span className="w-1/3 text-right font-medium text-slate-200 flex items-center justify-end gap-1.5">
          <span>{homeTeam?.name ?? 'TBD'}</span>
          <span className="text-lg">{teamFlag(homeTeam?.name)}</span>
        </span>
        <div className="flex items-center gap-2 px-4">
          <input
            type="number"
            min="0"
            value={homeGoals}
            onChange={(e) => setHomeGoals(e.target.value === '' ? '' : parseInt(e.target.value))}
            className="bg-slate-700 border border-slate-600 rounded px-2 py-1 w-12 text-center text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <span className="text-slate-500">:</span>
          <input
            type="number"
            min="0"
            value={awayGoals}
            onChange={(e) => setAwayGoals(e.target.value === '' ? '' : parseInt(e.target.value))}
            className="bg-slate-700 border border-slate-600 rounded px-2 py-1 w-12 text-center text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <span className="w-1/3 text-left font-medium text-slate-200 flex items-center gap-1.5">
          <span className="text-lg">{teamFlag(awayTeam?.name)}</span>
          <span>{awayTeam?.name ?? 'TBD'}</span>
        </span>
      </div>

      {isKnockout && isDraw && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 uppercase font-bold">Zwycięzca:</span>
          <select
            value={etWinner ?? ''}
            onChange={(e) => setEtWinner(parseInt(e.target.value) || null)}
            className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-xs text-white focus:outline-none"
          >
            <option value="">Wybierz...</option>
            {homeTeam && <option value={homeTeam.id}>{homeTeam.name}</option>}
            {awayTeam && <option value={awayTeam.id}>{awayTeam.name}</option>}
          </select>
        </div>
      )}

      <button
        onClick={handleSave}
        className="ml-auto bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded px-3 py-1.5 transition-colors uppercase font-bold tracking-wider"
      >
        Zapisz wynik
      </button>
    </div>
  );
};
