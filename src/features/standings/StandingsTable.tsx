import { useTranslation } from "react-i18next";
import { useTournamentStore } from "../../store/tournamentStore";

export default function StandingsTable() {
  const { t } = useTranslation();
  const { players, matchPicks } = useTournamentStore();

  const standings = players
    .map((p) => {
      const picks = matchPicks[p.id] || [];
      const mpPoints = picks.reduce((sum, pk) => sum + (pk.points || 0), 0);
      // tournament picks not scored in v1
      const total = mpPoints;
      return { player: p, points: total };
    })
    .sort((a, b) => b.points - a.points);

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm" data-testid="standings-table">
      <div className="mb-6 px-2">
        <h3 className="font-disp text-xl font-bold">{t("standings.title")}</h3>
        <p className="text-xs text-text-faint mt-1">Ranking uczestników na podstawie trafnych typów.</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-[10px] font-extrabold text-text-faint uppercase tracking-wider border-b border-border">
              <th className="px-4 py-3 w-16 text-center">{t("standings.rank")}</th>
              <th className="px-4 py-3">{t("standings.player")}</th>
              <th className="px-4 py-3 text-right">{t("standings.points")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {standings.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center text-text-muted italic">
                  {t("players.empty")}
                </td>
              </tr>
            ) : (
              standings.map((s, idx) => {
                const isFirst = idx === 0;
                const isSecond = idx === 1;
                const isThird = idx === 2;
                
                return (
                  <tr 
                    key={s.player.id} 
                    className={`hover:bg-surface-2 transition-colors ${isFirst ? 'bg-amber-soft/10' : ''}`}
                    data-testid={`standing-row-${s.player.id}`}
                  >
                    <td className="px-4 py-4 text-center">
                      <div className={`
                        w-8 h-8 mx-auto flex items-center justify-center rounded-lg font-disp font-bold text-sm
                        ${isFirst ? 'bg-amber text-white shadow-md shadow-amber/20' : 
                          isSecond ? 'bg-slate-300 text-slate-700' :
                          isThird ? 'bg-orange-300 text-orange-800' :
                          'bg-inset text-text-muted'}
                      `}>
                        {idx + 1}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${isFirst ? 'bg-amber-soft text-amber-fg' : 'bg-surface-3 text-text-faint'}`}>
                          {s.player.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className={`font-bold text-sm ${isFirst ? 'text-text' : 'text-text-muted'}`}>
                            {s.player.name}
                          </div>
                          {idx > 0 && standings[idx - 1].points === s.points && (
                            <span className="text-[10px] text-text-faint uppercase font-bold">
                              {t("standings.exAequo")}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className={`text-base font-extrabold ${isFirst ? 'text-blue' : 'text-text'}`}>
                          {s.points}
                        </span>
                        <span className="text-[9px] font-bold text-text-faint uppercase tracking-tighter">Punktów</span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
