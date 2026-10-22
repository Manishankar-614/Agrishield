import React from 'react';
import {
  Shield,
  LayoutDashboard,
  MessageSquare,
  BookOpen,
  FileCheck
} from 'lucide-react';

interface SidebarProps {
  activeTab: 'dashboard' | 'ask' | 'docs' | 'benchmark';
  setActiveTab: (tab: 'dashboard' | 'ask' | 'docs' | 'benchmark') => void;
  backendHealthy: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  backendHealthy,
}) => {
  const navItems: { id: 'dashboard' | 'ask' | 'docs' | 'benchmark'; label: string; icon: any; desc: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, desc: 'Overview, stats & active policies' },
    { id: 'ask', label: 'Ask Assistant', icon: MessageSquare, desc: 'Conversational grounded RAG chat' },
    { id: 'docs', label: 'Knowledge Base', icon: BookOpen, desc: 'Browse policies & upload PDF / Word' },
    { id: 'benchmark', label: '5-Question Test', icon: FileCheck, desc: 'Standardized evaluation matrix' },
  ];

  return (
    <aside style={{
      width: '260px',
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-light)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '24px 14px',
      height: '100vh',
      position: 'sticky',
      top: 0,
      flexShrink: 0
    }}>
      {/* Top Branding */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 8px', marginBottom: '28px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'var(--forest-800)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 2px 8px rgba(27,67,50,0.25)'
          }}>
            <Shield size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.15rem', margin: 0, color: 'var(--forest-900)', fontWeight: 800 }}>
              AgriShield
            </h1>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
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
                  padding: '11px 12px',
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

      {/* Clean status badge without cluttered footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        borderRadius: 'var(--radius-full)',
        background: '#ffffff',
        border: '1px solid var(--border-light)',
        fontSize: '0.74rem',
        color: backendHealthy ? 'var(--forest-800)' : 'var(--red-700)',
        fontWeight: 600,
        boxShadow: 'var(--shadow-sm)'
      }}>
        <span style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          background: backendHealthy ? '#10b981' : '#ef4444'
        }} />
        <span>{backendHealthy ? 'Engine Connected (Groq)' : 'Reconnecting...'}</span>
      </div>
    </aside>
  );
};
