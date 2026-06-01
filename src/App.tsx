import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./App.css";
import TournamentCreator from "./features/tournament/TournamentCreator";
import PlayerList from "./features/players/PlayerList";
import TournamentPickForm from "./features/picks/TournamentPickForm";
import MatchList from "./features/matches/MatchList";
import StandingsTable from "./features/standings/StandingsTable";
import BracketView from "./features/bracket/BracketView";
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
    <div className="min-h-screen bg-canvas text-text p-4 md:p-8">
      <div className="max-w-[1200px] mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-start justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <h1 className="font-disp text-3xl font-extrabold tracking-tight text-text">{t("app.title")}</h1>
          </div>
          <div className="font-disp text-sm font-semibold text-text-faint sm:text-right uppercase tracking-wider">
            {t("app.tag")}
          </div>
        </header>

        <nav className="flex gap-1 mb-6 border-b border-border overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-3 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-blue border-blue bg-blue/5"
                  : "text-text-muted border-transparent hover:text-text hover:bg-surface-2"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <main>
          {activeTab === "playersPicks" && (
            <div className="flex flex-col gap-8">
              <TournamentCreator />
              <PlayerList />
              {players.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-center gap-2 px-2">
                    <h2 className="font-disp text-xl font-bold">{t("picks.title")}</h2>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {players.map((player) => (
                      <TournamentPickForm
                        key={player.id}
                        playerId={player.id}
                        pick={tournamentPicks[player.id]}
                        onSubmit={() => {}}
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
          {activeTab === "matches" && <MatchList />}
          {activeTab === "bracket" && <BracketView />}
          {activeTab === "standings" && <StandingsTable />}
        </main>
      </div>
    </div>
  );
}

export default App;
