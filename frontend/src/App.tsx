import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AskDocsView } from './components/AskDocsView';
import { BenchmarkView } from './components/BenchmarkView';
import { FailureAnalysisView } from './components/FailureAnalysisView';
import { DocumentExplorerView } from './components/DocumentExplorerView';
import { Key, ExternalLink, Check, Shield } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'ask' | 'benchmark' | 'failures' | 'docs'>('ask');
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('groq_api_key') || '');
  const [tempKey, setTempKey] = useState<string>('');
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [backendHealthy, setBackendHealthy] = useState<boolean>(false);
  const [testStatus, setTestStatus] = useState<string | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/health');
        if (res.ok) {
          setBackendHealthy(true);
        } else {
          setBackendHealthy(false);
        }
      } catch {
        setBackendHealthy(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenKeyModal = () => {
    setTempKey(apiKey);
    setTestStatus(null);
    setShowKeyModal(true);
  };

  const handleSaveKey = () => {
    const cleanKey = tempKey.trim();
    setApiKey(cleanKey);
    localStorage.setItem('groq_api_key', cleanKey);
    setShowKeyModal(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={(t) => setActiveTab(t as any)}
        apiKey={apiKey}
        onOpenKeyModal={handleOpenKeyModal}
        backendHealthy={backendHealthy}
      />

      <main style={{ flex: 1, paddingBottom: '40px' }}>
        {activeTab === 'ask' && <AskDocsView apiKey={apiKey} onOpenKeyModal={handleOpenKeyModal} />}
        {activeTab === 'benchmark' && <BenchmarkView apiKey={apiKey} />}
        {activeTab === 'failures' && <FailureAnalysisView />}
        {activeTab === 'docs' && <DocumentExplorerView />}
      </main>

      {/* Groq Key Configuration Modal */}
      {showKeyModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-panel animate-fade-in" style={{ maxWidth: '520px', width: '100%', padding: '28px', border: '1px solid var(--border-focus)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#34d399'
              }}>
                <Key size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', margin: 0, color: '#fff' }}>Configure Groq API Key</h2>
                <span style={{ fontSize: '0.78rem', color: '#6ee7b7' }}>100% Free • Sub-second Llama 3.3 70B Inference</span>
              </div>
            </div>

            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '16px' }}>
              AgriShield's retrieval (BM25 + SentenceTransformers) runs completely locally on your CPU/GPU for free. 
              The Groq API is only used to synthesize the final grounded answer in &lt; 500ms.
            </p>

            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '18px' }}>
              <span style={{ fontSize: '0.78rem', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                How to get your free key:
              </span>
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noreferrer"
                style={{ color: '#34d399', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none', fontWeight: 600 }}
              >
                1. Open console.groq.com/keys <ExternalLink size={13} />
              </a>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                2. Click "Create API Key", copy the key (starts with <code>gsk_...</code>), and paste below.
              </div>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase' }}>
                Groq API Key
              </label>
              <input
                id="groq-api-key-input"
                type="password"
                placeholder="gsk_..."
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: 'rgba(0,0,0,0.5)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.95rem',
                  fontFamily: 'var(--font-mono)',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--border-focus)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              />
            </div>

            {testStatus && (
              <div style={{ fontSize: '0.8rem', color: '#a7f3d0', marginBottom: '16px' }}>
                {testStatus}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="btn-secondary"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSaveKey}
                className="btn-primary"
              >
                <Check size={16} />
                Save & Activate Key
              </button>
            </div>
          </div>
        </div>
      )}

      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: '20px 24px',
        background: 'rgba(5, 11, 10, 0.95)',
        fontSize: '0.8rem',
        color: 'var(--text-dim)',
      }}>
        <div style={{ maxWidth: '1350px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={16} color="#10b981" />
            <span><strong>AgriShield (KrishiKavach)</strong> — Global Academy of Technology • Hack Hour 2026</span>
          </div>
          <div>
            Powered by <strong>BM25 + SentenceTransformers + Groq Llama 3.3 70B</strong> • React + TypeScript
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
