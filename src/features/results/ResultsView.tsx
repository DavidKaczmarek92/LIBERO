// src/features/results/ResultsView.tsx
import React, { useState, useEffect } from 'react';
import { Match, Team, Phase } from '../../types';
import { getMatches, getTeams, updateMatchResult } from '../../db/matches';
import { MatchResultRow } from './MatchResultRow';
import { useThemeContext } from '../../hooks/ThemeContext';

export const ResultsView: React.FC = () => {
  const { isLight } = useThemeContext();
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const toggleSection = (key: string) => {
    setCollapsed(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const loadData = async () => {
    setMatches(await getMatches());
    setTeams(await getTeams());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveResult = async (matchId: number, homeGoals: number | null, awayGoals: number | null, etWinner: number | null) => {
    await updateMatchResult(matchId, homeGoals, awayGoals, etWinner);
    loadData();
  };

  const phases: { label: string, phase: Phase, group?: string }[] = [];
  const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  groups.forEach(g => phases.push({ label: `Grupa ${g}`, phase: 'group', group: g }));
  phases.push({ label: 'Runda 32', phase: 'r32' });
  phases.push({ label: 'Runda 16', phase: 'r16' });
  phases.push({ label: 'Ćwierćfinały', phase: 'qf' });
  phases.push({ label: 'Półfinały', phase: 'sf' });
  phases.push({ label: 'Finał', phase: 'final' });

  return (
    <div className="space-y-8 pb-20">

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
                  <MatchResultRow
                    key={m.id}
                    match={m}
                    teams={teams}
                    onSave={(h, a, et) => handleSaveResult(m.id, h, a, et)}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
