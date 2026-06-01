import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { useTournamentStore, useActiveTournament } from "../../store/tournamentStore";
import { Country } from "../../types";

export default function TeamManager() {
  const { t } = useTranslation();
  const activeTournament = useActiveTournament();
  const { updateTeams } = useTournamentStore();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editFlag, setEditFlag] = useState("");

  if (!activeTournament) return null;

  const teams = activeTournament.teams;

  const handleEdit = (team: Country) => {
    setEditingId(team.id);
    setEditName(team.name);
    setEditFlag(team.flag);
  };

  const handleSave = () => {
    if (!editingId) return;
    const newTeams = teams.map(t => 
      t.id === editingId ? { ...t, name: editName, flag: editFlag } : t
    );
    updateTeams(newTeams);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm(t("teams.deleteConfirm") || "Czy na pewno chcesz usunąć tę drużynę?")) {
      const newTeams = teams.filter(t => t.id !== id);
      updateTeams(newTeams);
    }
  };

  const handleAdd = () => {
    const newTeam: Country = {
      id: `c_${Date.now()}`,
      name: "Nowa Drużyna",
      flag: "🏳️",
    };
    updateTeams([...teams, newTeam]);
    handleEdit(newTeam);
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="font-disp text-xl font-bold">{t("teams.title") || "Zarządzanie Drużynami"}</h3>
          <span className="bg-blue-soft text-blue text-xs font-bold px-2.5 py-1 rounded-lg">
            {teams.length}
          </span>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-green text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md shadow-green/20 hover:bg-green/90 transition-all active:scale-95"
        >
          <Plus size={18} /> {t("teams.add") || "Dodaj drużynę"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <div
            key={team.id}
            className={`group flex flex-col gap-3 bg-surface-2 border rounded-xl p-4 transition-all ${
              editingId === team.id ? "border-blue ring-2 ring-blue/10" : "border-border hover:border-blue/30"
            }`}
          >
            {editingId === team.id ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editFlag}
                    onChange={(e) => setEditFlag(e.target.value)}
                    className="w-10 h-10 text-center bg-surface border border-border rounded-lg text-lg focus:outline-none focus:border-blue"
                    placeholder="🏁"
                  />
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 bg-surface border border-border rounded-lg px-3 py-2 text-sm font-bold focus:outline-none focus:border-blue"
                    placeholder="Nazwa drużyny"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue text-white py-2 rounded-lg text-xs font-bold"
                  >
                    <Save size={14} /> {t("common.save")}
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-3 flex items-center justify-center bg-surface border border-border rounded-lg text-text-muted hover:bg-surface-3"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-3 flex items-center justify-center text-xl shadow-sm border border-border">
                  {team.flag}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-text truncate">{team.name}</div>
                  <div className="text-[10px] text-text-faint font-bold uppercase tracking-wider">{team.id}</div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(team)}
                    className="p-2 text-text-muted hover:text-blue hover:bg-blue-soft rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(team.id)}
                    className="p-2 text-text-muted hover:text-red-fg hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
