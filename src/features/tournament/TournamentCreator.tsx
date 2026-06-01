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
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-disp text-lg font-bold">{tournament.name}</h3>
          <span className="bg-green-soft text-green-fg text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Utworzony
          </span>
        </div>
        <div className="text-sm text-text-muted">
          Fazy: {tournament.phases.length} • Grupy gotowe do typowania.
        </div>
      </div>
    );
  }

  const handleSelectTemplate = (tpl: TournamentTemplate) => {
    if (selectedTemplate?.id === tpl.id) {
      setSelectedTemplate(null);
      setShowForm(false);
    } else {
      setSelectedTemplate(tpl);
      setShowForm(true);
    }
  };

  const handleCreate = (name: string, templateId: string) => {
    // minimal valid tournament data (groups + phases) for demo
    const demoPhases: any[] = [
      {
        id: "group-a",
        name: "Grupa A",
        label: "Faza grupowa",
        isKnockout: false,
        allowDraw: true,
        order: 1,
        matches: [
          { id: `m1`, phaseId: "group-a", homeTeam: "PL", awayTeam: "DE", result: undefined },
          { id: `m2`, phaseId: "group-a", homeTeam: "FR", awayTeam: "ES", result: undefined },
        ],
      },
      {
        id: "final",
        name: "Finał",
        label: "Finał",
        isKnockout: true,
        allowDraw: false,
        order: 2,
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
    <div className="space-y-6">
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
        <div className="mb-6">
          <h3 className="font-disp text-xl font-bold mb-1">{t("tournament.title")}</h3>
          <p className="text-sm text-text-faint">Wybierz jeden z gotowych formatów lub stwórz własny.</p>
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
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="font-disp text-lg font-bold">{t("tournament.groups")} + {t("tournament.knockout")}</h3>
            <p className="text-xs text-text-faint mt-1 italic">
              Podgląd struktury dla szablonu: <span className="font-semibold">{selectedTemplate.name}</span>
            </p>
          </div>
          
          <div className="h-[300px] border border-border rounded-xl overflow-hidden bg-surface-2 relative">
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
            <div className="absolute bottom-3 right-3 z-10 bg-white/80 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-text-faint border border-border shadow-sm">
              React Flow canvas
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
