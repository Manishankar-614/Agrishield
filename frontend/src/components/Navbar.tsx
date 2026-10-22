import React from 'react';
import { Shield, Sparkles, Key, FileCheck, Layers, AlertCircle } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  apiKey: string;
  onOpenKeyModal: () => void;
  backendHealthy: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  apiKey,
  onOpenKeyModal,
  backendHealthy,
}) => {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-color)',
      background: 'rgba(5, 11, 10, 0.88)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '12px 24px',
    }}>
      <div style={{
        maxWidth: '1350px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Logo & Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981, #047857)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.45)'
          }}>
            <Shield size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
                AgriShield <span className="text-gradient">KrishiKavach</span>
              </h1>
              <span className="badge-tag" style={{ color: '#34d399', borderColor: 'rgba(52, 211, 153, 0.3)' }}>
                Hybrid RAG
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              Anti-Hallucinatory Scheme Navigator • GAT Hack Hour 2026
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <button
            id="tab-ask-docs"
            onClick={() => setActiveTab('ask')}
            className={activeTab === 'ask' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '7px 14px', fontSize: '0.85rem' }}
          >
            <Sparkles size={16} />
            Ask Documents
          </button>
          <button
            id="tab-benchmark"
            onClick={() => setActiveTab('benchmark')}
            className={activeTab === 'benchmark' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '7px 14px', fontSize: '0.85rem' }}
          >
            <FileCheck size={16} />
            5-Question Test Sheet
          </button>
          <button
            id="tab-failures"
            onClick={() => setActiveTab('failures')}
            className={activeTab === 'failures' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '7px 14px', fontSize: '0.85rem' }}
          >
            <AlertCircle size={16} />
            Failure Analysis
          </button>
          <button
            id="tab-docs"
            onClick={() => setActiveTab('docs')}
            className={activeTab === 'docs' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '7px 14px', fontSize: '0.85rem' }}
          >
            <Layers size={16} />
            Policy Documents
          </button>
        </nav>

        {/* System Status & Key Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: backendHealthy ? '#10b981' : '#ef4444',
              boxShadow: backendHealthy ? '0 0 8px #10b981' : '0 0 8px #ef4444'
            }} />
            <span>{backendHealthy ? 'FastAPI + BM25 Ready' : 'Connecting Backend...'}</span>
          </div>

          <button
            id="btn-config-key"
            onClick={onOpenKeyModal}
            className="btn-secondary"
            style={{
              borderColor: apiKey ? 'rgba(52, 211, 153, 0.4)' : 'rgba(251, 191, 36, 0.5)',
              color: apiKey ? '#a7f3d0' : '#fde68a',
              background: apiKey ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)'
            }}
          >
            <Key size={15} />
            {apiKey ? 'Groq Key Active' : 'Configure Groq Key'}
          </button>
        </div>
      </div>
    </header>
  );
};
