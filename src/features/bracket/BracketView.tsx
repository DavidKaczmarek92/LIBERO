import { useTranslation } from "react-i18next";
import { useTournamentStore } from "../../store/tournamentStore";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";

export default function BracketView() {
  const { t } = useTranslation();
  const { tournament } = useTournamentStore();

  if (!tournament) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-8 shadow-sm text-center">
        <p className="text-text-muted font-medium">Utwórz turniej, aby zobaczyć drabinkę.</p>
      </div>
    );
  }

  const nodes = tournament.phases.flatMap((phase, pi) =>
    phase.matches.map((m, mi) => ({
      id: `${phase.id}-${mi}`,
      data: { label: `${m.homeTeam} ${m.result ? m.result.homeGoals + ":" + m.result.awayGoals : "vs"} ${m.awayTeam}` },
      position: { x: 60 + mi * 240, y: 50 + pi * 110 },
    }))
  );

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm" data-testid="bracket-view">
      <div className="mb-6 px-2 flex items-center justify-between">
        <div>
          <h3 className="font-disp text-xl font-bold">{t("bracket.title")}</h3>
          <p className="text-xs text-text-faint mt-1 italic">Wizualizacja faz pucharowych i wyników.</p>
        </div>
      </div>
      
      <div className="h-[400px] border border-border rounded-xl overflow-hidden bg-surface-2 relative shadow-inner">
        <ReactFlow nodes={nodes} edges={[]} fitView>
          <Background color="var(--border)" gap={20} />
          <Controls />
        </ReactFlow>
        <div className="absolute bottom-3 right-3 z-10 bg-white/80 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-text-faint border border-border shadow-sm">
          Interaktywna drabinka
        </div>
      </div>
    </div>
  );
}
