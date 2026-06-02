// src/features/picks/MatchPickRow.tsx
import React from 'react';
import { Match, Pick, Team } from '../../types';
import { teamFlag } from '../../utils/flags';
import { useThemeContext } from '../../hooks/ThemeContext';

interface Props {
  match: Match;
  pick: Pick | undefined;
  teams: Team[];
  onSave: (homeGoals: number, awayGoals: number, extraTimeWinnerId: number | null) => void;
}

export const MatchPickRow: React.FC<Props> = ({ match, pick, teams, onSave }) => {
  const { isLight } = useThemeContext();
  const homeTeam = teams.find(t => t.id === match.homeTeamId);
  const awayTeam = teams.find(t => t.id === match.awayTeamId);

  const [homeGoals, setHomeGoals] = React.useState<number | ''>(pick?.homeGoals ?? '');
  const [awayGoals, setAwayGoals] = React.useState<number | ''>(pick?.awayGoals ?? '');
  const [etWinner, setEtWinner] = React.useState<number | null>(pick?.extraTimeWinnerId ?? null);

  React.useEffect(() => {
    setHomeGoals(pick?.homeGoals ?? '');
    setAwayGoals(pick?.awayGoals ?? '');
    setEtWinner(pick?.extraTimeWinnerId ?? null);
  }, [pick?.homeGoals, pick?.awayGoals, pick?.extraTimeWinnerId]);

  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const isKnockout = match.phase !== 'group';
  const isDraw = homeGoals !== '' && awayGoals !== '' && homeGoals === awayGoals;

  const hasChanged =
    homeGoals !== (pick?.homeGoals ?? '') ||
    awayGoals !== (pick?.awayGoals ?? '') ||
    etWinner !== (pick?.extraTimeWinnerId ?? null);

  const handleSave = async () => {
    if (homeGoals === '' || awayGoals === '') return;
    setSaving(true);
    await onSave(homeGoals, awayGoals, isKnockout && isDraw ? etWinner : null);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className={`border rounded-xl p-4 flex flex-wrap items-center gap-3 shadow-sm ${isLight ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
      {/* Home Team Section */}
      <div className={`flex-1 min-w-[150px] flex items-center justify-end gap-2 font-semibold ${isLight ? 'text-gray-900' : 'text-white'}`}>
        <span className="text-sm">{homeTeam?.name ?? 'TBD'}</span>
        <span className="text-xl leading-none">{teamFlag(homeTeam?.name)}</span>
      </div>

      {/* Score Section */}
      <div className="flex items-center gap-2 px-4 justify-center">
        <input
          type="number"
          min="0"
          value={homeGoals}
          onChange={(e) => setHomeGoals(e.target.value === '' ? '' : parseInt(e.target.value))}
          className={`border rounded-lg px-2 py-1.5 w-12 text-center font-bold text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isLight ? 'bg-gray-100 border-gray-300 text-gray-900' : 'bg-gray-700 border-gray-600 text-white'}`}
        />
        <span className="text-gray-400 font-bold">:</span>
        <input
          type="number"
          min="0"
          value={awayGoals}
          onChange={(e) => setAwayGoals(e.target.value === '' ? '' : parseInt(e.target.value))}
          className={`border rounded-lg px-2 py-1.5 w-12 text-center font-bold text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isLight ? 'bg-gray-100 border-gray-300 text-gray-900' : 'bg-gray-700 border-gray-600 text-white'}`}
        />
      </div>

      {/* Away Team & Actions Section */}
      <div className="flex-1 min-w-[380px] flex items-center justify-between">
        <div className={`flex items-center gap-2 font-semibold ${isLight ? 'text-gray-900' : 'text-white'}`}>
          <span className="text-xl leading-none">{teamFlag(awayTeam?.name)}</span>
          <span className="text-sm">{awayTeam?.name ?? 'TBD'}</span>
        </div>

        <div className="flex items-center justify-end gap-3 ml-auto">
          {isKnockout && isDraw && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-semibold">Zwycięzca:</span>
              <select
                value={etWinner ?? ''}
                onChange={(e) => setEtWinner(parseInt(e.target.value) || null)}
                className={`border rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isLight ? 'bg-gray-100 border-gray-300 text-gray-900' : 'bg-gray-700 border-gray-600 text-white'}`}
              >
                <option value="">Wybierz...</option>
                {homeTeam && <option value={homeTeam.id}>{homeTeam.name}</option>}
                {awayTeam && <option value={awayTeam.id}>{awayTeam.name}</option>}
              </select>
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className={`w-16 text-center px-2.5 py-1 rounded-full text-xs font-bold ${
              pick && match.homeGoals !== null
                ? pick.points === 3 ? 'bg-yellow-400/20 text-yellow-300'
                : pick.points >= 1 ? 'bg-green-400/20 text-green-300'
                : 'bg-gray-600 text-gray-400'
                : 'invisible'
            }`}>
              {pick && match.homeGoals !== null ? `${pick.points} pkt` : '0 pkt'}
            </span>
            <button
              onClick={handleSave}
              disabled={!hasChanged || saving || homeGoals === '' || awayGoals === ''}
              className={`text-white text-xs rounded-lg px-4 py-1.5 font-semibold transition-colors min-w-[80px] text-center ${
                saved ? 'bg-green-600'
                : !hasChanged || saving || homeGoals === '' || awayGoals === '' ? 'bg-gray-600 cursor-not-allowed opacity-50'
                : 'bg-indigo-600 hover:bg-indigo-500'
              }`}
            >
              {saving ? '⏳ Zapis...' : saved ? '✅ Zapisano' : 'Zapisz'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
