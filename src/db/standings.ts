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

  let currentRank = 1;
  let lastPoints = -1;

  return players.map((p, index) => {
    if (p.total_points !== lastPoints) {
      currentRank = index + 1;
    }
    lastPoints = p.total_points;

    return {
      player: { id: p.id, name: p.name },
      totalPoints: p.total_points,
      rank: currentRank,
      championCorrect: false, // v1: logic for checking this can be added later
      topScorerCorrect: false
    };
  });
}
