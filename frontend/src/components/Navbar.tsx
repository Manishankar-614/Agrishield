import React from 'react';
import { Shield, Sparkles, FileCheck, Layers, AlertCircle, Cpu, Zap, BookCheck } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  backendHealthy: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  backendHealthy,
}) => {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-color)',
      background: 'rgba(5, 11, 10, 0.92)',
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
              Anti-Hallucinatory Scheme & Subsidy Navigator • Global Academy of Technology
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

        {/* Live System Engine Status Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: 'var(--radius-full)',
            background: backendHealthy ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
            border: `1px solid ${backendHealthy ? 'rgba(52, 211, 153, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
            fontSize: '0.76rem',
            color: backendHealthy ? '#a7f3d0' : '#fca5a5'
          }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: backendHealthy ? '#10b981' : '#ef4444',
              boxShadow: backendHealthy ? '0 0 8px #10b981' : '0 0 8px #ef4444'
            }} />
            <Zap size={13} color={backendHealthy ? '#34d399' : '#ef4444'} />
            <span>{backendHealthy ? 'Groq + FastAPI Online' : 'Connecting Engine...'}</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-color)',
            fontSize: '0.76rem',
            color: 'var(--text-muted)'
          }}>
            <Cpu size={13} color="#60a5fa" />
            <span>BM25 + MiniLM RRF</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-color)',
            fontSize: '0.76rem',
            color: 'var(--text-muted)'
          }}>
            <BookCheck size={13} color="#f59e0b" />
            <span>26 Indexed Chunks</span>
          </div>
        </div>
      </div>
    </header>
  );
};
