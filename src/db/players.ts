// src/db/players.ts
import { getDb } from './database';
import { Player } from '../types';

export async function getPlayers(): Promise<Player[]> {
  const db = await getDb();
  return db.select<Player[]>('SELECT * FROM players ORDER BY name ASC');
}

export async function addPlayer(name: string): Promise<void> {
  const db = await getDb();
  await db.execute('INSERT INTO players (name) VALUES (?)', [name]);
}

export async function deletePlayer(id: number): Promise<void> {
  const db = await getDb();
  await db.execute('DELETE FROM picks WHERE player_id = ?', [id]);
  await db.execute('DELETE FROM tournament_picks WHERE player_id = ?', [id]);
  await db.execute('DELETE FROM players WHERE id = ?', [id]);
}
