import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Match, MatchPick } from "../../types";

interface MatchPickFormProps {
  match: Match;
  pick?: MatchPick;
  onSubmit: (pick: Omit<MatchPick, 'id' | 'playerId' | 'matchId' | 'points'>) => void;
}

export default function MatchPickForm({ match, pick, onSubmit }: MatchPickFormProps) {
  const { t } = useTranslation();
  const [homeGoals, setHomeGoals] = useState(pick?.homeGoals ?? 0);
  const [awayGoals, setAwayGoals] = useState(pick?.awayGoals ?? 0);
  const [knockoutWinner, setKnockoutWinner] = useState(pick?.knockoutWinner ?? "");

  const handleSave = () => {
    onSubmit({
      homeGoals,
      awayGoals,
      knockoutWinner: knockoutWinner || undefined,
    });
  };

  return (
    <div className="pick-field">
      <div className="lbl">{match.homeTeam} vs {match.awayTeam}</div>
      <div className="flex items-center gap-2 mt-1">
        <input type="number" value={homeGoals} onChange={(e) => setHomeGoals(+e.target.value)} className="w-12 text-center border border-border rounded px-1" />
        <span>:</span>
        <input type="number" value={awayGoals} onChange={(e) => setAwayGoals(+e.target.value)} className="w-12 text-center border border-border rounded px-1" />
        <select value={knockoutWinner} onChange={(e) => setKnockoutWinner(e.target.value)} className="text-xs border border-border rounded px-1">
          <option value="">—</option>
          <option value={match.homeTeam}>{match.homeTeam}</option>
          <option value={match.awayTeam}>{match.awayTeam}</option>
        </select>
        <button onClick={handleSave} className="btn btn-primary text-xs px-3 py-0.5 ml-auto">{t("common.save")}</button>
      </div>
    </div>
  );
}
