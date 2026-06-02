// src/db/standings.ts
import { getDb } from './database';
import { Standing } from '../types';

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
    ORDER BY total_points DESC, p.name ASC
  `);

  const results = await db.select<any[]>('SELECT * FROM tournament_results WHERE id = 1');
  const actualChampionId: number | null = results[0]?.champion_team_id ?? null;
  const actualTopScorer: string | null = results[0]?.top_scorer_name ?? null;

  const tournamentPicks = await db.select<any[]>(`
    SELECT tp.*, t.name as champion_team_name
    FROM tournament_picks tp
    LEFT JOIN teams t ON tp.champion_team_id = t.id
  `);

  let currentRank = 1;
  let lastPoints = -1;

  return players.map((p, index) => {
    if (p.total_points !== lastPoints) {
      currentRank = index + 1;
    }
    lastPoints = p.total_points;

    const pick = tournamentPicks.find(tp => tp.player_id === p.id);
    const championCorrect = actualChampionId !== null && pick?.champion_team_id === actualChampionId;
    const topScorerCorrect = actualTopScorer !== null && actualTopScorer.trim() !== '' &&
      pick?.top_scorer_name?.trim().toLowerCase() === actualTopScorer.trim().toLowerCase();

    return {
      player: { id: p.id, name: p.name },
      totalPoints: p.total_points,
      rank: currentRank,
      championCorrect,
      topScorerCorrect,
      championPickName: pick?.champion_team_name ?? null,
      topScorerPickName: pick?.top_scorer_name ?? null,
    };
  });
}
