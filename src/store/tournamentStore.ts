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
} from '../types';
import {
  calculateGroupPhasePick,
  calculateKnockoutPhasePick,
} from '../utils/scoring';


interface TournamentStore extends AppState {
  // Actions
  createTournament: (tournament: Omit<Tournament, 'id' | 'createdAt'>) => void;
  addPlayer: (name: string) => { success: boolean; error?: string };
  updatePlayer: (id: string, name: string) => { success: boolean; error?: string };
  deletePlayer: (id: string) => void;
  updateMatchResult: (matchId: string, result: MatchResult) => void;
  submitMatchPick: (playerId: string, matchId: string, pick: Omit<MatchPick, 'id' | 'playerId' | 'matchId' | 'points'>) => void;
  submitTournamentPick: (playerId: string, pick: Omit<TournamentPick, 'playerId'>) => void;
  recalculatePoints: () => void;
  loadFromPersistence: () => Promise<void>;
  reset: () => void;
}

export const useTournamentStore = create<TournamentStore>()(
  persist(
    (set, get) => ({
      tournament: null,
      players: [],
      matchPicks: {},
      tournamentPicks: {},

      createTournament: (data) => {
        const newTournament: Tournament = {
          ...data,
          id: `t_${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set({ tournament: newTournament, matchPicks: {}, tournamentPicks: {} });
      },

      addPlayer: (name) => {
        const { players } = get();
        if (players.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
          return { success: false, error: 'error.duplicatePlayer' };
        }
        const newPlayer: Player = {
          id: `p_${Date.now()}`,
          name,
          createdAt: new Date().toISOString(),
        };
        set({ players: [...players, newPlayer] });
        return { success: true };
      },

      updatePlayer: (id, name) => {
        const { players } = get();
        if (players.some((p) => p.id !== id && p.name.toLowerCase() === name.toLowerCase())) {
          return { success: false, error: 'error.duplicatePlayer' };
        }
        set({
          players: players.map((p) => (p.id === id ? { ...p, name } : p)),
        });
        return { success: true };
      },

      deletePlayer: (id) => {
        const { players, matchPicks, tournamentPicks } = get();
        set({
          players: players.filter((p) => p.id !== id),
          matchPicks: Object.fromEntries(
            Object.entries(matchPicks).filter(([pid]) => pid !== id)
          ),
          tournamentPicks: Object.fromEntries(
            Object.entries(tournamentPicks).filter(([pid]) => pid !== id)
          ),
        });
      },

      updateMatchResult: (matchId, result) => {
        const { tournament } = get();
        if (!tournament) return;

        // Update the result in tournament phases
        const updatedPhases = tournament.phases.map((phase) => ({
          ...phase,
          matches: phase.matches.map((m) =>
            m.id === matchId ? { ...m, result } : m
          ),
        }));

        set({
          tournament: { ...tournament, phases: updatedPhases },
        });

        // Trigger recalc
        get().recalculatePoints();
      },

      submitMatchPick: (playerId, matchId, pickData) => {
        const { matchPicks } = get();
        const picksForPlayer = matchPicks[playerId] || [];
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

        set({
          matchPicks: {
            ...matchPicks,
            [playerId]: updatedPicks,
          },
        });

        get().recalculatePoints();
      },

      submitTournamentPick: (playerId, pickData) => {
        set({
          tournamentPicks: {
            ...get().tournamentPicks,
            [playerId]: { playerId, ...pickData },
          },
        });
      },

      recalculatePoints: () => {
        const { matchPicks, tournament } = get();
        if (!tournament) return;

        const updatedMatchPicks: Record<string, MatchPick[]> = {};

        Object.keys(matchPicks).forEach((playerId) => {
          updatedMatchPicks[playerId] = matchPicks[playerId].map((pick) => {
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

        set({ matchPicks: updatedMatchPicks });
      },

      loadFromPersistence: async () => {
        // Handled by persist middleware
      },

      reset: () => {
        set({
          tournament: null,
          players: [],
          matchPicks: {},
          tournamentPicks: {},
        });
      },
    }),
    {
      name: 'libero-tournament-state',
      storage: createJSONStorage(() => appStorage),
      partialize: (state) => ({
        tournament: state.tournament,
        players: state.players,
        matchPicks: state.matchPicks,
        tournamentPicks: state.tournamentPicks,
      }),
    }
  )
);

// Helper to load initial data (call in App or main)
export async function initializeStore() {
  // tauri store auto loads on first get in persist
  // additional init if needed
}
