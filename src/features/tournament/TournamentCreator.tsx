import { useState } from "react";
import { useTranslation } from "react-i18next";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";
import { useTournamentStore } from "../../store/tournamentStore";
import { TournamentTemplate } from "../../types";
import TemplateSelector from "./TemplateSelector";
import TournamentForm from "./TournamentForm";

export default function TournamentCreator() {
  const { t } = useTranslation();
  const { tournament, createTournament } = useTournamentStore();
  const [selectedTemplate, setSelectedTemplate] = useState<TournamentTemplate | null>(null);
  const [showForm, setShowForm] = useState(false);

  if (tournament) {
    return (
      <div className="panel">
        <div className="panel-head">
          <h3>{tournament.name}</h3>
          <span className="badge badge-green">Utworzony</span>
        </div>
        <div className="text-sm text-text-muted">Fazy: {tournament.phases.length} • Grupy gotowe do typowania.</div>
      </div>
    );
  }

  const handleSelectTemplate = (tpl: TournamentTemplate) => {
    setSelectedTemplate(tpl);
    setShowForm(true);
  };

  const handleCreate = (name: string, templateId: string) => {
    // minimal valid tournament data (groups + phases) for demo
    const demoPhases: any[] = [
      {
        id: "group-a",
        name: "Grupa A",
        type: "group",
        matches: [
          { id: `m1`, phaseId: "group-a", homeTeam: "PL", awayTeam: "DE", result: undefined },
          { id: `m2`, phaseId: "group-a", homeTeam: "FR", awayTeam: "ES", result: undefined },
        ],
      },
      {
        id: "final",
        name: "Finał",
        type: "final",
        matches: [{ id: `mf`, phaseId: "final", homeTeam: "PL", awayTeam: "FR", result: undefined }],
      },
    ];
    createTournament({
      name,
      templateId,
      countries: ["PL", "DE", "FR", "ES"],
      groups: { A: ["PL", "DE", "FR", "ES"] },
      phases: demoPhases,
    });
    setShowForm(false);
    setSelectedTemplate(null);
  };

  return (
    <div>
      <div className="panel">
        <div className="panel-head">
          <h3>{t("tournament.title")}</h3>
        </div>
        <TemplateSelector
          selectedId={selectedTemplate?.id || ""}
          onSelect={handleSelectTemplate}
        />
      </div>

      {showForm && selectedTemplate && (
        <TournamentForm
          template={selectedTemplate}
          onCreate={handleCreate}
          onCancel={() => { setShowForm(false); setSelectedTemplate(null); }}
        />
      )}

      {selectedTemplate && !showForm && (
        <div className="panel mt-4">
          <div className="panel-head">
            <h3>{t("tournament.groups")} + {t("tournament.knockout")}</h3>
          </div>
          <div style={{ height: 280 }} className="border border-border rounded-[var(--radius)] overflow-hidden bg-surface-2">
            <ReactFlow
              nodes={[
                { id: "n1", data: { label: "Grupa A: PL vs DE" }, position: { x: 50, y: 40 } },
                { id: "n2", data: { label: "Finał placeholder" }, position: { x: 300, y: 40 } },
              ]}
              edges={[]}
              fitView
            >
              <Background />
              <Controls />
              <MiniMap />
            </ReactFlow>
          </div>
          <div className="text-xs text-center mt-2 text-text-faint">React Flow canvas — edycja grup i faz (uproszczona)</div>
        </div>
      )}
    </div>
  );
}
