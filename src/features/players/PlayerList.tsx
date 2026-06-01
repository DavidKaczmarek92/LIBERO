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
    if (editingPlayer) {
      return updatePlayer(editingPlayer.id, name);
    } else {
      return addPlayer(name);
    }
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
    <div className="panel">
      <div className="panel-head">
        <div className="left">
          <h3>{t("players.title")}</h3>
          <span className="badge badge-blue">{players.length}</span>
        </div>
        <button onClick={handleAdd} className="btn btn-primary">
          <Plus size={16} /> {t("players.add")}
        </button>
      </div>

      {players.length === 0 ? (
        <div className="text-center py-10 text-text-muted">
          {t("players.empty")}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {players.map((player) => (
            <div key={player.id} className="player-card">
              <div className="av av-mk">{player.name.slice(0, 2).toUpperCase()}</div>
              <div className="meta">
                <div className="nm">{player.name}</div>
                <div className="st">0 pkt • 0 typów</div>
              </div>
              <div className="acts">
                <button onClick={() => handleEdit(player)} className="icon-btn" title={t("players.edit")}>
                  <Edit2 size={15} />
                </button>
                <button onClick={() => handleDelete(player.id)} className="icon-btn danger" title={t("players.delete")}>
                  <Trash2 size={15} />
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
