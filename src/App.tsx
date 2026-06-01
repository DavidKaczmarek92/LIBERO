import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./App.css";
import TournamentCreator from "./features/tournament/TournamentCreator";
import PlayerList from "./features/players/PlayerList";
import TournamentPickForm from "./features/picks/TournamentPickForm";
import { useTournamentStore } from "./store/tournamentStore";

type Tab = "playersPicks" | "matches" | "bracket" | "standings";

function App() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>("playersPicks");
  const { players, tournamentPicks } = useTournamentStore();

  const tabs: { id: Tab; label: string }[] = [
    { id: "playersPicks", label: t("tabs.playersPicks") },
    { id: "matches", label: t("tabs.matches") },
    { id: "bracket", label: t("tabs.bracket") },
    { id: "standings", label: t("tabs.standings") },
  ];

  return (
    <div className="min-h-screen bg-canvas text-text">
      <div className="win" style={{ maxWidth: "1200px", margin: "40px auto" }}>
        <div className="win-bar">
          <div className="lights"><i></i><i></i><i></i></div>
          <div className="win-title">LIBERO</div>
        </div>
        <div className="win-body p-6">
          <div className="app-head mb-6">
            <div className="ttl"><h2>{t("app.title")}</h2></div>
            <div className="tag">{t("app.tag")}</div>
          </div>

          <div className="flex gap-2 mb-4 border-b border-border pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "playersPicks" && (
            <div className="space-y-6">
              <TournamentCreator />
              <PlayerList />
              {players.length > 0 && (
                <div>
                  <div className="panel-head mb-3"><h3>{t("picks.title")}</h3></div>
                  {players.map((player) => (
                    <TournamentPickForm
                      key={player.id}
                      playerId={player.id}
                      pick={tournamentPicks[player.id]}
                      onSubmit={() => {}}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === "matches" && <p className="text-muted">Mecze — Step 4</p>}
          {activeTab === "bracket" && <p className="text-muted">Drabinka — Step 4</p>}
          {activeTab === "standings" && <p className="text-muted">Tabela — Step 4</p>}
        </div>
      </div>
    </div>
  );
}

export default App;
