import { describe, it, expect } from 'vitest';
import { calculateStandings, RawPlayerPoints, RawTournamentPick, TournamentResults } from './standings';

describe('calculateStandings', () => {
  const players: RawPlayerPoints[] = [
    { id: 1, name: 'Alice', total_points: 10 },
    { id: 2, name: 'Bob', total_points: 15 },
    { id: 3, name: 'Charlie', total_points: 10 },
    { id: 4, name: 'David', total_points: 5 },
  ];

  const tournamentPicks: RawTournamentPick[] = [
    { player_id: 1, champion_team_id: 101, top_scorer_name: 'Lewandowski', champion_team_name: 'Polska' },
    { player_id: 2, champion_team_id: 102, top_scorer_name: 'Messi', champion_team_name: 'Argentyna' },
    { player_id: 3, champion_team_id: 101, top_scorer_name: 'Lewandowski', champion_team_name: 'Polska' },
  ];

  const results: TournamentResults = {
    champion_team_id: 102,
    top_scorer_name: 'messi ' // testing case insensitivity and trimming
  };

  it('should sort players by points (desc) and name (asc)', () => {
    const standings = calculateStandings(players, [], { champion_team_id: null, top_scorer_name: null });
    
    expect(standings[0].player.name).toBe('Bob');     // 15 pts
    expect(standings[1].player.name).toBe('Alice');   // 10 pts (Alice < Charlie)
    expect(standings[2].player.name).toBe('Charlie'); // 10 pts
    expect(standings[3].player.name).toBe('David');   // 5 pts
  });

  it('should calculate ranks correctly including ties', () => {
    const standings = calculateStandings(players, [], { champion_team_id: null, top_scorer_name: null });
    
    expect(standings[0].rank).toBe(1); // Bob
    expect(standings[1].rank).toBe(2); // Alice
    expect(standings[2].rank).toBe(2); // Charlie (tie)
    expect(standings[3].rank).toBe(4); // David (skip 3)
  });

  it('should correctly identify champion pick', () => {
    const standings = calculateStandings(players, tournamentPicks, results);
    
    const bob = standings.find(s => s.player.name === 'Bob');
    const alice = standings.find(s => s.player.name === 'Alice');
    
    expect(bob?.championCorrect).toBe(true);  // Bob picked 102
    expect(alice?.championCorrect).toBe(false); // Alice picked 101
  });

  it('should correctly identify top scorer pick (case insensitive and trimmed)', () => {
    const standings = calculateStandings(players, tournamentPicks, results);
    
    const bob = standings.find(s => s.player.name === 'Bob');
    const alice = standings.find(s => s.player.name === 'Alice');
    
    expect(bob?.topScorerCorrect).toBe(true);  // Bob picked 'Messi', result is 'messi '
    expect(alice?.topScorerCorrect).toBe(false); // Alice picked 'Lewandowski'
  });

  it('should handle missing tournament picks', () => {
    const standings = calculateStandings(players, tournamentPicks, results);
    const david = standings.find(s => s.player.name === 'David');
    
    expect(david?.championCorrect).toBe(false);
    expect(david?.topScorerCorrect).toBe(false);
    expect(david?.championPickName).toBe(null);
  });
});
