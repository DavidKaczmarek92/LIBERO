// Data models per RFC §7 (adapted for v1 implementation)

export interface Country {
  id: string;
  name: string;
  flag: string;
}

export interface Player {
  id: string;
  name: string;
  createdAt: string;
}

export interface MatchResult {
  homeGoals: number;
  awayGoals: number;
  extraTime?: {
    homeGoals: number;
    awayGoals: number;
  };
  penalties?: {
    winner: string;
  };
}

export interface Match {
  id: string;
  phaseId: string;
  groupLabel?: string;
  homeTeam: string; // country id
  awayTeam: string; // country id
  result?: MatchResult;
}

export interface MatchPick {
  id: string;
  playerId: string;
  matchId: string;
  homeGoals: number;
  awayGoals: number;
  knockoutWinner?: string; // country id, for knockout matches
  points?: number; // calculated
}

export interface TournamentPick {
  playerId: string;
  champion: string; // country id
  topScorer: string; // country id or player name?
}

export interface TournamentPhase {
  id: string;
  name: string;
  type: 'group' | 'round_of_16' | 'quarter' | 'semi' | 'final';
  matches: Match[];
}

export interface TournamentTemplate {
  id: string;
  name: string;
  description?: string;
}

export interface Tournament {
  id: string;
  name: string;
  templateId: string;
  countries: string[]; // list of country ids used
  groups: Record<string, string[]>; // e.g. { 'A': ['country1', 'country2', ...] }
  phases: TournamentPhase[];
  // additional v1 fields
  createdAt: string;
}

// Built-in templates per plan
export const BUILT_IN_TEMPLATES: TournamentTemplate[] = [
  { id: 'wc32', name: 'World Cup 32' },
  { id: 'wc16', name: 'World Cup 16' },
  { id: 'league', name: 'League' },
  { id: 'custom', name: 'Custom' },
];

// Store state shape (for Zustand)
export interface AppState {
  tournament: Tournament | null;
  players: Player[];
  matchPicks: Record<string, MatchPick[]>; // playerId -> picks
  tournamentPicks: Record<string, TournamentPick>; // playerId -> pick
  // etc.
}
