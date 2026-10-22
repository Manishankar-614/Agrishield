import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AskDocsView } from './components/AskDocsView';
import { BenchmarkView } from './components/BenchmarkView';
import { FailureAnalysisView } from './components/FailureAnalysisView';
import { DocumentExplorerView } from './components/DocumentExplorerView';

export function App() {
  const [activeTab, setActiveTab] = useState<'ask' | 'benchmark' | 'failures' | 'docs'>('ask');
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('groq_api_key') || '');
  const [backendHealthy, setBackendHealthy] = useState<boolean>(false);

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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={(t) => setActiveTab(t as any)}
        apiKey={apiKey}
        setApiKey={setApiKey}
        backendHealthy={backendHealthy}
      />

      <main style={{ flex: 1, paddingBottom: '40px' }}>
        {activeTab === 'ask' && <AskDocsView apiKey={apiKey} />}
        {activeTab === 'benchmark' && <BenchmarkView apiKey={apiKey} />}
        {activeTab === 'failures' && <FailureAnalysisView />}
        {activeTab === 'docs' && <DocumentExplorerView />}
      </main>

      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: '20px 24px',
        background: 'rgba(7, 13, 12, 0.9)',
        fontSize: '0.8rem',
        color: 'var(--text-dim)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '1350px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <strong>AgriShield (KrishiKavach)</strong> — Global Academy of Technology • 3-Hour RAG Challenge 2026
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
