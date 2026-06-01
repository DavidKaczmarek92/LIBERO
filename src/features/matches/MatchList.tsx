import { useTranslation } from "react-i18next";
import { useTournamentStore } from "../../store/tournamentStore";
import MatchResultForm from "./MatchResultForm";

export default function MatchList() {
  const { t } = useTranslation();
  const { tournament } = useTournamentStore();

  if (!tournament) {
    return <div className="panel text-muted">Utwórz turniej w zakładce Gracze i typowania</div>;
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <h3>{t("matches.title")}</h3>
      </div>
      <div className="space-y-4">
        {tournament.phases.map((phase) => (
          <div key={phase.id}>
            <div className="font-semibold text-sm mb-2 text-text-faint">{phase.name}</div>
            <div className="grid gap-3">
              {phase.matches.map((match) => (
                <MatchResultForm key={match.id} match={match} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
