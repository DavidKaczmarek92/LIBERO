// src/db/matches.ts
import { getDb } from './database';
import { Match, Phase } from '../types';

export async function getMatches(): Promise<Match[]> {
  const db = await getDb();
  const rows = await db.select<any[]>('SELECT * FROM matches ORDER BY match_order ASC');
  return rows.map(row => ({
    id: row.id,
    phase: row.phase as Phase,
    groupLabel: row.group_label,
    homeTeamId: row.home_team_id,
    awayTeamId: row.away_team_id,
    homeGoals: row.home_goals,
    awayGoals: row.away_goals,
    extraTimeWinnerId: row.extra_time_winner_id,
    matchDate: row.match_date,
    matchOrder: row.match_order
  }));
}

export async function updateMatchResult(
  matchId: number, 
  homeGoals: number | null, 
  awayGoals: number | null, 
  extraTimeWinnerId: number | null
): Promise<void> {
  const db = await getDb();
  await db.execute(
    'UPDATE matches SET home_goals = ?, away_goals = ?, extra_time_winner_id = ? WHERE id = ?',
    [homeGoals, awayGoals, extraTimeWinnerId, matchId]
  );
  
  if (homeGoals !== null && awayGoals !== null) {
    await recalculatePicksForMatch(matchId);
  }
}

import { recalculatePicksForMatch } from './picks';

export async function updateMatchTeams(matchId: number, homeTeamId: number | null, awayTeamId: number | null): Promise<void> {
  const db = await getDb();
  await db.execute(
    'UPDATE matches SET home_team_id = ?, away_team_id = ? WHERE id = ?',
    [homeTeamId, awayTeamId, matchId]
  );
}

export async function getTeams() {
  const db = await getDb();
  return db.select<any[]>('SELECT * FROM teams ORDER BY name ASC');
}
