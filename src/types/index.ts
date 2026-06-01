// src/types/index.ts

export type Phase = 'group' | 'r32' | 'r16' | 'qf' | 'sf' | 'final';

export interface Player {
  id: number;
  name: string;
}

export interface Team {
  id: number;
  name: string;
  groupLabel: string;
}

export interface Match {
  id: number;
  phase: Phase;
  groupLabel?: string;
  homeTeamId: number | null;
  awayTeamId: number | null;
  homeGoals: number | null;
  awayGoals: number | null;
  extraTimeWinnerId: number | null;
  matchDate?: string;
  matchOrder: number;
}

export interface Pick {
  id: number;
  playerId: number;
  matchId: number;
  homeGoals: number;
  awayGoals: number;
  extraTimeWinnerId: number | null;
  points: number;
}

export interface TournamentPick {
  playerId: number;
  championTeamId: number | null;
  topScorerName: string;
}

export interface Standing {
  player: Player;
  totalPoints: number;
  rank: number;
  championCorrect: boolean;
  topScorerCorrect: boolean;
}
