import { describe, it, expect } from 'vitest';
import { calculatePoints } from './scoring';

describe('calculatePoints', () => {
  describe('Group Phase', () => {
    it('should return 3 points for an exact score match', () => {
      const pick = { homeGoals: 2, awayGoals: 1 };
      const result = { homeGoals: 2, awayGoals: 1 };
      expect(calculatePoints(pick, result, 'group')).toBe(3);
    });

    it('should return 1 point for correct winner (home win)', () => {
      const pick = { homeGoals: 1, awayGoals: 0 };
      const result = { homeGoals: 3, awayGoals: 1 };
      expect(calculatePoints(pick, result, 'group')).toBe(1);
    });

    it('should return 1 point for correct winner (away win)', () => {
      const pick = { homeGoals: 0, awayGoals: 2 };
      const result = { homeGoals: 1, awayGoals: 4 };
      expect(calculatePoints(pick, result, 'group')).toBe(1);
    });

    it('should return 1 point for correct draw', () => {
      const pick = { homeGoals: 1, awayGoals: 1 };
      const result = { homeGoals: 2, awayGoals: 2 };
      expect(calculatePoints(pick, result, 'group')).toBe(1);
    });

    it('should return 0 points for incorrect winner', () => {
      const pick = { homeGoals: 2, awayGoals: 0 };
      const result = { homeGoals: 0, awayGoals: 1 };
      expect(calculatePoints(pick, result, 'group')).toBe(0);
    });

    it('should return 0 points for predicting draw when there was a winner', () => {
      const pick = { homeGoals: 1, awayGoals: 1 };
      const result = { homeGoals: 2, awayGoals: 1 };
      expect(calculatePoints(pick, result, 'group')).toBe(0);
    });
  });

  describe('Knockout Phase', () => {
    it('should return 3 points for an exact score match in knockout (ignoring ET winner if score matches)', () => {
      const pick = { homeGoals: 1, awayGoals: 1, extraTimeWinnerId: 1 };
      const result = { homeGoals: 1, awayGoals: 1, extraTimeWinnerId: 1 };
      expect(calculatePoints(pick, result, 'r16')).toBe(3);
    });

    it('should return 2 points for correct draw and correct ET winner', () => {
      const pick = { homeGoals: 1, awayGoals: 1, extraTimeWinnerId: 10 };
      const result = { homeGoals: 0, awayGoals: 0, extraTimeWinnerId: 10 };
      expect(calculatePoints(pick, result, 'qf')).toBe(2);
    });

    it('should return 1 point for correct draw but incorrect ET winner', () => {
      const pick = { homeGoals: 1, awayGoals: 1, extraTimeWinnerId: 10 };
      const result = { homeGoals: 0, awayGoals: 0, extraTimeWinnerId: 20 };
      expect(calculatePoints(pick, result, 'sf')).toBe(1);
    });

    it('should return 1 point for correct draw but missing pick ET winner', () => {
      const pick = { homeGoals: 1, awayGoals: 1, extraTimeWinnerId: null };
      const result = { homeGoals: 0, awayGoals: 0, extraTimeWinnerId: 10 };
      expect(calculatePoints(pick, result, 'final')).toBe(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero goals correctly', () => {
      const pick = { homeGoals: 0, awayGoals: 0 };
      const result = { homeGoals: 0, awayGoals: 0 };
      expect(calculatePoints(pick, result, 'group')).toBe(3);
    });

    it('should handle large goal numbers', () => {
      const pick = { homeGoals: 10, awayGoals: 5 };
      const result = { homeGoals: 10, awayGoals: 5 };
      expect(calculatePoints(pick, result, 'group')).toBe(3);
    });
    
    // Testing with negative goals (not expected in UI but logic should be robust)
    it('should return 0 for negative goals as they are not supported', () => {
      const pick = { homeGoals: -1, awayGoals: -2 };
      const result = { homeGoals: -1, awayGoals: -2 };
      expect(calculatePoints(pick, result, 'group')).toBe(0);
    });
  });
});
