// src/db/standings.ts
import { getDb } from './database';
import { Standing } from '../types';
import { calculateStandings } from '../utils/standings';

export async function getStandings(): Promise<Standing[]> {
  const db = await getDb();

  const players = await db.select<any[]>(`
    SELECT
      p.id,
      p.name,
      COALESCE(SUM(pk.points), 0) as total_points
    FROM players p
    LEFT JOIN picks pk ON p.id = pk.player_id
    GROUP BY p.id
  `);

  const resultsRow = await db.select<any[]>('SELECT * FROM tournament_results WHERE id = 1');
  const results = {
    champion_team_id: resultsRow[0]?.champion_team_id ?? null,
    top_scorer_name: resultsRow[0]?.top_scorer_name ?? null,
  };

  const tournamentPicks = await db.select<any[]>(`
    SELECT tp.*, t.name as champion_team_name
    FROM tournament_picks tp
    LEFT JOIN teams t ON tp.champion_team_id = t.id
  `);

  return calculateStandings(players, tournamentPicks, results);
}
