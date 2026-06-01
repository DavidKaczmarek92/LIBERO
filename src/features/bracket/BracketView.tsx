import { useTranslation } from "react-i18next";
import { useTournamentStore } from "../../store/tournamentStore";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";

export default function BracketView() {
  const { t } = useTranslation();
  const { tournament } = useTournamentStore();

  if (!tournament) {
    return <div className="panel text-muted">Brak turnieju</div>;
  }

  const nodes = tournament.phases.flatMap((phase, pi) =>
    phase.matches.map((m, mi) => ({
      id: `${phase.id}-${mi}`,
      data: { label: `${m.homeTeam} ${m.result ? m.result.homeGoals + ":" + m.result.awayGoals : "vs"} ${m.awayTeam}` },
      position: { x: 60 + mi * 240, y: 50 + pi * 110 },
    }))
  );

  return (
    <div className="panel" data-testid="bracket-view">
      <div className="panel-head">
        <h3>{t("bracket.title")}</h3>
      </div>
      <div style={{ height: 320 }} className="border border-border rounded overflow-hidden">
        <ReactFlow nodes={nodes} edges={[]} fitView>
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
