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
    <div className="panel">
      <div className="panel-head">
        <h3>{t("picks.tournament")}</h3>
      </div>
      <div className="picks-cols">
        <div className="colh">{t("picks.champion")}</div>
        <div className="colh">{t("picks.topScorer")}</div>
        <div></div>
      </div>
      <div className="pick-row">
        <div className="who">—</div>
        <div className="pick-field">
          <div className="lbl">{t("picks.champion")}</div>
          <select
            value={currentPick.champion}
            onChange={(e) => handleChange("champion", e.target.value)}
            className="w-full bg-transparent text-[15px] font-semibold focus:outline-none"
          >
            <option value="">—</option>
            {teams.map((team) => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
        </div>
        <div className="pick-field">
          <div className="lbl">{t("picks.topScorer")}</div>
          <input
            type="text"
            value={currentPick.topScorer}
            onChange={(e) => handleChange("topScorer", e.target.value)}
            className="w-full bg-transparent text-[15px] font-semibold focus:outline-none"
            placeholder="Nazwisko"
          />
        </div>
      </div>
    </div>
  );
}
