import React, { useState } from 'react';
import { Shield, Sparkles, Key, FileCheck, Layers, AlertCircle } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  backendHealthy: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  apiKey,
  setApiKey,
  backendHealthy,
}) => {
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);

  const handleSaveKey = () => {
    setApiKey(tempKey);
    localStorage.setItem('groq_api_key', tempKey);
    setShowKeyModal(false);
  };

  return (
    <>
      <header style={{
        borderBottom: '1px solid var(--border-color)',
        background: 'rgba(7, 13, 12, 0.85)',
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
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
            }}>
              <Shield size={24} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
                  AgriShield <span className="text-gradient">KrishiKavach</span>
                </h1>
                <span className="badge-tag" style={{ color: '#34d399', borderColor: 'rgba(52, 211, 153, 0.3)' }}>
                  RAG 3.0
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                Anti-Hallucinatory Hybrid RAG • Indian Agriculture Policy & Subsidy Navigator
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
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
              onClick={() => setShowKeyModal(true)}
              className="btn-secondary"
              style={{
                borderColor: apiKey ? 'rgba(52, 211, 153, 0.4)' : 'rgba(251, 191, 36, 0.5)',
                color: apiKey ? '#a7f3d0' : '#fde68a'
              }}
            >
              <Key size={15} />
              {apiKey ? 'Groq Key Active' : 'Enter Groq Key'}
            </button>
          </div>
        </div>
      </header>

      {/* Groq Key Modal */}
      {showKeyModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{ maxWidth: '500px', width: '100%', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Key size={22} color="#10b981" />
              <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Configure Groq API Key</h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Groq provides blazing fast free inference for Llama 3.3. Get your key in 30 seconds at <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" style={{ color: '#34d399' }}>console.groq.com/keys</a>.
            </p>
            <input
              type="password"
              placeholder="gsk_..."
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.9rem',
                fontFamily: 'var(--font-mono)',
                marginBottom: '18px',
                outline: 'none'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setShowKeyModal(false)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleSaveKey} className="btn-primary">
                Save & Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
