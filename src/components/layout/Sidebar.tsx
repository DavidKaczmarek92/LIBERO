import { useTranslation } from "react-i18next";
import { 
  LayoutDashboard, 
  UserPen, 
  Trophy, 
  GitFork, 
  TableProperties, 
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState } from "react";

export type NavItemId = "dashboard" | "picks" | "matches" | "bracket" | "standings" | "settings";

interface SidebarProps {
  activeId: NavItemId;
  onNavigate: (id: NavItemId) => void;
}

export default function Sidebar({ activeId, onNavigate }: SidebarProps) {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: "dashboard", label: t("nav.dashboard"), icon: LayoutDashboard },
    { id: "picks", label: t("nav.picks"), icon: UserPen },
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

      <nav className="flex-1 px-3 space-y-1">
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
