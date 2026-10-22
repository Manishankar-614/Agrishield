import React, { useState } from 'react';
import {
  Search,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Zap,
  BookOpen,
  Copy,
  Check,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  Sun,
  CloudRain,
  DollarSign,
  Tractor,
  FlaskConical,
  ArrowRight
} from 'lucide-react';
import type { QueryResponse, RetrievedSource } from '../types';

const SCHEME_CATEGORIES = [
  {
    id: "all",
    title: "All Schemes",
    icon: Layers,
    color: "#10b981",
    desc: "Search across all 5 official guidelines"
  },
  {
    id: "kusum",
    title: "PM-KUSUM",
    icon: Sun,
    color: "#f59e0b",
    desc: "Solar pumps, Component A/B/C, 60% subsidy",
    sample: "What percentage of subsidy is provided for a standalone solar agricultural pump under PM-KUSUM Component-B in general states?"
  },
  {
    id: "pmfby",
    title: "PMFBY Insurance",
    icon: CloudRain,
    color: "#60a5fa",
    desc: "72h crop loss deadline, premium caps (1.5%, 2%, 5%)",
    sample: "What is the mandatory time window to report crop loss after a hailstorm under PMFBY?"
  },
  {
    id: "kisan",
    title: "PM-KISAN",
    icon: DollarSign,
    color: "#34d399",
    desc: "Rs. 6000 DBT, exclusion rules & Group-D exceptions",
    sample: "Are retired government employees eligible to receive PM-KISAN benefits?"
  },
  {
    id: "smam",
    title: "SMAM & Drones",
    icon: Tractor,
    color: "#a78bfa",
    desc: "Tractor subsidies, Custom Hiring Centres, Kisan Drones",
    sample: "What subsidy or grant is provided for purchasing Kisan Drones for FPOs and small farmers?"
  },
  {
    id: "soil",
    title: "Soil Health Card",
    icon: FlaskConical,
    color: "#ec4899",
    desc: "12 parameters, 3-year testing cycle, Village Labs",
    sample: "How many and which parameters are tested on a Soil Health Card?"
  }
];

const JUDGES_WALKTHROUGH = [
  {
    step: "Step 1",
    tag: "Strict Deadline",
    title: "72-Hour Claim Rule",
    query: "What is the mandatory time window for a farmer to report crop loss under PMFBY after a hailstorm?"
  },
  {
    step: "Step 2",
    tag: "Compound Subsidies",
    title: "PM-KUSUM 60% Matrix",
    query: "What percentage of subsidy is provided for a standalone solar agricultural pump under PM-KUSUM Component-B in general states?"
  },
  {
    step: "Step 3",
    tag: "Exclusion Exception",
    title: "PM-KISAN Group D Rule",
    query: "Are retired government employees eligible to receive PM-KISAN benefits?"
  },
  {
    step: "Step 4",
    tag: "Anti-Hallucination Refusal",
    title: "Electric Helicopter Test",
    query: "What is the government subsidy for buying an electric helicopter for farm tourism?"
  }
];

export const AskDocsView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<QueryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<RetrievedSource | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSearch = async (queryText?: string) => {
    const q = queryText || query;
    if (!q.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q })
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data: QueryResponse = await res.json();
      setResponse(data);
      if (data.retrieved_sources && data.retrieved_sources.length > 0) {
        setSelectedSource(data.retrieved_sources[0]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to reach AgriShield backend. Ensure backend is running at http://127.0.0.1:8000.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCitation = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ maxWidth: '1350px', margin: '0 auto', padding: '24px' }}>
      
      {/* Judges Quick 60-Second Walkthrough Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '24px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(52, 211, 153, 0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="#34d399" />
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
              Judges 60-Second Pitch Walkthrough
            </span>
            <span className="badge-tag" style={{ color: '#34d399' }}>Instant Demo Mode</span>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Click each step in order to witness precision retrieval & anti-hallucination refusal:
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
          {JUDGES_WALKTHROUGH.map((step, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setQuery(step.query);
                handleSearch(step.query);
              }}
              className="glass-card-interactive"
              style={{ padding: '10px 14px', textAlign: 'left' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#34d399' }}>
                  {step.step}: {step.tag}
                </span>
                <ArrowRight size={13} color="#64748b" />
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc' }}>
                {step.title}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Scheme Categories Tabs */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
            Explore by Policy Scheme Category:
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Clicking a category loads verified questions
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
          {SCHEME_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  if (cat.sample) {
                    setQuery(cat.sample);
                    handleSearch(cat.sample);
                  }
                }}
                className={`glass-card-interactive ${isSelected ? 'active' : ''}`}
                style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: `${cat.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: cat.color
                }}>
                  <Icon size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: isSelected ? '#a7f3d0' : '#fff' }}>
                    {cat.title}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>
                    {cat.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Search Bar */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} style={{ display: 'flex', gap: '12px', alignItems: 'stretch' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} color="#6ee7b7" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              id="rag-query-input"
              type="text"
              placeholder="Ask about subsidies, claim hours, drone grants, or soil parameters..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '16px 18px 16px 46px',
                background: 'rgba(0, 0, 0, 0.45)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                color: '#fff',
                fontSize: '1.02rem',
                outline: 'none',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--border-focus)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
            />
          </div>
          <button
            id="btn-run-query"
            type="submit"
            disabled={loading || !query.trim()}
            className="btn-primary"
            style={{ padding: '0 28px', fontSize: '1rem' }}
          >
            {loading ? (
              <>
                <Zap size={18} className="animate-spin" />
                Querying RAG...
              </>
            ) : (
              <>
                <Send size={18} />
                Ask Documents
              </>
            )}
          </button>
        </form>
      </div>

      {/* Error state */}
      {error && (
        <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '24px', borderColor: 'rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fca5a5' }}>
            <AlertTriangle size={20} />
            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{error}</span>
          </div>
        </div>
      )}

      {/* RAG Results Display */}
      {response && (
        <div>
          {/* Real-time RAG Pipeline Progress Tracker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginRight: '4px' }}>
              Execution Trace:
            </span>
            <div className="pipeline-step active">
              <Sparkles size={13} color="#34d399" />
              <span>Query Normalizer & Acronym Expander</span>
            </div>
            <span style={{ color: 'var(--text-dim)' }}>➔</span>
            <div className="pipeline-step active">
              <Cpu size={13} color="#34d399" />
              <span>Hybrid BM25 + Cosine (MiniLM-L6)</span>
            </div>
            <span style={{ color: 'var(--text-dim)' }}>➔</span>
            <div className="pipeline-step active">
              <Layers size={13} color="#34d399" />
              <span>RRF Top-4 Fusion ({response.retrieval_latency_ms}ms)</span>
            </div>
            <span style={{ color: 'var(--text-dim)' }}>➔</span>
            <div className="pipeline-step active">
              <ShieldCheck size={13} color="#34d399" />
              <span>Groq Grounding Verification ({response.generation_latency_ms}ms)</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 1fr)', gap: '24px' }}>
            {/* Main Answer Card */}
            <div className="glass-panel animate-fade-in" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Header: Grounding Status & Latency HUD */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                <div>
                  {response.grounded ? (
                    <span className="badge-grounded">
                      <CheckCircle2 size={16} />
                      GROUNDED IN OFFICIAL POLICY
                    </span>
                  ) : (
                    <span className="badge-refusal">
                      <AlertTriangle size={16} />
                      OUT-OF-DOMAIN REFUSAL ("I DON'T KNOW")
                    </span>
                  )}
                </div>

                {/* Latency Metrics */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={13} color="#34d399" />
                    Total Latency: <strong style={{ color: '#fff' }}>{response.total_latency_ms} ms</strong>
                  </span>
                  <span>•</span>
                  <span>Retrieval: <strong style={{ color: '#fff' }}>{response.retrieval_latency_ms} ms</strong></span>
                  <span>•</span>
                  <span>Groq LLM: <strong style={{ color: '#fff' }}>{response.generation_latency_ms} ms</strong></span>
                </div>
              </div>

              {/* Answer Text */}
              <div style={{ color: 'var(--text-main)', fontSize: '0.98rem', lineHeight: '1.75' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', fontWeight: 600 }}>
                  Synthesized Grounded Answer:
                </div>
                <div style={{ whiteSpace: 'pre-wrap', background: 'rgba(0,0,0,0.3)', padding: '22px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {response.answer}
                </div>
              </div>

              {/* Citations Preview Banner */}
              <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(52, 211, 153, 0.25)', padding: '14px 18px', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6ee7b7', fontSize: '0.84rem', fontWeight: 700 }}>
                  <BookOpen size={16} />
                  <span>{response.retrieved_sources.length} Verified Document Chunks Retrieved via Hybrid Search</span>
                </div>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                  Click any source card on the right panel to inspect the verbatim policy text and mathematical rank score.
                </p>
              </div>
            </div>

            {/* Source Citations Inspector Panel */}
            <div className="glass-panel animate-fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '1.1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BookOpen size={18} color="#10b981" />
                  Retrieved Context & Citations
                </h3>
                <span className="badge-tag">Top-4 Chunks (RRF)</span>
              </div>

              {/* Sources List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {response.retrieved_sources.map((item, idx) => {
                  const isSelected = selectedSource?.chunk.chunk_id === item.chunk.chunk_id;
                  return (
                    <div
                      key={item.chunk.chunk_id}
                      onClick={() => setSelectedSource(item)}
                      style={{
                        padding: '14px',
                        borderRadius: '10px',
                        background: isSelected ? 'rgba(52, 211, 153, 0.14)' : 'rgba(255, 255, 255, 0.03)',
                        border: `1px solid ${isSelected ? 'var(--emerald-400)' : 'var(--border-color)'}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f0fdf4' }}>
                          Source [{idx + 1}]: {item.chunk.scheme.split('(')[0].trim()}
                        </span>
                        <span className="badge-tag" style={{ color: '#34d399', fontSize: '0.7rem' }}>
                          RRF Rank: {item.rrf_score}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                        Section: <strong style={{ color: '#a7f3d0' }}>{item.chunk.section}</strong>
                      </div>

                      <div style={{ display: 'flex', gap: '12px', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                        <span>Dense Cosine: <strong style={{ color: '#93c5fd' }}>{item.vector_score}</strong></span>
                        <span>BM25 Score: <strong style={{ color: '#fcd34d' }}>{item.bm25_score}</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected Chunk Verbatim Text Inspector */}
              {selectedSource && (
                <div style={{ marginTop: '12px', background: 'rgba(0,0,0,0.45)', borderRadius: '10px', padding: '16px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase' }}>
                      Verbatim Clause Passage ({selectedSource.chunk.chunk_id})
                    </span>
                    <button
                      onClick={() => handleCopyCitation(selectedSource.chunk.content, selectedSource.chunk.chunk_id)}
                      className="btn-secondary"
                      style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                    >
                      {copiedId === selectedSource.chunk.chunk_id ? (
                        <>
                          <Check size={12} color="#10b981" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy size={12} /> Copy Snippet
                        </>
                      )}
                    </button>
                  </div>
                  <div style={{ maxHeight: '220px', overflowY: 'auto', fontSize: '0.82rem', color: '#cbd5e1', whiteSpace: 'pre-wrap', lineHeight: '1.6', fontFamily: 'var(--font-mono)' }}>
                    {selectedSource.chunk.content}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
