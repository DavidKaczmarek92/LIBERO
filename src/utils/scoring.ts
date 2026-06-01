import { MatchPick, MatchResult } from '../types';

/**
 * Calculates points for a group phase pick.
 * 3 points for exact score, 1 point for correct sign (win/draw/loss), 0 otherwise.
 */
export function calculateGroupPhasePick(
  pick: Pick<MatchPick, 'homeGoals' | 'awayGoals'>,
  result: MatchResult | undefined
): number {
  if (!result) return 0;

  if (pick.homeGoals === result.homeGoals && pick.awayGoals === result.awayGoals) {
    return 3;
  }

  const pickOutcome = pick.homeGoals === pick.awayGoals ? 0 : pick.homeGoals > pick.awayGoals ? 1 : -1;
  const resultOutcome = result.homeGoals === result.awayGoals ? 0 : result.homeGoals > result.awayGoals ? 1 : -1;

  if (pickOutcome === resultOutcome) {
    return 1;
  }
  return 0;
}

/**
 * Calculates points for a knockout phase pick.
 * Base points from group logic + 1 bonus if predicted draw AND correct knockoutWinner.
 */
export function calculateKnockoutPhasePick(
  pick: MatchPick,
  result: MatchResult | undefined,
  homeTeam: string,
  awayTeam: string
): number {
  if (!result) return 0;

  let points = calculateGroupPhasePick(pick, result);

  const isDrawPick = pick.homeGoals === pick.awayGoals;
  if (isDrawPick && pick.knockoutWinner) {
    // Determine actual winner
    let actualWinner: string | null = null;
    if (result.penalties?.winner) {
      actualWinner = result.penalties.winner;
    } else if (result.extraTime) {
      actualWinner = result.extraTime.homeGoals > result.extraTime.awayGoals ? homeTeam : awayTeam;
    } else if (result.homeGoals !== result.awayGoals) {
      actualWinner = result.homeGoals > result.awayGoals ? homeTeam : awayTeam;
    }
    if (pick.knockoutWinner === actualWinner) {
      points += 1;
    }
  }
  return points;
}
