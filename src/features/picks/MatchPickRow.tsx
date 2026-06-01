// src/features/picks/MatchPickRow.tsx
import React from 'react';
import { Match, Pick, Team } from '../../types';
import { teamFlag } from '../../utils/flags';

interface Props {
  match: Match;
  pick: Pick | undefined;
  teams: Team[];
  onSave: (homeGoals: number, awayGoals: number, extraTimeWinnerId: number | null) => void;
}

export const MatchPickRow: React.FC<Props> = ({ match, pick, teams, onSave }) => {
  const homeTeam = teams.find(t => t.id === match.homeTeamId);
  const awayTeam = teams.find(t => t.id === match.awayTeamId);

  const [homeGoals, setHomeGoals] = React.useState(pick?.homeGoals ?? 0);
  const [awayGoals, setAwayGoals] = React.useState(pick?.awayGoals ?? 0);
  const [etWinner, setEtWinner] = React.useState<number | null>(pick?.extraTimeWinnerId ?? null);

  const isKnockout = match.phase !== 'group';
  const isDraw = homeGoals === awayGoals;

  const handleSave = () => {
    onSave(homeGoals, awayGoals, isKnockout && isDraw ? etWinner : null);
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
            onChange={(e) => setHomeGoals(parseInt(e.target.value) || 0)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-2 py-1.5 w-12 text-center text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <span className="text-gray-400 font-bold">:</span>
          <input
            type="number"
            min="0"
            value={awayGoals}
            onChange={(e) => setAwayGoals(parseInt(e.target.value) || 0)}
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

      <div className="ml-auto flex items-center gap-2">
        {pick && match.homeGoals !== null && (
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
            pick.points === 3 ? 'bg-yellow-400/20 text-yellow-300' :
            pick.points >= 1 ? 'bg-green-400/20 text-green-300' :
            'bg-gray-600 text-gray-400'
          }`}>
            {pick.points} pkt
          </span>
        )}
        <button
          onClick={handleSave}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-lg px-4 py-1.5 font-semibold transition-colors"
        >
          Zapisz
        </button>
      </div>
    </div>
  );
};
