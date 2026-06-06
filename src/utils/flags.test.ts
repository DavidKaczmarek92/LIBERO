import { describe, it, expect } from 'vitest';
import { teamFlag } from './flags';

describe('teamFlag', () => {
  it('should return correct flag for known teams', () => {
    expect(teamFlag('Polska')).toBe('🇵🇱');
    expect(teamFlag('Brazylia')).toBe('🇧🇷');
    expect(teamFlag('Niemcy')).toBe('🇩🇪');
    expect(teamFlag('Francja')).toBe('🇫🇷');
  });

  it('should return fallback flag for unknown teams', () => {
    expect(teamFlag('Nibylandia')).toBe('🏳️');
    expect(teamFlag('Unknown Team')).toBe('🏳️');
  });

  it('should return fallback flag for undefined input', () => {
    expect(teamFlag(undefined)).toBe('🏳️');
  });

  it('should return fallback flag for null input', () => {
    // @ts-ignore - testing runtime behavior for JS compatibility
    expect(teamFlag(null)).toBe('🏳️');
  });

  it('should return fallback flag for empty string', () => {
    expect(teamFlag('')).toBe('🏳️');
  });
});
