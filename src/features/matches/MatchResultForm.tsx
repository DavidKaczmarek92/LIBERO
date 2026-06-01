import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Match, MatchResult } from "../../types";
import { useTournamentStore } from "../../store/tournamentStore";
import { shouldClearDownstream } from "../../utils/winnerPropagation";

interface MatchResultFormProps {
  match: Match;
  onClose?: () => void;
}

export default function MatchResultForm({ match, onClose }: MatchResultFormProps) {
  const { t } = useTranslation();
  const { updateMatchResult, tournament } = useTournamentStore();
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
    updateMatchResult(match.id, result, match.phaseId.includes("group") ? "group" : "knockout");
    onClose?.();
  };

  return (
    <div className="pick-field" data-testid={`match-result-${match.id}`}>
      <div className="lbl">{match.homeTeam} vs {match.awayTeam}</div>
      <div className="flex gap-2 mt-2">
        <input type="number" data-testid="home-goals" value={result.homeGoals} onChange={e => setResult({ ...result, homeGoals: +e.target.value })} className="w-14 border border-border rounded px-2 py-1" />
        <span className="self-center">:</span>
        <input type="number" data-testid="away-goals" value={result.awayGoals} onChange={e => setResult({ ...result, awayGoals: +e.target.value })} className="w-14 border border-border rounded px-2 py-1" />
      </div>
      <div className="flex gap-2 mt-2 text-xs">
        <label className="flex items-center gap-1"><input type="checkbox" checked={showET} onChange={e => setShowET(e.target.checked)} /> {t("matches.extraTime")}</label>
        <label className="flex items-center gap-1"><input type="checkbox" checked={showPen} onChange={e => setShowPen(e.target.checked)} /> {t("matches.penalties")}</label>
      </div>
      {showET && (
        <div className="flex gap-2 mt-1 text-xs">
          <input type="number" value={result.extraTime?.homeGoals ?? 0} onChange={e => setResult({ ...result, extraTime: { homeGoals: +e.target.value, awayGoals: result.extraTime?.awayGoals ?? 0 } })} className="w-10 border rounded" /> :
          <input type="number" value={result.extraTime?.awayGoals ?? 0} onChange={e => setResult({ ...result, extraTime: { homeGoals: result.extraTime?.homeGoals ?? 0, awayGoals: +e.target.value } })} className="w-10 border rounded" />
        </div>
      )}
      {showPen && (
        <select data-testid="penalties-winner" value={result.penalties?.winner || ""} onChange={e => setResult({ ...result, penalties: { winner: e.target.value } })} className="mt-1 text-xs border rounded px-1">
          <option value="">—</option>
          <option value={match.homeTeam}>{match.homeTeam}</option>
          <option value={match.awayTeam}>{match.awayTeam}</option>
        </select>
      )}
      <button onClick={handleSave} data-testid="save-result" className="btn btn-primary text-xs mt-2 w-full">{t("common.save")}</button>
    </div>
  );
}
