import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronUp, User, Trophy, FileText } from "lucide-react";
import { useTournamentStore, useActiveTournament } from "../../store/tournamentStore";
import MatchPickRow from "./MatchPickRow";
import TournamentPickForm from "./TournamentPickForm";

export default function PlayerPicksSection() {
  const { t } = useTranslation();
  const tournament = useActiveTournament();
  
  const players = tournament?.players || [];
  const matchPicks = tournament?.matchPicks || {};
  const tournamentPicks = tournament?.tournamentPicks || {};

  const [expandedPlayerId, setExpandedPlayerId] = useState<string | null>(players[0]?.id || null);

  if (!tournament) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-8 shadow-sm text-center">
        <p className="text-text-muted font-medium">Utwórz turniej, aby zobaczyć typowania.</p>
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-8 shadow-sm text-center">
        <p className="text-text-muted font-medium">{t("players.empty")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {players.map((player) => {
        const isExpanded = expandedPlayerId === player.id;
        const playerMatchPicks = matchPicks[player.id] || [];
        const playerTournamentPick = tournamentPicks[player.id];
        
        const totalPoints = playerMatchPicks.reduce((sum, p) => sum + (p.points || 0), 0);

        return (
          <div key={player.id} className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm transition-all duration-300">
            <button
              onClick={() => setExpandedPlayerId(isExpanded ? null : player.id)}
              className={`w-full flex items-center justify-between p-4 transition-colors ${
                isExpanded ? "bg-blue/5" : "hover:bg-surface-2"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-surface-2 rounded-full flex items-center justify-center text-text-muted border border-border">
                  <User size={20} />
                </div>
                <div className="text-left">
                  <div className="font-bold text-text">{player.name}</div>
                  <div className="text-xs text-text-faint font-medium">
                    {playerMatchPicks.length} typów • {totalPoints} pkt
                  </div>
                </div>
              </div>
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {isExpanded && (
              <div className="p-4 pt-0 space-y-6 animate-in fade-in duration-300">
                <div className="h-px bg-border -mx-4"></div>
                
                <section>
                  <div className="flex items-center gap-2 mb-3 px-2">
                    <Trophy size={14} className="text-blue" />
                    <h4 className="text-[10px] font-extrabold text-blue uppercase tracking-widest">
                      {t("picks.tournament")}
                    </h4>
                  </div>
                  <TournamentPickForm
                    playerId={player.id}
                    pick={playerTournamentPick}
                    onSubmit={() => {}}
                  />
                </section>

                <section>
                  <div className="flex items-center gap-2 mb-3 px-2">
                    <FileText size={14} className="text-blue" />
                    <h4 className="text-[10px] font-extrabold text-blue uppercase tracking-widest">
                      {t("picks.match")}
                    </h4>
                  </div>
                  <div className="space-y-6">
                    {tournament.phases.map((phase) => (
                      <div key={phase.id} className="bg-surface-2/50 rounded-xl p-3 border border-border/50">
                        <h5 className="text-[10px] font-bold text-text-faint uppercase tracking-widest mb-3 flex items-center gap-2">
                          <span className="w-1 h-3 bg-blue/30 rounded-full"></span>
                          {phase.name}
                        </h5>
                        <div className="space-y-1">
                          {phase.matches.map((match) => (
                            <MatchPickRow
                              key={match.id}
                              playerId={player.id}
                              match={match}
                              phase={phase}
                              existingPick={playerMatchPicks.find((p) => p.matchId === match.id)}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
