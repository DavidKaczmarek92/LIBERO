// src/App.tsx
import { useState, useEffect } from 'react';
import { useTheme } from './hooks/useTheme';
import { getDb } from './db/database';
import { PlayersView } from './features/players/PlayersView';
import { PicksView } from './features/picks/PicksView';
import { ResultsView } from './features/results/ResultsView';
import { BracketView } from './features/bracket/BracketView';
import { StandingsView } from './features/standings/StandingsView';

type Tab = 'players' | 'picks' | 'results' | 'bracket' | 'standings';

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
  ];

  if (dbError) {
    return (
      <div className="min-h-screen bg-slate-900 text-red-400 flex items-center justify-center p-8">
        <div className="bg-slate-800 rounded-xl p-8 border border-red-500/30 max-w-lg w-full">
          <h2 className="text-xl font-bold mb-4">Błąd inicjalizacji bazy danych</h2>
          <pre className="text-sm text-red-300 whitespace-pre-wrap break-all">{dbError}</pre>
        </div>
      </div>
    );
  }

  if (!dbReady) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-400 flex items-center justify-center">
        <p className="text-lg">Ładowanie bazy danych...</p>
      </div>
    );
  }

  const isLight = theme === 'light';

  return (
    <div className={`min-h-screen font-sans selection:bg-indigo-500/30 ${isLight ? 'bg-slate-50 text-slate-900' : 'bg-slate-900 text-slate-200'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-10 shadow-md border-b ${isLight ? 'bg-white border-slate-200' : 'bg-slate-800 border-slate-700'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                        : isLight
                          ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
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
                    ? 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-600'
                    : 'border-slate-700 bg-slate-700/50 hover:bg-slate-700 text-slate-300'
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
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-12 border-t border-slate-800 text-center">
        <p className="text-slate-600 text-xs font-medium uppercase tracking-widest">
          &copy; 2026 Libero Law Firm | Typowanie Mistrzostw Świata FIFA
        </p>
      </footer>
    </div>
  );
}

export default App;
