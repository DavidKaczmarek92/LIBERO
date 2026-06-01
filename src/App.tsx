import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./App.css";
import TournamentCreator from "./features/tournament/TournamentCreator";
import PlayerList from "./features/players/PlayerList";
import PlayerPicksSection from "./features/picks/PlayerPicksSection";
import MatchList from "./features/matches/MatchList";
import StandingsTable from "./features/standings/StandingsTable";
import BracketView from "./features/bracket/BracketView";
import { useTournamentStore } from "./store/tournamentStore";
import AppShell from "./components/layout/AppShell";
import { NavItemId } from "./components/layout/Sidebar";

function App() {
  const { t } = useTranslation();
  const [activeNavId, setActiveNavId] = useState<NavItemId>("dashboard");
  const { players, tournamentPicks } = useTournamentStore();

  return (
    <AppShell activeNavId={activeNavId} onNavigate={setActiveNavId}>
      {activeNavId === "dashboard" && (
        <div className="flex flex-col gap-8">
          <header className="mb-2">
            <h1 className="font-disp text-3xl font-extrabold tracking-tight text-text">
              {t("nav.dashboard")}
            </h1>
          </header>
          <TournamentCreator />
          <PlayerList />
        </div>
      )}

      {activeNavId === "picks" && (
        <div className="flex flex-col gap-8">
          <header className="mb-2">
            <h1 className="font-disp text-3xl font-extrabold tracking-tight text-text">
              {t("nav.picks")}
            </h1>
          </header>
          <PlayerPicksSection />
        </div>
      )}

      {activeNavId === "matches" && <MatchList />}
      {activeNavId === "bracket" && <BracketView />}
      {activeNavId === "standings" && <StandingsTable />}
      
      {activeNavId === "settings" && (
        <div className="bg-surface border border-border rounded-2xl p-8 shadow-sm text-center">
          <h2 className="font-disp text-xl font-bold mb-4">{t("nav.settings")}</h2>
          <p className="text-text-muted">Ustawienia zostaną dodane wkrótce.</p>
        </div>
      )}
    </AppShell>
  );
}

export default App;
