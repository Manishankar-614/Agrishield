import React from 'react';
import {
  Shield,
  MessageSquare,
  FilePlus,
  FileCheck,
  AlertCircle,
  BookOpen
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  backendHealthy: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  backendHealthy,
}) => {
  const navItems = [
    { id: 'ask', label: 'Ask Documents', icon: MessageSquare, desc: 'Search & query official policies' },
    { id: 'upload', label: 'Add Document', icon: FilePlus, desc: 'Train knowledge base with domain check' },
    { id: 'benchmark', label: '5-Question Test Sheet', icon: FileCheck, desc: 'Standardized evaluation matrix' },
    { id: 'failures', label: 'Failure Analysis', icon: AlertCircle, desc: 'Documented failure modes & fixes' },
    { id: 'docs', label: 'Knowledge Base', icon: BookOpen, desc: 'View all 5+ ingested policies' },
  ];

  return (
    <aside style={{
      width: '280px',
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-light)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '24px 16px',
      height: '100vh',
      position: 'sticky',
      top: 0,
      flexShrink: 0
    }}>
      {/* Top Branding */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 8px', marginBottom: '28px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'var(--forest-800)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 2px 8px rgba(27,67,50,0.25)'
          }}>
            <Shield size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.18rem', margin: 0, color: 'var(--forest-900)', fontWeight: 800 }}>
              AgriShield
            </h1>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: 0 }}>
              KrishiKavach • Scheme RAG
            </p>
          </div>
        </div>

        {/* Navigation Item Cards */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: isActive ? '1px solid var(--border-strong)' : '1px solid transparent',
                  background: isActive ? '#ffffff' : 'transparent',
                  color: isActive ? 'var(--forest-900)' : 'var(--text-muted)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? 'var(--shadow-sm)' : 'none'
                }}
              >
                <div style={{
                  color: isActive ? 'var(--forest-700)' : 'var(--text-dim)',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Icon size={18} />
                </div>
                <div>
                  <div style={{ lineHeight: '1.2' }}>{item.label}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontWeight: 400, marginTop: '2px' }}>
                    {item.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Status Card */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-sm)',
        padding: '14px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--forest-800)', textTransform: 'uppercase' }}>
            System Engine
          </span>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.72rem',
            color: backendHealthy ? 'var(--forest-700)' : 'var(--red-700)',
            fontWeight: 600
          }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: backendHealthy ? '#10b981' : '#ef4444'
            }} />
            {backendHealthy ? 'Online' : 'Offline'}
          </span>
        </div>

        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
          <div>⚡ <strong>Hybrid RAG:</strong> BM25 + MiniLM</div>
          <div>🤖 <strong>Generator:</strong> Groq Llama 3.3</div>
          <div style={{ marginTop: '4px', color: 'var(--text-dim)' }}>GAT Hack Hour 2026</div>
        </div>
      </div>
    </aside>
  );
};
