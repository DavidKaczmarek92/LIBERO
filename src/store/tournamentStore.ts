import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { appStorage } from './storage';
import {
  Player,
  Tournament,
  MatchPick,
  TournamentPick,
  MatchResult,
  AppState,
  Country,
} from '../types';
import {
  calculateGroupPhasePick,
  calculateKnockoutPhasePick,
} from '../utils/scoring';


interface TournamentStore extends AppState {
  // Actions
  createTournament: (tournament: Omit<Tournament, 'id' | 'createdAt' | 'players' | 'matchPicks' | 'tournamentPicks'>) => void;
  setActiveTournament: (id: string | null) => void;
  addPlayer: (name: string) => { success: boolean; error?: string };
  updatePlayer: (id: string, name: string) => { success: boolean; error?: string };
  deletePlayer: (id: string) => void;
  updateMatchResult: (matchId: string, result: MatchResult) => void;
  submitMatchPick: (playerId: string, matchId: string, pick: Omit<MatchPick, 'id' | 'playerId' | 'matchId' | 'points'>) => void;
  submitTournamentPick: (playerId: string, pick: Omit<TournamentPick, 'playerId'>) => void;
  updateTeams: (teams: Country[]) => void;
  recalculatePoints: () => void;
  loadFromPersistence: () => Promise<void>;
  reset: () => void;
}

export const useTournamentStore = create<TournamentStore>()(
  persist(
    (set, get) => ({
      tournaments: [],
      activeTournamentId: null,

      createTournament: (data) => {
        const newTournament: Tournament = {
          ...data,
          id: `t_${Date.now()}`,
          players: [],
          matchPicks: {},
          tournamentPicks: {},
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          tournaments: [...state.tournaments, newTournament],
          activeTournamentId: newTournament.id,
        }));
      },

      setActiveTournament: (id) => {
        set({ activeTournamentId: id });
      },

      addPlayer: (name) => {
        const { tournaments, activeTournamentId } = get();
        const tournament = tournaments.find(t => t.id === activeTournamentId);
        if (!tournament) return { success: false, error: 'error.noActiveTournament' };

        if (tournament.players.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
          return { success: false, error: 'error.duplicatePlayer' };
        }
        const newPlayer: Player = {
          id: `p_${Date.now()}`,
          name,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          tournaments: state.tournaments.map(t => 
            t.id === activeTournamentId 
              ? { ...t, players: [...t.players, newPlayer] }
              : t
          )
        }));

        return { success: true };
      },

      updatePlayer: (id, name) => {
        const { tournaments, activeTournamentId } = get();
        const tournament = tournaments.find(t => t.id === activeTournamentId);
        if (!tournament) return { success: false, error: 'error.noActiveTournament' };

        if (tournament.players.some((p) => p.id !== id && p.name.toLowerCase() === name.toLowerCase())) {
          return { success: false, error: 'error.duplicatePlayer' };
        }

        set((state) => ({
          tournaments: state.tournaments.map(t => 
            t.id === activeTournamentId 
              ? { ...t, players: t.players.map(p => p.id === id ? { ...p, name } : p) }
              : t
          )
        }));

        return { success: true };
      },

      deletePlayer: (id) => {
        const { activeTournamentId } = get();
        if (!activeTournamentId) return;

        set((state) => ({
          tournaments: state.tournaments.map(t => {
            if (t.id !== activeTournamentId) return t;
            
            return {
              ...t,
              players: t.players.filter((p) => p.id !== id),
              matchPicks: Object.fromEntries(
                Object.entries(t.matchPicks).filter(([pid]) => pid !== id)
              ),
              tournamentPicks: Object.fromEntries(
                Object.entries(t.tournamentPicks).filter(([pid]) => pid !== id)
              ),
            };
          })
        }));
      },

      updateMatchResult: (matchId, result) => {
        const { activeTournamentId, tournaments } = get();
        const tournament = tournaments.find(t => t.id === activeTournamentId);
        if (!tournament) return;

        // Update the result in tournament phases
        const updatedPhases = tournament.phases.map((phase) => ({
          ...phase,
          matches: phase.matches.map((m) =>
            m.id === matchId ? { ...m, result } : m
          ),
        }));

        set((state) => ({
          tournaments: state.tournaments.map(t => 
            t.id === activeTournamentId 
              ? { ...t, phases: updatedPhases }
              : t
          )
        }));

        // Trigger recalc
        get().recalculatePoints();
      },

      submitMatchPick: (playerId, matchId, pickData) => {
        const { activeTournamentId, tournaments } = get();
        const tournament = tournaments.find(t => t.id === activeTournamentId);
        if (!tournament) return;

        const picksForPlayer = tournament.matchPicks[playerId] || [];
        const existingIndex = picksForPlayer.findIndex((p) => p.matchId === matchId);

        const newPick: MatchPick = {
          id: `mp_${Date.now()}`,
          playerId,
          matchId,
          ...pickData,
          points: 0,
        };

        let updatedPicks: MatchPick[];
        if (existingIndex >= 0) {
          updatedPicks = [...picksForPlayer];
          updatedPicks[existingIndex] = { ...newPick, id: picksForPlayer[existingIndex].id };
        } else {
          updatedPicks = [...picksForPlayer, newPick];
        }

        set((state) => ({
          tournaments: state.tournaments.map(t => 
            t.id === activeTournamentId 
              ? { 
                  ...t, 
                  matchPicks: {
                    ...t.matchPicks,
                    [playerId]: updatedPicks,
                  } 
                }
              : t
          )
        }));

        get().recalculatePoints();
      },

      submitTournamentPick: (playerId, pickData) => {
        const { activeTournamentId } = get();
        if (!activeTournamentId) return;

        set((state) => ({
          tournaments: state.tournaments.map(t => 
            t.id === activeTournamentId 
              ? { 
                  ...t, 
                  tournamentPicks: {
                    ...t.tournamentPicks,
                    [playerId]: { playerId, ...pickData },
                  } 
                }
              : t
          )
        }));
      },

      updateTeams: (teams) => {
        const { activeTournamentId } = get();
        if (!activeTournamentId) return;

        set((state) => ({
          tournaments: state.tournaments.map(t => 
            t.id === activeTournamentId 
              ? { ...t, teams }
              : t
          )
        }));
      },

      recalculatePoints: () => {
        const { tournaments, activeTournamentId } = get();
        const tournament = tournaments.find(t => t.id === activeTournamentId);
        if (!tournament) return;

        const updatedMatchPicks: Record<string, MatchPick[]> = {};

        Object.keys(tournament.matchPicks).forEach((playerId) => {
          updatedMatchPicks[playerId] = tournament.matchPicks[playerId].map((pick) => {
            // Find the match to get home/away for KO logic
            let homeTeam = '';
            let awayTeam = '';
            let isKnockout = false;

            for (const phase of tournament.phases) {
              const match = phase.matches.find((m) => m.id === pick.matchId);
              if (match) {
                homeTeam = match.homeTeam;
                awayTeam = match.awayTeam;
                isKnockout = phase.isKnockout;
                break;
              }
            }

            const matchInTournament = tournament.phases
              .flatMap((p) => p.matches)
              .find((m) => m.id === pick.matchId);
            const result = matchInTournament?.result;

            let points = 0;
            if (!isKnockout) {
              points = calculateGroupPhasePick(pick, result);
            } else {
              points = calculateKnockoutPhasePick(pick, result, homeTeam, awayTeam);
            }

            return { ...pick, points };
          });
        });

        set((state) => ({
          tournaments: state.tournaments.map(t => 
            t.id === activeTournamentId 
              ? { ...t, matchPicks: updatedMatchPicks }
              : t
          )
        }));
      },

      loadFromPersistence: async () => {
        // Handled by persist middleware
      },

      reset: () => {
        set({
          tournaments: [],
          activeTournamentId: null,
        });
      },
    }),
    {
      name: 'libero-tournament-state',
      storage: createJSONStorage(() => appStorage),
      partialize: (state) => ({
        tournaments: state.tournaments,
        activeTournamentId: state.activeTournamentId,
      }),
    }
  )
);

// Helper to load initial data (call in App or main)
export async function initializeStore() {
  // tauri store auto loads on first get in persist
  // additional init if needed
}

export const useActiveTournament = () => {
  const tournaments = useTournamentStore((state) => state.tournaments);
  const activeTournamentId = useTournamentStore((state) => state.activeTournamentId);
  return tournaments.find((t) => t.id === activeTournamentId) || null;
};
