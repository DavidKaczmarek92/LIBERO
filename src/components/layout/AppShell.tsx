import { ReactNode } from "react";
import Sidebar, { NavItemId } from "./Sidebar";

interface AppShellProps {
  children: ReactNode;
  activeNavId: NavItemId;
  onNavigate: (id: NavItemId) => void;
}

export default function AppShell({ children, activeNavId, onNavigate }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar activeId={activeNavId} onNavigate={onNavigate} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8">
          <div className="max-w-[1200px] mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
