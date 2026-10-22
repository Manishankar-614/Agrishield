import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AskDocsView } from './components/AskDocsView';
import { BenchmarkView } from './components/BenchmarkView';
import { FailureAnalysisView } from './components/FailureAnalysisView';
import { DocumentExplorerView } from './components/DocumentExplorerView';
import { Shield } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'ask' | 'benchmark' | 'failures' | 'docs'>('ask');
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
        backendHealthy={backendHealthy}
      />

      <main style={{ flex: 1, paddingBottom: '40px' }}>
        {activeTab === 'ask' && <AskDocsView />}
        {activeTab === 'benchmark' && <BenchmarkView />}
        {activeTab === 'failures' && <FailureAnalysisView />}
        {activeTab === 'docs' && <DocumentExplorerView />}
      </main>

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
