import { useState } from "react";
import { Match, MatchPick, TournamentPhase } from "../../types";
import { useTournamentStore } from "../../store/tournamentStore";

interface MatchPickRowProps {
  playerId: string;
  match: Match;
  phase: TournamentPhase;
  existingPick?: MatchPick;
}

export default function MatchPickRow({ playerId, match, phase, existingPick }: MatchPickRowProps) {
  const submitMatchPick = useTournamentStore((state) => state.submitMatchPick);
  
  const [homeGoals, setHomeGoals] = useState(existingPick?.homeGoals ?? 0);
  const [awayGoals, setAwayGoals] = useState(existingPick?.awayGoals ?? 0);
  const [knockoutWinner, setKnockoutWinner] = useState(existingPick?.knockoutWinner);

  const isDraw = homeGoals === awayGoals;
  const showKnockoutWinner = phase.isKnockout && isDraw;

  const handleSave = () => {
    submitMatchPick(playerId, match.id, {
      homeGoals,
      awayGoals,
      knockoutWinner: showKnockoutWinner ? knockoutWinner : undefined,
    });
  };

  return (
    <div className="flex items-center gap-4 py-2 px-3 hover:bg-surface-2 rounded-lg transition-colors border border-transparent hover:border-border">
      <div className="flex-1 flex items-center gap-2 overflow-hidden">
        <span className="text-[10px] font-bold text-text-faint w-6 shrink-0">{match.id}</span>
        <div className="flex items-center gap-2 flex-1 min-w-0">
           <span className="font-semibold text-sm truncate">{match.homeTeam}</span>
           <span className="text-text-faint text-[10px] shrink-0">vs</span>
           <span className="font-semibold text-sm truncate">{match.awayTeam}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <input
          type="number"
          min="0"
          value={homeGoals}
          onChange={(e) => setHomeGoals(parseInt(e.target.value) || 0)}
          onBlur={handleSave}
          className="w-10 h-8 text-center bg-surface border border-border rounded-md font-bold text-sm focus:border-blue focus:ring-1 focus:ring-blue outline-none transition-all"
        />
        <span className="text-text-faint font-bold">:</span>
        <input
          type="number"
          min="0"
          value={awayGoals}
          onChange={(e) => setAwayGoals(parseInt(e.target.value) || 0)}
          onBlur={handleSave}
          className="w-10 h-8 text-center bg-surface border border-border rounded-md font-bold text-sm focus:border-blue focus:ring-1 focus:ring-blue outline-none transition-all"
        />
      </div>

      <div className="w-24 shrink-0 flex justify-center">
        {phase.isKnockout ? (
          isDraw ? (
            <select
              value={knockoutWinner || ""}
              onChange={(e) => {
                const winner = e.target.value;
                setKnockoutWinner(winner);
                submitMatchPick(playerId, match.id, {
                  homeGoals,
                  awayGoals,
                  knockoutWinner: winner,
                });
              }}
              className="w-full text-[10px] uppercase font-bold bg-surface-2 border border-border rounded px-1 py-1 outline-none focus:border-blue"
            >
              <option value="">Winner?</option>
              <option value={match.homeTeam}>{match.homeTeam}</option>
              <option value={match.awayTeam}>{match.awayTeam}</option>
            </select>
          ) : (
            <div className="text-[10px] text-text-faint font-bold uppercase truncate px-1">
              Winner: {homeGoals > awayGoals ? match.homeTeam : match.awayTeam}
            </div>
          )
        ) : null}
      </div>
      
      <div className="w-8 text-right shrink-0">
        {existingPick?.points !== undefined && (
          <span className={`text-xs font-bold ${existingPick.points > 0 ? "text-green-fg" : "text-text-faint"}`}>
            {existingPick.points}
          </span>
        )}
      </div>
    </div>
  );
}
