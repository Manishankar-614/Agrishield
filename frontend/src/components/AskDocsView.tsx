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
  Check
} from 'lucide-react';
import type { QueryResponse, RetrievedSource } from '../types';
import { API_BASE_URL } from '../apiConfig';

const SAMPLE_QUESTIONS = [
  {
    tag: "⏱️ 72-Hour Deadline",
    text: "What is the mandatory time window to report crop loss after a hailstorm under PMFBY?"
  },
  {
    tag: "☀️ PM-KUSUM 60% Subsidy",
    text: "What percentage of subsidy is provided for a standalone solar agricultural pump under PM-KUSUM Component-B in general states?"
  },
  {
    tag: "👨‍🌾 PM-KISAN Exclusions",
    text: "Are retired government employees eligible to receive PM-KISAN benefits?"
  },
  {
    tag: "🧪 12 Soil Health Parameters",
    text: "How many and which parameters are tested on a Soil Health Card?"
  },
  {
    tag: "🚫 Refusal Test (Out-of-Domain)",
    text: "What is the government subsidy for buying an electric helicopter for farm tourism?"
  }
];

export const AskDocsView: React.FC = () => {
  const [query, setQuery] = useState('');
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
      const res = await fetch(`${API_BASE_URL}/api/query`, {
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
      setError(err.message || 'Failed to reach AgriShield backend.');
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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.45rem', margin: '0 0 6px 0', color: 'var(--forest-900)' }}>
          Ask Indian Agricultural Policy Documents
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
          Query official guidelines with zero hallucination. Answers are strictly extracted from verified circulars with full statutory citations.
        </p>
      </div>

      {/* Main Search Card */}
      <div className="warm-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} style={{ display: 'flex', gap: '12px', alignItems: 'stretch' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} color="var(--forest-700)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              id="rag-query-input"
              type="text"
              placeholder="Ask about subsidies, crop insurance deadlines, eligibility exceptions, or soil testing..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px 14px 46px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)',
                background: '#ffffff',
                color: 'var(--text-main)',
                fontSize: '0.98rem',
                outline: 'none',
                boxShadow: 'var(--shadow-sm)'
              }}
            />
          </div>
          <button
            id="btn-run-query"
            type="submit"
            disabled={loading || !query.trim()}
            className="btn-primary"
            style={{ padding: '0 24px' }}
          >
            {loading ? (
              <>
                <Zap size={16} className="animate-spin" />
                Querying...
              </>
            ) : (
              <>
                <Send size={16} />
                Ask Documents
              </>
            )}
          </button>
        </form>

        {/* Clean Sample Question Pills */}
        <div style={{ marginTop: '16px' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
            Recommended Queries (Click to test):
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {SAMPLE_QUESTIONS.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuery(s.text);
                  handleSearch(s.text);
                }}
                className="btn-secondary"
                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              >
                {s.tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="warm-card animate-fade-in" style={{ padding: '16px 20px', marginBottom: '24px', background: 'var(--red-50)', borderColor: 'rgba(185, 28, 28, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--red-700)' }}>
            <AlertTriangle size={20} />
            <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{error}</span>
          </div>
        </div>
      )}

      {/* RAG Results Display */}
      {response && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '24px' }}>
          {/* Main Answer Card */}
          <div className="warm-card animate-fade-in" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Header: Grounding Status & Latency HUD */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--border-light)', paddingBottom: '14px' }}>
              <div>
                {response.grounded ? (
                  <span className="badge-grounded">
                    <CheckCircle2 size={15} />
                    GROUNDED IN OFFICIAL POLICY
                  </span>
                ) : (
                  <span className="badge-refusal">
                    <AlertTriangle size={15} />
                    OUT-OF-DOMAIN REFUSAL ("I DON'T KNOW")
                  </span>
                )}
              </div>

              {/* Latency Metrics */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <Clock size={14} color="var(--forest-700)" />
                <span>Total Latency: <strong>{response.total_latency_ms} ms</strong></span>
              </div>
            </div>

            {/* Answer Text */}
            <div style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.75' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', fontWeight: 700 }}>
                Synthesized Grounded Answer:
              </div>
              <div style={{ whiteSpace: 'pre-wrap', background: 'var(--bg-app)', padding: '20px', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
                {response.answer}
              </div>
            </div>

            {/* Citations Preview Banner */}
            <div style={{ background: 'var(--forest-50)', border: '1px solid rgba(45, 106, 79, 0.25)', padding: '12px 16px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--forest-900)', fontSize: '0.82rem', fontWeight: 700 }}>
                <BookOpen size={16} />
                <span>{response.retrieved_sources.length} Verified Document Chunks Retrieved via Hybrid Search</span>
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                Select any source card on the right panel to inspect the official verbatim clause text.
              </p>
            </div>
          </div>

          {/* Source Citations Inspector Panel */}
          <div className="warm-card animate-fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--forest-900)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={17} color="var(--forest-700)" />
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
                      padding: '12px 14px',
                      borderRadius: '8px',
                      background: isSelected ? 'var(--forest-50)' : '#ffffff',
                      border: `1px solid ${isSelected ? 'var(--forest-700)' : 'var(--border-light)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      boxShadow: isSelected ? 'var(--shadow-sm)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--forest-900)' }}>
                        Source [{idx + 1}]: {item.chunk.scheme.split('(')[0].trim()}
                      </span>
                      <span className="badge-tag" style={{ color: 'var(--forest-800)', fontSize: '0.68rem' }}>
                        Rank Score: {item.rrf_score}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      Section: <strong style={{ color: 'var(--forest-800)' }}>{item.chunk.section}</strong>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                      <span>Cosine: <strong>{item.vector_score}</strong></span>
                      <span>•</span>
                      <span>BM25: <strong>{item.bm25_score}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Chunk Verbatim Text Inspector */}
            {selectedSource && (
              <div style={{ marginTop: '8px', background: 'var(--bg-app)', borderRadius: '8px', padding: '14px', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--forest-800)', textTransform: 'uppercase' }}>
                    Verbatim Clause ({selectedSource.chunk.chunk_id})
                  </span>
                  <button
                    onClick={() => handleCopyCitation(selectedSource.chunk.content, selectedSource.chunk.chunk_id)}
                    className="btn-secondary"
                    style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                  >
                    {copiedId === selectedSource.chunk.chunk_id ? (
                      <>
                        <Check size={12} color="#1b4332" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy size={12} /> Copy Snippet
                      </>
                    )}
                  </button>
                </div>
                <div style={{ maxHeight: '200px', overflowY: 'auto', fontSize: '0.8rem', color: 'var(--text-main)', whiteSpace: 'pre-wrap', lineHeight: '1.55', fontFamily: 'var(--font-mono)' }}>
                  {selectedSource.chunk.content}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
