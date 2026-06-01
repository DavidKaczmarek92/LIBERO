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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-surface w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-border" onClick={(e) => e.stopPropagation()}>
        <div className="bg-chrome px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-disp font-bold text-text">{player ? t("players.edit") : t("players.add")}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-3 rounded-lg text-text-muted transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-text-muted mb-2">{t("players.title")}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(null); }}
                className="w-full bg-inset border border-border rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue transition-all"
                placeholder="np. Jan Kowalski"
                autoFocus
              />
            </div>
            {error && (
              <div className="bg-red-50 text-red-fg text-xs font-bold px-3 py-2 rounded-lg border border-red-100">
                {error}
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-border text-text font-bold rounded-xl hover:bg-surface-2 transition-colors"
              >
                {t("common.cancel")}
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-blue text-white font-bold rounded-xl hover:bg-blue-fg transition-all shadow-lg shadow-blue/20 disabled:opacity-50 disabled:shadow-none"
                disabled={!name.trim()}
              >
                {t("common.save")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
