import { Standing } from '../types';

export interface RawPlayerPoints {
  id: number;
  name: string;
  total_points: number;
}

export interface RawTournamentPick {
  player_id: number;
  champion_team_id: number | null;
  top_scorer_name: string | null;
  champion_team_name?: string | null;
}

export interface TournamentResults {
  champion_team_id: number | null;
  top_scorer_name: string | null;
}

export function calculateStandings(
  players: RawPlayerPoints[],
  tournamentPicks: RawTournamentPick[],
  results: TournamentResults
): Standing[] {
  // Pre-index picks by player_id to avoid O(N*M) complexity
  const picksMap = new Map<number, RawTournamentPick>(
    tournamentPicks.map(p => [p.player_id, p])
  );

  // Sort players: total_points DESC, name ASC
  const sortedPlayers = [...players].sort((a, b) => {
    if (b.total_points !== a.total_points) {
      return b.total_points - a.total_points;
    }
    // Use an explicit locale for deterministic tie-breaking across environments
    return a.name.localeCompare(b.name, 'en');
  });

  const actualChampionId = results.champion_team_id;
  const actualTopScorer = results.top_scorer_name;

  let currentRank = 1;
  let lastPoints = -1;

  return sortedPlayers.map((p, index) => {
    if (p.total_points !== lastPoints) {
      currentRank = index + 1;
    }
    lastPoints = p.total_points;

    const pick = picksMap.get(p.id);
    
    const championCorrect = 
      actualChampionId !== null && 
      pick?.champion_team_id === actualChampionId;
      
    const topScorerCorrect = 
      actualTopScorer !== null && 
      actualTopScorer.trim() !== '' &&
      pick?.top_scorer_name?.trim().toLowerCase() === actualTopScorer.trim().toLowerCase();

    return {
      player: { id: p.id, name: p.name },
      totalPoints: p.total_points,
      rank: currentRank,
      championCorrect,
      topScorerCorrect,
      championPickName: pick?.champion_team_name ?? null,
      topScorerPickName: pick?.top_scorer_name ?? null,
    };
  });
}
