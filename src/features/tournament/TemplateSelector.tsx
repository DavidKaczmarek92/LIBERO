import { useTranslation } from "react-i18next";
import { TOURNAMENT_TEMPLATES, TemplateDefinition } from "../../data/templates";

interface TemplateSelectorProps {
  selectedId: string;
  onSelect: (template: TemplateDefinition) => void;
}

export default function TemplateSelector({ selectedId, onSelect }: TemplateSelectorProps) {
  const { t } = useTranslation();

  return (
    <div>
      <div className="text-sm font-semibold mb-3 text-text-faint">{t("tournament.selectTemplate")}</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {TOURNAMENT_TEMPLATES.map((tpl) => (
          <button
            key={tpl.id}
            onClick={() => onSelect(tpl)}
            className={`flex flex-col p-5 text-left rounded-xl border-2 transition-all outline-none ${
              selectedId === tpl.id
                ? "bg-blue-soft/50 border-blue ring-2 ring-blue/20 shadow-lg shadow-blue/10"
                : "bg-surface border-border hover:border-blue-soft hover:bg-surface-2"
            }`}
          >
            <div className={`font-bold text-base ${selectedId === tpl.id ? "text-blue" : "text-text"}`}>
              {tpl.name}
            </div>
            <div className="text-xs text-text-muted mt-1.5 line-clamp-2">
              {tpl.description || "Gotowy schemat rozgrywek"}
            </div>
            <div className={`text-[10px] mt-auto pt-4 font-bold uppercase tracking-wider ${
              selectedId === tpl.id ? "text-blue" : "text-text-faint"
            }`}>
              {selectedId === tpl.id ? "Wybrano" : "Wybierz szablon"}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
