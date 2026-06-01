import { useTranslation } from "react-i18next";
import { useTournamentStore } from "../../store/tournamentStore";
import { TournamentPick } from "../../types";

interface TournamentPickFormProps {
  playerId: string;
  pick?: TournamentPick;
  onSubmit: (pick: Omit<TournamentPick, 'playerId'>) => void;
}

export default function TournamentPickForm({ playerId, pick, onSubmit }: TournamentPickFormProps) {
  const { t } = useTranslation();
  const { tournament, submitTournamentPick } = useTournamentStore();

  const teams = tournament
    ? Array.from(
        new Set(
          tournament.phases.flatMap((p) =>
            p.matches.flatMap((m) => [m.homeTeam, m.awayTeam])
          )
        )
      ).sort()
    : [];

  const currentPick: TournamentPick = pick || {
    playerId,
    champion: "",
    topScorer: "",
  };

  const handleChange = (field: "champion" | "topScorer", value: string) => {
    const newPick = { ...currentPick, [field]: value };
    onSubmit({ champion: newPick.champion, topScorer: newPick.topScorer });
    // also persist immediately
    submitTournamentPick(playerId, { champion: newPick.champion, topScorer: newPick.topScorer });
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
        <h3 className="text-sm font-bold text-text-muted flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue"></span>
          {t("picks.tournament")}
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-inset border border-border rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue/20 focus-within:border-blue transition-all">
          <label className="block text-[10px] font-bold text-text-faint uppercase tracking-wider mb-1">
            {t("picks.champion")}
          </label>
          <select
            value={currentPick.champion}
            onChange={(e) => handleChange("champion", e.target.value)}
            className="w-full bg-transparent text-sm font-bold focus:outline-none appearance-none"
          >
            <option value="">— Wybierz —</option>
            {teams.map((team) => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
        </div>
        <div className="bg-inset border border-border rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue/20 focus-within:border-blue transition-all">
          <label className="block text-[10px] font-bold text-text-faint uppercase tracking-wider mb-1">
            {t("picks.topScorer")}
          </label>
          <input
            type="text"
            value={currentPick.topScorer}
            onChange={(e) => handleChange("topScorer", e.target.value)}
            className="w-full bg-transparent text-sm font-bold focus:outline-none"
            placeholder="Wpisz nazwisko"
          />
        </div>
      </div>
    </div>
  );
}
