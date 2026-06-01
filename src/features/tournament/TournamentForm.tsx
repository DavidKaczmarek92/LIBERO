import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TournamentTemplate } from "../../types";

interface TournamentFormProps {
  template: TournamentTemplate | null;
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

  return (
    <div className="panel mt-6">
      <div className="panel-head">
        <h3>{t("tournament.title")}</h3>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1.5">{t("tournament.name")}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(null); }}
            className="w-full bg-inset border border-border rounded-[var(--radius-sm)] px-4 py-2.5 text-[15px]"
            placeholder="MŚ 2026 Libero"
          />
          {error && <div className="text-red-fg text-sm mt-1">{error}</div>}
        </div>
        {template && (
          <div className="text-sm text-text-muted">
            Szablon: <span className="font-medium text-text">{template.name}</span>
          </div>
        )}
        <div className="flex gap-3 pt-2">
          <button onClick={onCancel} className="btn btn-ghost flex-1">{t("common.cancel")}</button>
          <button onClick={handleCreate} className="btn btn-primary flex-1" disabled={!name.trim() || !template}>
            {t("tournament.create")}
          </button>
        </div>
      </div>
    </div>
  );
}
