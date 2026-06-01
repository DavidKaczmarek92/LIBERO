import { useState } from "react";
import { useTranslation } from "react-i18next";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";
import { useTournamentStore, useActiveTournament } from "../../store/tournamentStore";
import { TemplateDefinition, generatePhasesFromTemplate } from "../../data/templates";
import { COUNTRIES } from "../../data/countries";
import TemplateSelector from "./TemplateSelector";
import TournamentForm from "./TournamentForm";

interface TournamentCreatorProps {
  forceCreate?: boolean;
}

export default function TournamentCreator({ forceCreate }: TournamentCreatorProps) {
  const { t } = useTranslation();
  const activeTournament = useActiveTournament();
  const { createTournament } = useTournamentStore();
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateDefinition | null>(null);
  const [showForm, setShowForm] = useState(false);

  // If there is an active tournament, we show its summary, unless we are forcing creation mode
  if (activeTournament && !forceCreate) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-disp text-lg font-bold">{activeTournament.name}</h3>
          <span className="bg-green-soft text-green-fg text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Aktywny
          </span>
        </div>
        <div className="text-sm text-text-muted">
          Format: <span className="font-bold">{activeTournament.templateId}</span> • Fazy: {activeTournament.phases.length} • Drużyny: {activeTournament.teams.length}
        </div>
      </div>
    );
  }

  const handleSelectTemplate = (tpl: TemplateDefinition) => {
    if (selectedTemplate?.id === tpl.id) {
      setSelectedTemplate(null);
      setShowForm(false);
    } else {
      setSelectedTemplate(tpl);
      setShowForm(true);
    }
  };

  const handleCreate = (name: string, templateId: string) => {
    if (!selectedTemplate) return;

    // Use default countries for now (first N from the list)
    const requiredTeams = selectedTemplate.id === "league" 
      ? selectedTemplate.teamsPerGroup 
      : selectedTemplate.groupCount * selectedTemplate.teamsPerGroup;
    
    const selectedTeamIds = COUNTRIES.slice(0, requiredTeams).map(c => c.id);
    const selectedTeams = COUNTRIES.slice(0, requiredTeams);

    const phases = generatePhasesFromTemplate(selectedTemplate, selectedTeamIds);

    const groups: Record<string, string[]> = {};
    if (selectedTemplate.id !== "league") {
      for (let i = 0; i < selectedTemplate.groupCount; i++) {
        const groupLabel = String.fromCharCode(65 + i);
        groups[groupLabel] = selectedTeamIds.slice(i * selectedTemplate.teamsPerGroup, (i + 1) * selectedTemplate.teamsPerGroup);
      }
    } else {
      groups["L"] = selectedTeamIds;
    }

    createTournament({
      name,
      templateId,
      teams: selectedTeams,
      groups,
      phases,
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
