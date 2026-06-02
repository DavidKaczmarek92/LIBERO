// src/db/picks.ts
import { getDb } from './database';
import { Pick, TournamentPick } from '../types';
import { calculatePoints } from '../utils/scoring';

export async function getPicks(playerId: number): Promise<Pick[]> {
  const db = await getDb();
  const rows = await db.select<any[]>('SELECT * FROM picks WHERE player_id = ?', [playerId]);
  return rows.map(row => ({
    id: row.id,
    playerId: row.player_id,
    matchId: row.match_id,
    homeGoals: row.home_goals,
    awayGoals: row.away_goals,
    extraTimeWinnerId: row.extra_time_winner_id,
    points: row.points
  }));
}

export async function savePick(
  playerId: number,
  matchId: number,
  homeGoals: number,
  awayGoals: number,
  extraTimeWinnerId: number | null
): Promise<void> {
  const db = await getDb();
  
  // Get match to calculate points immediately if result exists
  const matchRow = await db.select<any[]>('SELECT * FROM matches WHERE id = ?', [matchId]);
  const match = matchRow[0];
  let points = 0;
  if (match && match.home_goals !== null) {
    points = calculatePoints(
      { homeGoals, awayGoals, extraTimeWinnerId },
      { homeGoals: match.home_goals, awayGoals: match.away_goals, extraTimeWinnerId: match.extra_time_winner_id },
      match.phase
    );
  }

  await db.execute(
    `INSERT INTO picks (player_id, match_id, home_goals, away_goals, extra_time_winner_id, points)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(player_id, match_id) DO UPDATE SET
       home_goals = excluded.home_goals,
       away_goals = excluded.away_goals,
       extra_time_winner_id = excluded.extra_time_winner_id,
       points = excluded.points`,
    [playerId, matchId, homeGoals, awayGoals, extraTimeWinnerId, points]
  );
}

export async function deletePick(playerId: number, matchId: number): Promise<void> {
  const db = await getDb();
  await db.execute('DELETE FROM picks WHERE player_id = ? AND match_id = ?', [playerId, matchId]);
}

export async function recalculatePicksForMatch(matchId: number): Promise<void> {
  const db = await getDb();
  const matchRow = await db.select<any[]>('SELECT * FROM matches WHERE id = ?', [matchId]);
  const match = matchRow[0];
  if (!match || match.home_goals === null) return;

  const picks = await db.select<any[]>('SELECT * FROM picks WHERE match_id = ?', [matchId]);
  for (const pick of picks) {
    const pts = calculatePoints(
      { homeGoals: pick.home_goals, awayGoals: pick.away_goals, extraTimeWinnerId: pick.extra_time_winner_id },
      { homeGoals: match.home_goals, awayGoals: match.away_goals, extraTimeWinnerId: match.extra_time_winner_id },
      match.phase
    );
    await db.execute('UPDATE picks SET points = ? WHERE id = ?', [pts, pick.id]);
  }
}

export async function getTournamentPick(playerId: number): Promise<TournamentPick | null> {
  const db = await getDb();
  const rows = await db.select<any[]>('SELECT * FROM tournament_picks WHERE player_id = ?', [playerId]);
  if (rows.length === 0) return null;
  return {
    playerId: rows[0].player_id,
    championTeamId: rows[0].champion_team_id,
    topScorerName: rows[0].top_scorer_name
  };
}

export async function getTournamentResult(): Promise<{ championTeamId: number | null; topScorerName: string } | null> {
  const db = await getDb();
  const rows = await db.select<any[]>('SELECT * FROM tournament_results WHERE id = 1');
  if (rows.length === 0) return null;
  return { championTeamId: rows[0].champion_team_id, topScorerName: rows[0].top_scorer_name ?? '' };
}

export async function saveTournamentResult(championTeamId: number | null, topScorerName: string): Promise<void> {
  const db = await getDb();
  await db.execute(
    `INSERT INTO tournament_results (id, champion_team_id, top_scorer_name)
     VALUES (1, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       champion_team_id = excluded.champion_team_id,
       top_scorer_name = excluded.top_scorer_name`,
    [championTeamId, topScorerName]
  );
}

export async function saveTournamentPick(playerId: number, championTeamId: number | null, topScorerName: string): Promise<void> {
  const db = await getDb();
  await db.execute(
    `INSERT INTO tournament_picks (player_id, champion_team_id, top_scorer_name)
     VALUES (?, ?, ?)
     ON CONFLICT(player_id) DO UPDATE SET
       champion_team_id = excluded.champion_team_id,
       top_scorer_name = excluded.top_scorer_name`,
    [playerId, championTeamId, topScorerName]
  );
}
