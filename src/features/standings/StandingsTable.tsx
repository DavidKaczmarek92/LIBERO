import { useTranslation } from "react-i18next";
import { useTournamentStore } from "../../store/tournamentStore";

export default function StandingsTable() {
  const { t } = useTranslation();
  const { players, matchPicks } = useTournamentStore();

  const standings = players
    .map((p) => {
      const picks = matchPicks[p.id] || [];
      const mpPoints = picks.reduce((sum, pk) => sum + (pk.points || 0), 0);
      // tournament picks not scored in v1
      const total = mpPoints;
      return { player: p, points: total };
    })
    .sort((a, b) => b.points - a.points);

  return (
    <div className="panel" data-testid="standings-table">
      <div className="panel-head">
        <h3>{t("standings.title")}</h3>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-text-faint">
            <th className="py-2">{t("standings.rank")}</th>
            <th>{t("standings.player")}</th>
            <th className="text-right">{t("standings.points")}</th>
          </tr>
        </thead>
        <tbody>
          {standings.length === 0 && <tr><td colSpan={3} className="py-4 text-center text-muted">{t("players.empty")}</td></tr>}
          {standings.map((s, idx) => (
            <tr key={s.player.id} className="border-b border-border last:border-0" data-testid={`standing-row-${s.player.id}`}>
              <td className="py-2 font-mono">{idx + 1}</td>
              <td>{s.player.name} {idx > 0 && standings[idx - 1].points === s.points ? <span className="text-xs text-muted">({t("standings.exAequo")})</span> : null}</td>
              <td className="text-right font-semibold">{s.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
