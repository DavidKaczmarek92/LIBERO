// src/features/picks/PicksView.tsx
import React, { useState, useEffect } from 'react';
import { Player, Match, Pick, Team, Phase } from '../../types';
import { getPlayers } from '../../db/players';
import { getMatches, getTeams } from '../../db/matches';
import { getPicks, savePick } from '../../db/picks';
import { MatchPickRow } from './MatchPickRow';
import { TournamentPickForm } from './TournamentPickForm';
import { useThemeContext } from '../../hooks/ThemeContext';

export const PicksView: React.FC = () => {
  const { isLight } = useThemeContext();
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const toggleSection = (key: string) => {
    setCollapsed(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };
  const [matches, setMatches] = useState<Match[]>([]);
  const [picks, setPicks] = useState<Pick[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    const init = async () => {
      setPlayers(await getPlayers());
      setMatches(await getMatches());
      setTeams(await getTeams());
    };
    init();
  }, []);

  useEffect(() => {
    if (selectedPlayerId) {
      const loadPicks = async () => {
        setPicks(await getPicks(selectedPlayerId));
      };
      loadPicks();
    } else {
      setPicks([]);
    }
  }, [selectedPlayerId]);

  const handleSavePick = async (matchId: number, homeGoals: number, awayGoals: number, etWinner: number | null) => {
    if (!selectedPlayerId) return;
    await savePick(selectedPlayerId, matchId, homeGoals, awayGoals, etWinner);
    // Reload picks to show updated points if result was already entered
    setPicks(await getPicks(selectedPlayerId));
  };

  const phases: { label: string, phase: Phase, group?: string }[] = [];
  
  // Group stage
  const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  groups.forEach(g => phases.push({ label: `Grupa ${g}`, phase: 'group', group: g }));
  
  // Knockouts
  phases.push({ label: 'Runda 32', phase: 'r32' });
  phases.push({ label: 'Runda 16', phase: 'r16' });
  phases.push({ label: 'Ćwierćfinały', phase: 'qf' });
  phases.push({ label: 'Półfinały', phase: 'sf' });
  phases.push({ label: 'Finał', phase: 'final' });

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Wybierz gracza</p>
        <div className="flex flex-wrap gap-2">
          {players.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPlayerId(p.id === selectedPlayerId ? null : p.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                selectedPlayerId === p.id
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg'
                  : isLight
                    ? 'bg-white border-gray-300 text-gray-700 hover:border-indigo-500 hover:text-indigo-600'
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-indigo-500 hover:text-white'
              }`}
            >
              {p.name}
            </button>
          ))}
          {players.length === 0 && (
            <p className="text-gray-500 text-sm">Brak graczy — dodaj ich w zakładce Gracze.</p>
          )}
        </div>
      </div>

      {selectedPlayerId && (
        <>
          <TournamentPickForm playerId={selectedPlayerId} teams={teams} />

          {phases.map((p) => {
            const phaseMatches = matches.filter(m => m.phase === p.phase && (!p.group || m.groupLabel === p.group));
            if (phaseMatches.length === 0) return null;
            const key = `${p.phase}-${p.group ?? ''}`;
            const isCollapsed = collapsed.has(key);

            return (
              <div key={key} className="space-y-2">
                <button
                  onClick={() => toggleSection(key)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${isLight ? 'hover:bg-gray-100' : 'hover:bg-gray-800'}`}
                >
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-l-2 border-indigo-500 pl-3">{p.label}</h3>
                  <span className={`text-gray-400 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`}>▼</span>
                </button>
                {!isCollapsed && (
                  <div className="grid grid-cols-1 gap-2">
                    {phaseMatches.map(m => (
                      <MatchPickRow
                        key={m.id}
                        match={m}
                        pick={picks.find(pk => pk.matchId === m.id)}
                        teams={teams}
                        onSave={(h, a, et) => handleSavePick(m.id, h, a, et)}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}

      {!selectedPlayerId && (
        <div className="text-center py-20 text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <p className="text-lg">Wybierz gracza, aby zarządzać jego typami</p>
        </div>
      )}
    </div>
  );
};
