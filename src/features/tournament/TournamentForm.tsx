import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TemplateDefinition } from "../../data/templates";
import { COUNTRIES } from "../../data/countries";

interface TournamentFormProps {
  template: TemplateDefinition | null;
  onCreate: (name: string, templateId: string) => void;
  onCancel: () => void;
}

export default function TournamentForm({ template, onCreate, onCancel }: TournamentFormProps) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleCreate = () => {
    if (!name.trim()) {
      setError(t("error.tournamentName"));
      return;
    }
    if (!template) return;
    onCreate(name.trim(), template.id);
  };

  const requiredTeams = template 
    ? (template.id === 'league' ? template.teamsPerGroup : template.groupCount * template.teamsPerGroup) 
    : 0;

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm mt-6 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="mb-6">
        <h3 className="font-disp text-xl font-bold">{t("tournament.title")}</h3>
        <p className="text-sm text-text-faint mt-1">Skonfiguruj nazwę dla wybranego formatu.</p>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-text-muted mb-2">{t("tournament.name")}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(null); }}
            className="w-full bg-inset border border-border rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue transition-all"
            placeholder="np. Libero Cup 2026"
          />
          {error && (
            <div className="bg-red-50 text-red-fg text-xs font-bold px-3 py-2 rounded-lg border border-red-100 mt-2">
              {error}
            </div>
          )}
        </div>

        {template && (
          <div>
            <label className="block text-sm font-bold text-text-muted mb-2">Wybrane drużyny ({requiredTeams})</label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto bg-inset border border-border rounded-xl p-3">
              {COUNTRIES.slice(0, requiredTeams).map(c => (
                <span key={c.id} className="bg-surface border border-border rounded px-2 py-1 text-xs font-bold flex items-center gap-1 shadow-sm">
                  <span>{c.flag}</span>
                  <span>{c.id}</span>
                </span>
              ))}
            </div>
            <p className="text-[10px] text-text-faint mt-2 italic">Dla tego szablonu automatycznie przypisano {requiredTeams} drużyn.</p>
          </div>
        )}

        {template && (
          <div className="flex items-center gap-2 bg-blue-soft/30 px-4 py-3 rounded-xl border border-blue-soft">
            <div className="text-xs font-bold text-blue uppercase tracking-wider">Szablon:</div>
            <div className="font-bold text-text">{template.name}</div>
          </div>
        )}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 border border-border text-text font-bold rounded-xl hover:bg-surface-2 transition-colors"
          >
            {t("common.cancel")}
          </button>
          <button
            onClick={handleCreate}
            className="flex-1 px-4 py-3 bg-green text-white font-bold rounded-xl hover:bg-green/90 transition-all shadow-lg shadow-green/20 disabled:opacity-50 disabled:shadow-none"
            disabled={!name.trim() || !template}
          >
            {t("tournament.create")}
          </button>
        </div>
      </div>
    </div>
  );
}
