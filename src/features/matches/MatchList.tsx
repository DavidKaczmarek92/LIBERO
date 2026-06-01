import { useTranslation } from "react-i18next";
import { useActiveTournament } from "../../store/tournamentStore";
import MatchResultForm from "./MatchResultForm";

export default function MatchList() {
  const { t } = useTranslation();
  const tournament = useActiveTournament();

  if (!tournament) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-8 shadow-sm text-center">
        <p className="text-text-muted font-medium">{t("matches.empty") || "Utwórz turniej w zakładce Gracze i typowania"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="px-2">
        <h2 className="font-disp text-2xl font-bold">{t("matches.title")}</h2>
      </header>

      <div className="space-y-10">
        {tournament.phases.map((phase) => (
          <section key={phase.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-3 mb-4 px-2">
              <h3 className="text-sm font-extrabold text-blue uppercase tracking-widest">{phase.name}</h3>
              <div className="h-px flex-1 bg-border"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {phase.matches.map((match) => (
                <MatchResultForm key={match.id} match={match} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
