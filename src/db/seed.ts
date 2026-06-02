// src/db/seed.ts
import Database from '@tauri-apps/plugin-sql';

export const TEAMS_SEED = [
  { name: 'Meksyk', groupLabel: 'A' },
  { name: 'RPA', groupLabel: 'A' },
  { name: 'Korea Południowa', groupLabel: 'A' },
  { name: 'Czechy', groupLabel: 'A' },
  { name: 'Kanada', groupLabel: 'B' },
  { name: 'Bośnia i Hercegowina', groupLabel: 'B' },
  { name: 'Katar', groupLabel: 'B' },
  { name: 'Szwajcaria', groupLabel: 'B' },
  { name: 'Brazylia', groupLabel: 'C' },
  { name: 'Maroko', groupLabel: 'C' },
  { name: 'Haiti', groupLabel: 'C' },
  { name: 'Szkocja', groupLabel: 'C' },
  { name: 'USA', groupLabel: 'D' },
  { name: 'Paragwaj', groupLabel: 'D' },
  { name: 'Australia', groupLabel: 'D' },
  { name: 'Turcja', groupLabel: 'D' },
  { name: 'Niemcy', groupLabel: 'E' },
  { name: 'Curaçao', groupLabel: 'E' },
  { name: 'Wybrzeże Kości Słoniowej', groupLabel: 'E' },
  { name: 'Ekwador', groupLabel: 'E' },
  { name: 'Holandia', groupLabel: 'F' },
  { name: 'Japonia', groupLabel: 'F' },
  { name: 'Szwecja', groupLabel: 'F' },
  { name: 'Tunezja', groupLabel: 'F' },
  { name: 'Belgia', groupLabel: 'G' },
  { name: 'Egipt', groupLabel: 'G' },
  { name: 'Iran', groupLabel: 'G' },
  { name: 'Nowa Zelandia', groupLabel: 'G' },
  { name: 'Hiszpania', groupLabel: 'H' },
  { name: 'Wyspy Zielonego Przylądka', groupLabel: 'H' },
  { name: 'Arabia Saudyjska', groupLabel: 'H' },
  { name: 'Urugwaj', groupLabel: 'H' },
  { name: 'Francja', groupLabel: 'I' },
  { name: 'Senegal', groupLabel: 'I' },
  { name: 'Irak', groupLabel: 'I' },
  { name: 'Norwegia', groupLabel: 'I' },
  { name: 'Argentyna', groupLabel: 'J' },
  { name: 'Algieria', groupLabel: 'J' },
  { name: 'Austria', groupLabel: 'J' },
  { name: 'Jordania', groupLabel: 'J' },
  { name: 'Portugalia', groupLabel: 'K' },
  { name: 'DR Kongo', groupLabel: 'K' },
  { name: 'Uzbekistan', groupLabel: 'K' },
  { name: 'Kolumbia', groupLabel: 'K' },
  { name: 'Anglia', groupLabel: 'L' },
  { name: 'Chorwacja', groupLabel: 'L' },
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
