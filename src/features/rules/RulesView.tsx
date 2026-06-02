// src/features/rules/RulesView.tsx
import React from 'react';
import { useThemeContext } from '../../hooks/ThemeContext';

export const RulesView: React.FC = () => {
  const { isLight } = useThemeContext();

  const cardClass = `rounded-xl p-6 shadow-md border ${isLight ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`;
  const headingClass = `text-lg font-bold mb-4 ${isLight ? 'text-gray-900' : 'text-white'}`;
  const textClass = `text-sm ${isLight ? 'text-gray-700' : 'text-gray-300'}`;
  const badgeClass = `inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-600 text-white text-sm font-bold mr-3 flex-shrink-0`;

  return (
    <div className="space-y-6">
      {/* Jak zacząć */}
      <div className={cardClass}>
        <h2 className={headingClass}>🚀 Jak zacząć?</h2>
        <ol className="space-y-3">
          {[
            { step: '1', text: 'Przejdź do zakładki Gracze i dodaj wszystkich uczestników typowania.' },
            { step: '2', text: 'Każdy gracz przechodzi do zakładki Typy i składa swoje typy na mecze fazy grupowej.' },
            { step: '3', text: 'Po rozegraniu meczów admin aktualizuje wyniki w zakładce Wyniki.' },
            { step: '4', text: 'Śledź postępy turnieju w zakładce Drabinka (faza pucharowa).' },
            { step: '5', text: 'Sprawdzaj aktualny ranking w zakładce Tabela.' },
          ].map(({ step, text }) => (
            <li key={step} className={`flex items-start ${textClass}`}>
              <span className={badgeClass}>{step}</span>
              <span className="mt-0.5">{text}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Opis zakładek */}
      <div className={cardClass}>
        <h2 className={headingClass}>📋 Opis zakładek</h2>
        <div className="space-y-4">
          {[
            {
              icon: '👥',
              name: 'Gracze',
              desc: 'Zarządzanie uczestnikami typowania. Możesz dodawać nowych graczy wpisując ich imię i nazwisko, a także usuwać istniejących. Każdy gracz musi być dodany przed złożeniem typów.',
            },
            {
              icon: '🎯',
              name: 'Typy',
              desc: 'Składanie zakładów na mecze. Wybierz gracza, a następnie wpisz przewidywane wyniki meczów fazy grupowej oraz typuj zwycięzców w fazie pucharowej. Typy można składać i edytować w dowolnym momencie — przed meczem, w trakcie i po jego zakończeniu.',
            },
            {
              icon: '⚽',
              name: 'Wyniki',
              desc: 'Aktualizacja rzeczywistych wyników meczów. Sekcja dla administratora — po rozegraniu meczu wpisz faktyczny wynik, który zostanie porównany z typami graczy i przeliczony na punkty.',
            },
            {
              icon: '🏆',
              name: 'Drabinka',
              desc: 'Wizualizacja fazy pucharowej turnieju. Pokazuje aktualne pary meczów od 1/8 finału aż do finału. Drabinka aktualizuje się ręcznie — admin wprowadza wyniki, które są podstawą do ustalania par w kolejnych rundach.',
            },
            {
              icon: '📊',
              name: 'Tabela',
              desc: 'Ranking wszystkich graczy posortowany według zdobytych punktów. Widać tu kto prowadzi w typowaniu i ile punktów zdobył każdy uczestnik.',
            },
          ].map(({ icon, name, desc }) => (
            <div key={name} className={`flex gap-3 p-3 rounded-lg ${isLight ? 'bg-gray-50' : 'bg-gray-700/50'}`}>
              <span className="text-2xl flex-shrink-0">{icon}</span>
              <div>
                <p className={`font-semibold mb-1 ${isLight ? 'text-gray-900' : 'text-white'}`}>{name}</p>
                <p className={textClass}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zasady punktacji */}
      <div className={cardClass}>
        <h2 className={headingClass}>🏅 Zasady punktacji</h2>
        <p className={`mb-4 ${textClass}`}>
          Punkty przyznawane są za każdy mecz fazy grupowej na podstawie porównania typowanego wyniku z rzeczywistym:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${isLight ? 'border-gray-200' : 'border-gray-600'}`}>
                <th className={`text-left py-2 pr-4 font-semibold ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>Trafienie</th>
                <th className={`text-center py-2 px-4 font-semibold ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>Punkty</th>
                <th className={`text-left py-2 pl-4 font-semibold ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>Opis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/30">
              {[
                { hit: '🎯 Dokładny wynik', pts: '3', desc: 'Trafiony dokładny wynik meczu (np. 2:1)' },
                { hit: '☑️ Zwycięzca', pts: '1', desc: 'Trafiony tylko zwycięzca meczu lub remis' },
                { hit: '❌ Pudło', pts: '0', desc: 'Błędny typ — zły zwycięzca lub brak remisu' },
              ].map(({ hit, pts, desc }) => (
                <tr key={hit}>
                  <td className={`py-2.5 pr-4 font-medium ${isLight ? 'text-gray-800' : 'text-gray-200'}`}>{hit}</td>
                  <td className="py-2.5 px-4 text-center">
                    <span className="inline-block bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{pts} pkt</span>
                  </td>
                  <td className={`py-2.5 pl-4 ${textClass}`}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={`mt-4 text-xs italic ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
          * W fazie pucharowej punkty mogą być przyznawane za trafienie awansującego zespołu.
        </p>
      </div>
    </div>
  );
};
