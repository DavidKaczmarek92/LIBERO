import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Match, MatchResult } from "../../types";
import { useTournamentStore, useActiveTournament } from "../../store/tournamentStore";
import { shouldClearDownstream } from "../../utils/winnerPropagation";

interface MatchResultFormProps {
  match: Match;
  onClose?: () => void;
}

export default function MatchResultForm({ match, onClose }: MatchResultFormProps) {
  const { t } = useTranslation();
  const { updateMatchResult } = useTournamentStore();
  const tournament = useActiveTournament();
  const [result, setResult] = useState<MatchResult>(
    match.result || { homeGoals: 0, awayGoals: 0 }
  );
  const [showET, setShowET] = useState(!!match.result?.extraTime);
  const [showPen, setShowPen] = useState(!!match.result?.penalties);

  const handleSave = () => {
    if (tournament && shouldClearDownstream(match.id, tournament)) {
      if (!confirm("Wynik zmieni przeciwników w dalszych fazach. Wyczyścić wyniki downstream?")) {
        return;
      }
    }
    updateMatchResult(match.id, result);
    onClose?.();
  };

  return (
    <div
      className="bg-surface border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group"
      data-testid={`match-result-${match.id}`}
    >
      <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse"></span>
          <div className="text-xs font-bold text-text truncate max-w-[150px]">
            {match.homeTeam} <span className="text-text-faint px-1">vs</span> {match.awayTeam}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="flex flex-col items-center gap-1">
          <input
            type="number"
            data-testid="home-goals"
            value={result.homeGoals}
            onChange={(e) => setResult({ ...result, homeGoals: +e.target.value })}
            className="w-12 h-12 text-center text-xl font-bold bg-inset border border-border rounded-lg focus:ring-2 focus:ring-blue/20 focus:border-blue outline-none transition-all"
          />
          <span className="text-[10px] font-bold text-text-faint uppercase">{match.homeTeam}</span>
        </div>
        <span className="text-xl font-bold text-border">:</span>
        <div className="flex flex-col items-center gap-1">
          <input
            type="number"
            data-testid="away-goals"
            value={result.awayGoals}
            onChange={(e) => setResult({ ...result, awayGoals: +e.target.value })}
            className="w-12 h-12 text-center text-xl font-bold bg-inset border border-border rounded-lg focus:ring-2 focus:ring-blue/20 focus:border-blue outline-none transition-all"
          />
          <span className="text-[10px] font-bold text-text-faint uppercase">{match.awayTeam}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
        <label className="flex items-center gap-2 cursor-pointer group/check">
          <input
            type="checkbox"
            checked={showET}
            onChange={(e) => setShowET(e.target.checked)}
            className="w-4 h-4 rounded border-border text-blue focus:ring-blue/20"
          />
          <span className="text-[11px] font-bold text-text-muted group-hover/check:text-text transition-colors">
            {t("matches.extraTime")}
          </span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer group/check">
          <input
            type="checkbox"
            checked={showPen}
            onChange={(e) => setShowPen(e.target.checked)}
            className="w-4 h-4 rounded border-border text-blue focus:ring-blue/20"
          />
          <span className="text-[11px] font-bold text-text-muted group-hover/check:text-text transition-colors">
            {t("matches.penalties")}
          </span>
        </label>
      </div>

      {(showET || showPen) && (
        <div className="bg-inset border border-border rounded-lg p-3 mb-4 space-y-3 animate-in zoom-in-95 duration-200">
          {showET && (
            <div className="flex items-center justify-center gap-3">
              <span className="text-[10px] font-extrabold text-blue uppercase tracking-tighter">Dogrywka</span>
              <input
                type="number"
                value={result.extraTime?.homeGoals ?? 0}
                onChange={(e) =>
                  setResult({
                    ...result,
                    extraTime: { homeGoals: +e.target.value, awayGoals: result.extraTime?.awayGoals ?? 0 },
                  })
                }
                className="w-9 h-7 text-center text-sm font-bold bg-surface border border-border rounded focus:border-blue outline-none"
              />
              <span className="text-border">:</span>
              <input
                type="number"
                value={result.extraTime?.awayGoals ?? 0}
                onChange={(e) =>
                  setResult({
                    ...result,
                    extraTime: { homeGoals: result.extraTime?.homeGoals ?? 0, awayGoals: +e.target.value },
                  })
                }
                className="w-9 h-7 text-center text-sm font-bold bg-surface border border-border rounded focus:border-blue outline-none"
              />
            </div>
          )}
          {showPen && (
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-extrabold text-amber-fg uppercase tracking-tighter text-center">
                Zwycięzca rzutów karnych
              </span>
              <select
                data-testid="penalties-winner"
                value={result.penalties?.winner || ""}
                onChange={(e) => setResult({ ...result, penalties: { winner: e.target.value } })}
                className="w-full bg-surface border border-border rounded-lg px-2 py-1.5 text-xs font-bold focus:border-blue outline-none appearance-none text-center"
              >
                <option value="">— Wybierz —</option>
                <option value={match.homeTeam}>{match.homeTeam}</option>
                <option value={match.awayTeam}>{match.awayTeam}</option>
              </select>
            </div>
          )}
        </div>
      )}

      <button
        onClick={handleSave}
        data-testid="save-result"
        className="w-full py-2.5 bg-blue text-white font-bold text-xs rounded-xl hover:bg-blue-fg transition-all active:scale-95 shadow-lg shadow-blue/10"
      >
        {t("common.save")}
      </button>
    </div>
  );
}
