// src/utils/scoring.ts
import { Phase } from '../types';

export function calculatePoints(
  pick: { homeGoals: number; awayGoals: number; extraTimeWinnerId?: number | null },
  result: { homeGoals: number; awayGoals: number; extraTimeWinnerId?: number | null },
  phase: Phase
): number {
  // Exact score → 3 pts
  if (pick.homeGoals === result.homeGoals && pick.awayGoals === result.awayGoals) {
    return 3;
  }

  const pickSign   = Math.sign(pick.homeGoals   - pick.awayGoals);    // -1 | 0 | 1
  const resultSign = Math.sign(result.homeGoals - result.awayGoals);

  // Correct winner / draw direction → 1 pt
  if (pickSign === resultSign) {
    let pts = 1;
    // Knockout bonus: player predicted draw AND match was a draw after 90 min
    if (phase !== 'group' && pickSign === 0 && resultSign === 0) {
      if (
        pick.extraTimeWinnerId != null &&
        pick.extraTimeWinnerId === result.extraTimeWinnerId
      ) {
        pts += 1; // correct ET/penalties winner
      }
    }
    return pts;
  }

  return 0;
}
