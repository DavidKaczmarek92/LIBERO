// src/App.tsx
import { useState, useEffect } from 'react';
import { useTheme } from './hooks/useTheme';
import { ThemeProvider } from './hooks/ThemeContext';
import { getDb } from './db/database';
import { PlayersView } from './features/players/PlayersView';
import { PicksView } from './features/picks/PicksView';
import { ResultsView } from './features/results/ResultsView';
import { BracketView } from './features/bracket/BracketView';
import { StandingsView } from './features/standings/StandingsView';
import { RulesView } from './features/rules/RulesView';

type Tab = 'players' | 'picks' | 'results' | 'bracket' | 'standings' | 'rules';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('players');
  const [dbReady, setDbReady] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    getDb()
      .then(() => setDbReady(true))
      .catch((err) => setDbError(String(err)));
  }, []);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'players', label: 'Gracze' },
    { id: 'picks', label: 'Typy' },
    { id: 'results', label: 'Wyniki' },
    { id: 'bracket', label: 'Drabinka' },
    { id: 'standings', label: 'Tabela' },
    { id: 'rules', label: 'Zasady' },
  ];

  if (dbError) {
    return (
      <div className="min-h-screen bg-gray-900 text-red-400 flex items-center justify-center p-8">
        <div className="bg-gray-800 rounded-xl p-8 border border-red-500/30 max-w-lg w-full">
          <h2 className="text-xl font-bold mb-4">Błąd inicjalizacji bazy danych</h2>
          <pre className="text-sm text-red-300 whitespace-pre-wrap break-all">{dbError}</pre>
        </div>
      </div>
    );
  }

  if (!dbReady) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-400 flex items-center justify-center">
        <p className="text-lg">Ładowanie bazy danych...</p>
      </div>
    );
  }

  const isLight = theme === 'light';

  return (
    <ThemeProvider theme={theme}>
    <div className={`min-h-screen font-sans selection:bg-indigo-500/30 ${isLight ? 'bg-gray-50 text-gray-900' : 'bg-gray-900 text-gray-100'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-10 shadow-md border-b ${isLight ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 512 512" fill="currentColor">
                  <circle cx="256" cy="256" r="256" fill="currentColor"/>
                  <text x="256" y="340" fontFamily="Arial Black, Arial, sans-serif" fontWeight="900" fontSize="280" textAnchor="middle" fill="#4f46e5">L</text>
                </svg>
              </div>
              <h1 className="text-xl font-black tracking-tighter uppercase">Libero <span className="text-indigo-500">MŚ2026</span></h1>
            </div>

            <div className="flex items-center gap-2">
              <nav className="flex gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                      activeTab === tab.id
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : isLight
                          ? 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                          : 'text-gray-400 hover:text-gray-100 hover:bg-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>

              {/* Przełącznik motywu */}
              <button
                onClick={toggle}
                title={isLight ? 'Przełącz na ciemny' : 'Przełącz na jasny'}
                className={`ml-2 p-2 rounded-lg border transition-all ${
                  isLight
                    ? 'border-gray-200 bg-gray-100 hover:bg-gray-200 text-gray-600'
                    : 'border-gray-700 bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                {isLight ? '🌙' : '☀️'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {activeTab === 'players' && <PlayersView />}
          {activeTab === 'picks' && <PicksView />}
          {activeTab === 'results' && <ResultsView />}
          {activeTab === 'bracket' && <BracketView />}
          {activeTab === 'standings' && <StandingsView />}
          {activeTab === 'rules' && <RulesView />}
        </div>
      </main>

      {/* Footer */}
      <footer className={`sticky bottom-0 z-10 w-full px-4 sm:px-6 lg:px-8 py-3 border-t text-center ${isLight ? 'bg-gray-50 border-gray-200' : 'bg-gray-900 border-gray-800'}`}>
        <p className="text-gray-600 text-xs font-medium uppercase tracking-widest">
          &copy; 2026 Libero Law Firm | Typowanie Mistrzostw Świata FIFA
        </p>
      </footer>
    </div>
    </ThemeProvider>
  );
}

export default App;
