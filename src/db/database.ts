// src/db/database.ts
import Database from '@tauri-apps/plugin-sql';

let _db: Database | null = null;
let _initPromise: Promise<Database> | null = null;

export async function getDb(): Promise<Database> {
  if (_db) return _db;
  if (_initPromise) return _initPromise;
  _initPromise = Database.load('sqlite:libero.db').then(async (db) => {
    await db.execute('PRAGMA foreign_keys = ON');
    await runMigrations(db);
    _db = db;
    return db;
  });
  return _initPromise;
}

const CREATE_PLAYERS_SQL = `
CREATE TABLE IF NOT EXISTS players (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);`;

const CREATE_TEAMS_SQL = `
CREATE TABLE IF NOT EXISTS teams (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  group_label TEXT NOT NULL
);`;

const CREATE_MATCHES_SQL = `
CREATE TABLE IF NOT EXISTS matches (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  phase                 TEXT NOT NULL,
  group_label           TEXT,
  home_team_id          INTEGER REFERENCES teams(id),
  away_team_id          INTEGER REFERENCES teams(id),
  home_goals            INTEGER,
  away_goals            INTEGER,
  extra_time_winner_id  INTEGER REFERENCES teams(id),
  match_date            TEXT,
  match_order           INTEGER NOT NULL
);`;

const CREATE_PICKS_SQL = `
CREATE TABLE IF NOT EXISTS picks (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id             INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  match_id              INTEGER NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  home_goals            INTEGER NOT NULL,
  away_goals            INTEGER NOT NULL,
  extra_time_winner_id  INTEGER REFERENCES teams(id),
  points                INTEGER NOT NULL DEFAULT 0,
  UNIQUE(player_id, match_id)
);`;

const CREATE_TOURNAMENT_PICKS_SQL = `
CREATE TABLE IF NOT EXISTS tournament_picks (
  player_id          INTEGER PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  champion_team_id   INTEGER REFERENCES teams(id),
  top_scorer_name    TEXT
);`;

const CREATE_TOURNAMENT_RESULTS_SQL = `
CREATE TABLE IF NOT EXISTS tournament_results (
  id                INTEGER PRIMARY KEY CHECK (id = 1),
  champion_team_id  INTEGER REFERENCES teams(id),
  top_scorer_name   TEXT
);`;

async function runMigrations(db: Database): Promise<void> {
  await db.execute(CREATE_PLAYERS_SQL);
  await db.execute(CREATE_TEAMS_SQL);
  await db.execute(CREATE_MATCHES_SQL);
  await db.execute(CREATE_PICKS_SQL);
  await db.execute(CREATE_TOURNAMENT_PICKS_SQL);
  await db.execute(CREATE_TOURNAMENT_RESULTS_SQL);
  await seedIfEmpty(db);
  await migrateTeamNames(db);
}

const TEAM_NAME_MAP: Record<string, string> = {
  'Mexico': 'Meksyk',
  'South Africa': 'RPA',
  'South Korea': 'Korea Południowa',
  'Czechia': 'Czechy',
  'Canada': 'Kanada',
  'Bosnia and Herzegovina': 'Bośnia i Hercegowina',
  'Qatar': 'Katar',
  'Switzerland': 'Szwajcaria',
  'Brazil': 'Brazylia',
  'Morocco': 'Maroko',
  'Scotland': 'Szkocja',
  'Paraguay': 'Paragwaj',
  'Turkey': 'Turcja',
  'Germany': 'Niemcy',
  'Curacao': 'Curaçao',
  'Ivory Coast': 'Wybrzeże Kości Słoniowej',
  'Ecuador': 'Ekwador',
  'Netherlands': 'Holandia',
  'Japan': 'Japonia',
  'Sweden': 'Szwecja',
  'Tunisia': 'Tunezja',
  'Belgium': 'Belgia',
  'Egypt': 'Egipt',
  'New Zealand': 'Nowa Zelandia',
  'Spain': 'Hiszpania',
  'Cape Verde': 'Wyspy Zielonego Przylądka',
  'Saudi Arabia': 'Arabia Saudyjska',
  'Uruguay': 'Urugwaj',
  'France': 'Francja',
  'Iraq': 'Irak',
  'Norway': 'Norwegia',
  'Argentina': 'Argentyna',
  'Algeria': 'Algieria',
  'Jordan': 'Jordania',
  'Portugal': 'Portugalia',
  'DR Congo': 'DR Kongo',
  'Colombia': 'Kolumbia',
  'England': 'Anglia',
  'Croatia': 'Chorwacja',
};

async function migrateTeamNames(db: Database): Promise<void> {
  for (const [oldName, newName] of Object.entries(TEAM_NAME_MAP)) {
    await db.execute('UPDATE teams SET name = ? WHERE name = ?', [newName, oldName]);
  }
}

import { seedTeams, seedGroupMatches, seedKnockoutSlots } from './seed';

async function seedIfEmpty(db: Database): Promise<void> {
  const rows = await db.select<[{ count: number }]>('SELECT COUNT(*) as count FROM teams');
  if (rows[0].count === 0) {
    await seedTeams(db);
    await seedGroupMatches(db);
    await seedKnockoutSlots(db);
  }
}
