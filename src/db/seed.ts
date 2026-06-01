// src/db/seed.ts
import Database from '@tauri-apps/plugin-sql';

export const TEAMS_SEED = [
  { name: 'Mexico', groupLabel: 'A' },
  { name: 'South Africa', groupLabel: 'A' },
  { name: 'South Korea', groupLabel: 'A' },
  { name: 'Czechia', groupLabel: 'A' },
  { name: 'Canada', groupLabel: 'B' },
  { name: 'Bosnia and Herzegovina', groupLabel: 'B' },
  { name: 'Qatar', groupLabel: 'B' },
  { name: 'Switzerland', groupLabel: 'B' },
  { name: 'Brazil', groupLabel: 'C' },
  { name: 'Morocco', groupLabel: 'C' },
  { name: 'Haiti', groupLabel: 'C' },
  { name: 'Scotland', groupLabel: 'C' },
  { name: 'USA', groupLabel: 'D' },
  { name: 'Paraguay', groupLabel: 'D' },
  { name: 'Australia', groupLabel: 'D' },
  { name: 'Turkey', groupLabel: 'D' },
  { name: 'Germany', groupLabel: 'E' },
  { name: 'Curacao', groupLabel: 'E' },
  { name: 'Ivory Coast', groupLabel: 'E' },
  { name: 'Ecuador', groupLabel: 'E' },
  { name: 'Netherlands', groupLabel: 'F' },
  { name: 'Japan', groupLabel: 'F' },
  { name: 'Sweden', groupLabel: 'F' },
  { name: 'Tunisia', groupLabel: 'F' },
  { name: 'Belgium', groupLabel: 'G' },
  { name: 'Egypt', groupLabel: 'G' },
  { name: 'Iran', groupLabel: 'G' },
  { name: 'New Zealand', groupLabel: 'G' },
  { name: 'Spain', groupLabel: 'H' },
  { name: 'Cape Verde', groupLabel: 'H' },
  { name: 'Saudi Arabia', groupLabel: 'H' },
  { name: 'Uruguay', groupLabel: 'H' },
  { name: 'France', groupLabel: 'I' },
  { name: 'Senegal', groupLabel: 'I' },
  { name: 'Iraq', groupLabel: 'I' },
  { name: 'Norway', groupLabel: 'I' },
  { name: 'Argentina', groupLabel: 'J' },
  { name: 'Algeria', groupLabel: 'J' },
  { name: 'Austria', groupLabel: 'J' },
  { name: 'Jordan', groupLabel: 'J' },
  { name: 'Portugal', groupLabel: 'K' },
  { name: 'DR Congo', groupLabel: 'K' },
  { name: 'Uzbekistan', groupLabel: 'K' },
  { name: 'Colombia', groupLabel: 'K' },
  { name: 'England', groupLabel: 'L' },
  { name: 'Croatia', groupLabel: 'L' },
  { name: 'Ghana', groupLabel: 'L' },
  { name: 'Panama', groupLabel: 'L' },
];

export async function seedTeams(db: Database) {
  for (const team of TEAMS_SEED) {
    await db.execute('INSERT INTO teams (name, group_label) VALUES (?, ?)', [team.name, team.groupLabel]);
  }
}

export async function seedGroupMatches(db: Database) {
  const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  let matchOrder = 1;

  for (const group of groups) {
    const teams = await db.select<{ id: number }[]>('SELECT id FROM teams WHERE group_label = ? ORDER BY id', [group]);
    
    const pairings = [
      [teams[0].id, teams[1].id],
      [teams[2].id, teams[3].id],
      [teams[0].id, teams[2].id],
      [teams[1].id, teams[3].id],
      [teams[0].id, teams[3].id],
      [teams[1].id, teams[2].id],
    ];

    for (const [home, away] of pairings) {
      await db.execute(
        'INSERT INTO matches (phase, group_label, home_team_id, away_team_id, match_order) VALUES (?, ?, ?, ?, ?)',
        ['group', group, home, away, matchOrder++]
      );
    }
  }
}

export async function seedKnockoutSlots(db: Database) {
  const phases: { phase: string, count: number }[] = [
    { phase: 'r32', count: 16 },
    { phase: 'r16', count: 8 },
    { phase: 'qf', count: 4 },
    { phase: 'sf', count: 2 },
    { phase: 'final', count: 2 }, // Final + 3rd place
  ];

  let matchOrder = 100;
  for (const p of phases) {
    for (let i = 0; i < p.count; i++) {
      await db.execute(
        'INSERT INTO matches (phase, home_team_id, away_team_id, match_order) VALUES (?, NULL, NULL, ?)',
        [p.phase, matchOrder++]
      );
    }
  }
}
