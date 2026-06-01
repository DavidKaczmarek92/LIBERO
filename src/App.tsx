import "./App.css";

function App() {
  return (
    <div className="min-h-screen bg-canvas text-text">
      <div className="win" style={{ maxWidth: '1200px', margin: '40px auto' }}>
        <div className="win-bar">
          <div className="lights"><i></i><i></i><i></i></div>
          <div className="win-title">LIBERO</div>
        </div>
        <div className="win-body p-6">
          <div className="app-head mb-6">
            <div className="ttl"><h2>LIBERO — Typowania MŚ 2026</h2></div>
            <div className="tag">MŚ<br/>2026</div>
          </div>

          {/* Placeholder tabs matching mock */}
          <div className="flex gap-2 mb-4 border-b border-border pb-2">
            <button className="tab active">Gracze i typowania</button>
            <button className="tab">Mecze</button>
            <button className="tab">Drabinka</button>
            <button className="tab">Tabela</button>
          </div>

          <p className="text-muted">Placeholder for v1 implementation. See plan Step 3 for full UI.</p>
        </div>
      </div>
    </div>
  );
}

export default App;
