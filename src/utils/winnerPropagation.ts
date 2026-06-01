import { Tournament } from '../types';

/**
 * Skeleton for winner propagation logic (RFC 6.4).
 * When a result in earlier round changes, downstream matches' results may need clearing
 * (e.g. if team that advanced changes).
 * 
 * In full impl (Step 4 bracket): 
 * - Traverse knockout phases in order
 * - If a match result changes the expected opponent in next round, clear the later result
 * - Show confirmation dialog before clearing multiple downstream results.
 */
export function propagateWinners(
  tournament: Tournament,
  changedMatchId: string
): { updatedTournament: Tournament; clearedMatchIds: string[] } {
  // Placeholder: return unchanged for now
  // Real logic will use React Flow or phase traversal to find dependent matches
  console.log('[winnerPropagation] Propagation triggered for match', changedMatchId);
  return {
    updatedTournament: tournament,
    clearedMatchIds: [],
  };
}

/**
 * Helper to determine if downstream results should be cleared (for dialog).
 */
export function shouldClearDownstream(_changedMatchId: string, _tournament: Tournament): boolean {
  // TODO: implement check for dependent later matches with results
  return false;
}
