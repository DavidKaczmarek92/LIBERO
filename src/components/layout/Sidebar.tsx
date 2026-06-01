import { useTranslation } from "react-i18next";
import { 
  LayoutDashboard, 
  User, 
  Trophy, 
  GitFork, 
  TableProperties, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus
} from "lucide-react";
import { useState } from "react";
import { useTournamentStore } from "../../store/tournamentStore";

export type NavItemId = "dashboard" | "picks" | "matches" | "bracket" | "standings" | "settings" | "create-tournament";

interface SidebarProps {
  activeId: NavItemId;
  onNavigate: (id: NavItemId) => void;
}

export default function Sidebar({ activeId, onNavigate }: SidebarProps) {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { tournaments, activeTournamentId, setActiveTournament } = useTournamentStore();

  const navItems = [
    { id: "dashboard", label: t("nav.dashboard"), icon: LayoutDashboard },
    { id: "picks", label: t("nav.picks"), icon: User },
    { id: "matches", label: t("nav.matches"), icon: Trophy },
    { id: "bracket", label: t("nav.bracket"), icon: GitFork },
    { id: "standings", label: t("nav.standings"), icon: TableProperties },
    { id: "settings", label: t("nav.settings"), icon: Settings },
  ] as const;

  return (
    <aside 
      className={`bg-surface border-r border-border transition-all duration-300 flex flex-col h-screen sticky top-0 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue rounded-lg flex items-center justify-center text-white font-bold">L</div>
            <span className="font-disp font-bold text-xl tracking-tight">LIBERO</span>
          </div>
        )}
        {isCollapsed && (
           <div className="w-8 h-8 bg-blue rounded-lg flex items-center justify-center text-white font-bold mx-auto">L</div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <nav className="px-3 space-y-1 mb-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all group ${
                activeId === item.id
                  ? "bg-blue text-white shadow-md shadow-blue/20"
                  : "text-text-muted hover:bg-surface-2 hover:text-text"
              }`}
            >
              <item.icon size={20} className={activeId === item.id ? "text-white" : "text-text-faint group-hover:text-text"} />
              {!isCollapsed && <span className="font-bold text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="px-3 space-y-2">
          {!isCollapsed && (
            <div className="px-3 mb-2 flex items-center justify-between">
              <h3 className="text-[10px] font-extrabold text-text-faint uppercase tracking-widest">Turnieje</h3>
              <button 
                onClick={() => onNavigate("create-tournament")}
                className="p-1 hover:bg-surface-2 rounded-md text-text-faint hover:text-blue transition-colors"
                title="Dodaj turniej"
              >
                <Plus size={14} />
              </button>
            </div>
          )}
          
          <div className="space-y-1">
            {tournaments.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTournament(t.id);
                  if (activeId === "create-tournament") onNavigate("dashboard");
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all group ${
                  activeTournamentId === t.id
                    ? "bg-surface-2 border border-blue/20"
                    : "hover:bg-surface-2"
                }`}
              >
                <div className={`w-2 h-2 rounded-full shrink-0 ${activeTournamentId === t.id ? "bg-blue" : "bg-border group-hover:bg-text-faint"}`} />
                {!isCollapsed && (
                  <span className={`text-xs font-bold truncate ${activeTournamentId === t.id ? "text-text" : "text-text-muted"}`}>
                    {t.name}
                  </span>
                )}
              </button>
            ))}
            
            {tournaments.length === 0 && !isCollapsed && (
              <div className="px-3 py-4 text-center border border-dashed border-border rounded-xl">
                <p className="text-[10px] text-text-faint font-medium">Brak turniejów</p>
                <button 
                  onClick={() => onNavigate("create-tournament")}
                  className="mt-2 text-[10px] font-bold text-blue hover:underline"
                >
                  Utwórz pierwszy
                </button>
              </div>
            )}

            {isCollapsed && (
              <button 
                onClick={() => onNavigate("create-tournament")}
                className="w-full flex justify-center py-2 text-text-faint hover:text-blue"
              >
                <Plus size={20} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-surface-2 text-text-faint hover:text-text transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
    </aside>
  );
}
