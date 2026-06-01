// src/features/bracket/BracketView.tsx
import React, { useState, useEffect } from 'react';
import { Match, Team } from '../../types';
import { getMatches, getTeams, updateMatchTeams } from '../../db/matches';
import { teamFlag } from '../../utils/flags';

// Oficjalny bracket MŚ 2026 - pary r32
const R32_SLOTS: { matchOrder: number; home: string; away: string }[] = [
  { matchOrder: 100, home: '1A', away: '2B' },
  { matchOrder: 101, home: '1C', away: '2D' },
  { matchOrder: 102, home: '1E', away: '2F' },
  { matchOrder: 103, home: '1G', away: '2H' },
  { matchOrder: 104, home: '1I', away: '2J' },
  { matchOrder: 105, home: '1K', away: '2L' },
  { matchOrder: 106, home: '1B', away: '2A' },
  { matchOrder: 107, home: '1D', away: '2C' },
  { matchOrder: 108, home: '1F', away: '2E' },
  { matchOrder: 109, home: '1H', away: '2G' },
  { matchOrder: 110, home: '1J', away: '2I' },
  { matchOrder: 111, home: '1L', away: '2K' },
  { matchOrder: 112, home: '3ABC', away: '3DEF' },
  { matchOrder: 113, home: '3GHI', away: '3JKL' },
  { matchOrder: 114, home: '3BCD', away: '3EFG' },
  { matchOrder: 115, home: '3HIJ', away: '3KLA' },
];


function teamName(id: number | null | undefined, teams: Team[]): string {
  if (!id) return 'TBD';
  return teams.find(t => t.id === id)?.name ?? 'TBD';
}


interface MatchCardProps {
  match: Match;
  teams: Team[];
  slotHome?: string;
  slotAway?: string;
  onUpdate: (matchId: number, homeId: number | null, awayId: number | null) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, teams, slotHome, slotAway, onUpdate }) => {
  const homeName = teamName(match.homeTeamId, teams);
  const awayName = teamName(match.awayTeamId, teams);
  const hasResult = match.homeGoals !== null && match.awayGoals !== null;

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-md">
      {/* Nagłówek slotu */}
      {(slotHome || slotAway) && (
        <div className="flex justify-between px-3 py-1 bg-gray-900/60 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          <span>{slotHome}</span>
          <span>vs</span>
          <span>{slotAway}</span>
        </div>
      )}

      {/* Drużyna 1 */}
      <div className={`flex items-center gap-2 px-3 py-2 border-b border-gray-700 ${hasResult && match.homeGoals! > match.awayGoals! ? 'bg-indigo-900/20' : ''}`}>
        <span className="text-lg w-7 text-center">{match.homeTeamId ? teamFlag(homeName) : '❓'}</span>
        <select
          value={match.homeTeamId ?? ''}
          onChange={e => {
            const val = e.target.value;
            onUpdate(match.id, val ? parseInt(val) : null, match.awayTeamId ?? null);
          }}
          className="flex-1 bg-transparent text-sm font-semibold text-white focus:outline-none cursor-pointer"
        >
          <option value="">TBD</option>
          {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        {hasResult && (
          <span className={`text-lg font-bold w-6 text-right ${match.homeGoals! > match.awayGoals! ? 'text-white' : 'text-gray-500'}`}>
            {match.homeGoals}
          </span>
        )}
      </div>

      {/* Drużyna 2 */}
      <div className={`flex items-center gap-2 px-3 py-2 ${hasResult && match.awayGoals! > match.homeGoals! ? 'bg-indigo-900/20' : ''}`}>  
        <span className="text-lg w-7 text-center">{match.awayTeamId ? teamFlag(awayName) : '❓'}</span>
        <select
          value={match.awayTeamId ?? ''}
          onChange={e => {
            const val = e.target.value;
            onUpdate(match.id, match.homeTeamId ?? null, val ? parseInt(val) : null);
          }}
          className="flex-1 bg-transparent text-sm font-semibold text-white focus:outline-none cursor-pointer"
        >
          <option value="">TBD</option>
          {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        {hasResult && (
          <span className={`text-lg font-bold w-6 text-right ${match.awayGoals! > match.homeGoals! ? 'text-white' : 'text-gray-500'}`}>
            {match.awayGoals}
          </span>
        )}
      </div>

      {/* Dogrywka */}
      {hasResult && match.extraTimeWinnerId && (
        <div className="px-3 py-1 bg-yellow-900/20 text-[10px] text-yellow-400 text-center font-semibold">
          Zwycięzca po dogrywce: {teamName(match.extraTimeWinnerId, teams)}
        </div>
      )}
    </div>
  );
};

export const BracketView: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  const loadData = async () => {
    setMatches(await getMatches());
    setTeams(await getTeams());
  };

  useEffect(() => { loadData(); }, []);

  const handleUpdateTeams = async (matchId: number, homeId: number | null, awayId: number | null) => {
    await updateMatchTeams(matchId, homeId, awayId);
    loadData();
  };


  const r32Matches = matches.filter(m => m.phase === 'r32');
  const r16Matches = matches.filter(m => m.phase === 'r16').sort((a, b) => a.matchOrder - b.matchOrder);
  const qfMatches = matches.filter(m => m.phase === 'qf').sort((a, b) => a.matchOrder - b.matchOrder);
  const sfMatches = matches.filter(m => m.phase === 'sf').sort((a, b) => a.matchOrder - b.matchOrder);
  const finalMatches = matches.filter(m => m.phase === 'final').sort((a, b) => a.matchOrder - b.matchOrder);

  const phases = [
    { label: 'Runda 32', matches: r32Matches, cols: 'grid-cols-2 md:grid-cols-4', isR32: true },
    { label: 'Runda 16', matches: r16Matches, cols: 'grid-cols-2 md:grid-cols-4', isR32: false },
    { label: 'Ćwierćfinały', matches: qfMatches, cols: 'grid-cols-2 md:grid-cols-4', isR32: false },
    { label: 'Półfinały', matches: sfMatches, cols: 'grid-cols-1 md:grid-cols-2', isR32: false },
    { label: 'Finał', matches: finalMatches, cols: 'grid-cols-1 md:grid-cols-2', isR32: false },
  ];

  return (
    <div className="space-y-10 pb-20">
      {phases.map(({ label, matches: phaseMatches, cols, isR32 }) => (
        <div key={label} className="space-y-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-l-2 border-indigo-500 pl-3 flex items-center gap-2">
            {label}
          </h3>
          <div className={`grid ${cols} gap-3`}>
            {phaseMatches.map(m => {
              const slot = isR32 ? R32_SLOTS.find(s => s.matchOrder === m.matchOrder) : undefined;
              return (
                <MatchCard
                  key={m.id}
                  match={m}
                  teams={teams}
                  slotHome={slot?.home}
                  slotAway={slot?.away}
                  onUpdate={handleUpdateTeams}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
