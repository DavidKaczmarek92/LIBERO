import { useState } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { Player } from "../../types";

interface PlayerFormProps {
  player?: Player;
  onSave: (name: string) => { success: boolean; error?: string };
  onClose: () => void;
}

export default function PlayerForm({ player, onSave, onClose }: PlayerFormProps) {
  const { t } = useTranslation();
  const [name, setName] = useState(player?.name || "");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const result = onSave(name.trim());
    if (result.success) {
      onClose();
    } else if (result.error) {
      setError(t(result.error));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="win w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="win-bar">
          <div className="lights"><i></i><i></i><i></i></div>
          <div className="win-title">{player ? t("players.edit") : t("players.add")}</div>
          <button onClick={onClose} className="icon-btn"><X size={14} /></button>
        </div>
        <div className="win-body">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">{t("players.title")}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(null); }}
                className="w-full bg-inset border border-border rounded-[var(--radius-sm)] px-4 py-2.5 text-[15px] focus:outline-none focus:border-blue"
                placeholder="Imię i nazwisko"
                autoFocus
              />
            </div>
            {error && <div className="text-red-fg text-sm">{error}</div>}
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={onClose} className="btn btn-ghost flex-1">{t("common.cancel")}</button>
              <button type="submit" className="btn btn-primary flex-1" disabled={!name.trim()}>{t("common.save")}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
