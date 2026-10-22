import React, { useState, useEffect } from 'react';
import {
  Shield,
  MessageSquare,
  FilePlus,
  FileCheck,
  Zap,
  BookOpen,
  CheckCircle2,
  Clock,
  Sun,
  CloudRain,
  DollarSign,
  Tractor,
  FlaskConical,
  Sprout
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (tab: 'dashboard' | 'ask' | 'docs' | 'benchmark') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<any>({
    total_documents: 6,
    total_chunks: 27,
    avg_retrieval_latency_ms: 11.8,
    guardrail_status: 'Active (Lexical + Semantic Centroid)'
  });

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Error fetching stats:', err));
  }, []);

  const schemeCards = [
    {
      title: "PM-KUSUM Component-B",
      icon: Sun,
      color: "#b45309",
      bg: "#fef3c7",
      highlight: "60% Total Subsidy",
      desc: "30% Central CFA + 30% State Govt subsidy for standalone solar pumps up to 7.5 HP."
    },
    {
      title: "PMFBY Crop Insurance",
      icon: CloudRain,
      color: "#1d4ed8",
      bg: "#eff6ff",
      highlight: "Mandatory 72-Hour Rule",
      desc: "Intimation must be submitted within 72 hours of localized hailstorm or flood damage."
    },
    {
      title: "PM-KISAN Samman Nidhi",
      icon: DollarSign,
      color: "#1b4332",
      bg: "#e8f5e9",
      highlight: "Rs. 6,000 / Year DBT",
      desc: "Disbursed in 3 equal installments; Group D / MTS employees remain strictly eligible."
    },
    {
      title: "SMAM & Kisan Drones",
      icon: Tractor,
      color: "#6b21a8",
      bg: "#f3e8ff",
      highlight: "Up to 100% Drone Grants",
      desc: "40-50% machinery subsidy + 75% to 100% drone assistance for FPOs and research KVKs."
    },
    {
      title: "Soil Health Card (SHC)",
      icon: FlaskConical,
      color: "#be185d",
      bg: "#fce7f3",
      highlight: "12 Specific Parameters",
      desc: "Tested across 3 macro (N,P,K), 1 secondary, 5 micro, and 3 physical soil metrics."
    },
    {
      title: "Natural Farming (NMNF)",
      icon: Sprout,
      color: "#047857",
      bg: "#d1fae5",
      highlight: "Rs. 15,000 / Hectare",
      desc: "Direct transitional assistance for farmers adopting chemical-free sustainable cultivation."
    }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Colored Hero Section */}
      <div className="hero-gradient" style={{ marginBottom: '32px' }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '780px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(10px)', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', fontWeight: 600, marginBottom: '14px' }}>
            <Shield size={16} />
            <span>Anti-Hallucinatory Hybrid RAG System</span>
          </div>

          <h1 style={{ fontSize: '2.1rem', fontWeight: 800, margin: '0 0 10px 0', lineHeight: '1.25', color: '#ffffff' }}>
            AgriShield (KrishiKavach)
          </h1>
          <p style={{ fontSize: '1rem', color: '#e2e8f0', lineHeight: '1.6', margin: '0 0 24px 0' }}>
            A grounded, document-verified intelligence platform for Indian agricultural subsidies, crop damage claims, and entitlement guidelines. Eliminates hallucinations with verbatim section citations.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <button
              id="hero-btn-chat"
              onClick={() => onNavigate('ask')}
              className="btn-primary"
              style={{ background: '#ffffff', color: 'var(--forest-900)', border: 'none', boxShadow: '0 4px 14px rgba(0,0,0,0.15)' }}
            >
              <MessageSquare size={17} color="var(--forest-900)" />
              Start Scheme Chat
            </button>
            <button
              id="hero-btn-docs"
              onClick={() => onNavigate('docs')}
              className="btn-secondary"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(8px)' }}
            >
              <FilePlus size={17} />
              Knowledge Base & Upload
            </button>
            <button
              id="hero-btn-benchmark"
              onClick={() => onNavigate('benchmark')}
              className="btn-secondary"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(8px)' }}
            >
              <FileCheck size={17} />
              5-Question Benchmark Suite
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div className="warm-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Indexed Guidelines
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--forest-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--forest-800)' }}>
              <BookOpen size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--forest-900)' }}>
            {stats.total_documents} Circulars
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            Official Gazette Operational Manuals
          </div>
        </div>

        <div className="warm-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Semantic Passages
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--amber-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--amber-700)' }}>
              <Zap size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--forest-900)' }}>
            {stats.total_chunks} Chunks
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            Hybrid BM25 + MiniLM Embeddings
          </div>
        </div>

        <div className="warm-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Retrieval Latency
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--forest-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--forest-800)' }}>
              <Clock size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--forest-900)' }}>
            ~{stats.avg_retrieval_latency_ms} ms
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            Local In-Memory Vector Search
          </div>
        </div>

        <div className="warm-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Domain Guardrail
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--forest-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--forest-800)' }}>
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--forest-800)', marginTop: '6px' }}>
            100% Protected
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            Rejects Non-Agri Documents
          </div>
        </div>
      </div>

      {/* Covered Scheme Matrix */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', margin: '0 0 4px 0', color: 'var(--forest-900)' }}>
              Covered Agricultural Entitlements Matrix
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
              Official government schemes pre-indexed and ready for instant natural language questioning.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {schemeCards.map((sc, i) => {
            const Icon = sc.icon;
            return (
              <div key={i} className="warm-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: sc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: sc.color }}>
                      <Icon size={18} />
                    </div>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--forest-900)' }}>
                      {sc.title}
                    </span>
                  </div>
                  <span className="badge-tag" style={{ color: sc.color, fontWeight: 700, borderColor: `${sc.color}40`, background: sc.bg }}>
                    {sc.highlight}
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.55', margin: 0 }}>
                  {sc.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
