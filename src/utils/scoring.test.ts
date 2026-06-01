import { describe, it, expect } from 'vitest';
import { calculateGroupPhasePick, calculateKnockoutPhasePick } from './scoring';
import { MatchResult } from '../types';

describe('scoring', () => {
  const result: MatchResult = { homeGoals: 2, awayGoals: 1 };

  it('gives 3 points for exact score in group', () => {
    expect(calculateGroupPhasePick({ homeGoals: 2, awayGoals: 1 }, result)).toBe(3);
  });

  it('gives 1 point for correct outcome only', () => {
    expect(calculateGroupPhasePick({ homeGoals: 3, awayGoals: 0 }, result)).toBe(1);
  });

  it('gives 0 for wrong outcome', () => {
    expect(calculateGroupPhasePick({ homeGoals: 0, awayGoals: 2 }, result)).toBe(0);
  });

  it('knockout bonus for correct winner after draw pick', () => {
    const pick = { homeGoals: 1, awayGoals: 1, knockoutWinner: 'PL' } as any;
    const resKO: MatchResult = { homeGoals: 1, awayGoals: 1, penalties: { winner: 'PL' } };
    expect(calculateKnockoutPhasePick(pick, resKO, 'PL', 'DE')).toBe(4); // 3 +1
  });

  it('handles negative scenario: no result', () => {
    expect(calculateGroupPhasePick({ homeGoals: 1, awayGoals: 0 }, undefined)).toBe(0);
  });
});
