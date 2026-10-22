import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { AskDocsView } from './components/AskDocsView';
import { UploadDocView } from './components/UploadDocView';
import { BenchmarkView } from './components/BenchmarkView';
import { FailureAnalysisView } from './components/FailureAnalysisView';
import { DocumentExplorerView } from './components/DocumentExplorerView';

export function App() {
  const [activeTab, setActiveTab] = useState<'ask' | 'upload' | 'benchmark' | 'failures' | 'docs'>('ask');
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
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-app)' }}>
      {/* Warm Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(t) => setActiveTab(t as any)}
        backendHealthy={backendHealthy}
      />

      {/* Main View Area */}
      <main style={{ flex: 1, minHeight: '100vh', overflowY: 'auto' }}>
        {activeTab === 'ask' && <AskDocsView />}
        {activeTab === 'upload' && <UploadDocView />}
        {activeTab === 'benchmark' && <BenchmarkView />}
        {activeTab === 'failures' && <FailureAnalysisView />}
        {activeTab === 'docs' && <DocumentExplorerView />}
      </main>
    </div>
  );
}

export default App;
