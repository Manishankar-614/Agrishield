import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { ChatView } from './components/ChatView';
import { KnowledgeBaseView } from './components/KnowledgeBaseView';
import { BenchmarkView } from './components/BenchmarkView';

export function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ask' | 'docs' | 'benchmark'>('dashboard');
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
        setActiveTab={setActiveTab}
        backendHealthy={backendHealthy}
      />

      {/* Main View Area */}
      <main style={{ flex: 1, minHeight: '100vh', overflowY: 'auto' }}>
        {activeTab === 'dashboard' && <DashboardView onNavigate={(t) => setActiveTab(t)} />}
        {activeTab === 'ask' && <ChatView />}
        {activeTab === 'docs' && <KnowledgeBaseView />}
        {activeTab === 'benchmark' && <BenchmarkView />}
      </main>
    </div>
  );
}

export default App;
