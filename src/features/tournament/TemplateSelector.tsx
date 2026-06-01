import { useTranslation } from "react-i18next";
import { BUILT_IN_TEMPLATES, TournamentTemplate } from "../../types";

interface TemplateSelectorProps {
  selectedId: string;
  onSelect: (template: TournamentTemplate) => void;
}

export default function TemplateSelector({ selectedId, onSelect }: TemplateSelectorProps) {
  const { t } = useTranslation();

  return (
    <div>
      <div className="text-sm font-semibold mb-2 text-text-faint">{t("tournament.selectTemplate")}</div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {BUILT_IN_TEMPLATES.map((tpl) => (
          <button
            key={tpl.id}
            onClick={() => onSelect(tpl)}
            className={`panel p-4 text-left transition-all ${selectedId === tpl.id ? "ring-2 ring-blue" : "hover:border-blue"}`}
          >
            <div className="font-semibold">{tpl.name}</div>
            <div className="text-xs text-text-muted mt-1">{tpl.description}</div>
            <div className="text-[10px] mt-2 text-text-faint">Szablon gotowy</div>
          </button>
        ))}
      </div>
    </div>
  );
}
