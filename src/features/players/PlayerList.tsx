import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useTournamentStore } from "../../store/tournamentStore";
import { Player } from "../../types";
import PlayerForm from "./PlayerForm";

export default function PlayerList() {
  const { t } = useTranslation();
  const { players, addPlayer, updatePlayer, deletePlayer } = useTournamentStore();
  const [showForm, setShowForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | undefined>(undefined);

  const handleAdd = () => {
    setEditingPlayer(undefined);
    setShowForm(true);
  };

  const handleEdit = (player: Player) => {
    setEditingPlayer(player);
    setShowForm(true);
  };

  const handleSave = (name: string) => {
    let result;
    if (editingPlayer) {
      result = updatePlayer(editingPlayer.id, name);
    } else {
      result = addPlayer(name);
    }
    return result;
  };

  const handleDelete = (id: string) => {
    if (confirm(t("players.delete") + "?")) {
      deletePlayer(id);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingPlayer(undefined);
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="font-disp text-xl font-bold">{t("players.title")}</h3>
          <span className="bg-blue-soft text-blue text-xs font-bold px-2.5 py-1 rounded-lg">
            {players.length}
          </span>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-green text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md shadow-green/20 hover:bg-green/90 transition-all active:scale-95"
        >
          <Plus size={18} /> {t("players.add")}
        </button>
      </div>

      {players.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
          <p className="text-text-faint font-medium">{t("players.empty")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {players.map((player) => (
            <div
              key={player.id}
              className="group flex items-center gap-4 bg-surface-2 border border-border rounded-xl p-4 hover:border-blue/30 transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-violet-soft text-violet-fg flex items-center justify-center font-disp font-bold text-sm shadow-sm">
                {player.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-text truncate">{player.name}</div>
                <div className="text-xs text-text-muted mt-0.5">0 pkt • 0 typów</div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(player)}
                  className="p-2 text-text-muted hover:text-blue hover:bg-blue-soft rounded-lg transition-colors"
                  title={t("players.edit")}
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(player.id)}
                  className="p-2 text-text-muted hover:text-red-fg hover:bg-red-50 rounded-lg transition-colors"
                  title={t("players.delete")}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <PlayerForm
          player={editingPlayer}
          onSave={handleSave}
          onClose={closeForm}
        />
      )}
    </div>
  );
}
