import React, { useState } from 'react';
import { Search, Send, CheckCircle2, AlertTriangle, Clock, Zap, BookOpen, Copy, Check } from 'lucide-react';
import type { QueryResponse, RetrievedSource } from '../types';

interface AskDocsViewProps {
  apiKey: string;
}

const SAMPLE_QUERIES = [
  {
    label: "⏱️ 72-Hour PMFBY Deadline",
    text: "What is the mandatory time window to report crop loss after a hailstorm under PMFBY?"
  },
  {
    label: "☀️ PM-KUSUM 7.5 HP Subsidy",
    text: "What percentage of subsidy is provided for a standalone solar agricultural pump under PM-KUSUM Component-B in general states?"
  },
  {
    label: "👨‍🌾 PM-KISAN Exclusions",
    text: "Are retired government employees eligible to receive PM-KISAN benefits?"
  },
  {
    label: "🧪 12 Soil Health Parameters",
    text: "How many and which parameters are tested on a Soil Health Card?"
  },
  {
    label: "🚁 Kisan Drone Grants",
    text: "What subsidy or grant is provided for purchasing Kisan Drones for FPOs and small farmers?"
  },
  {
    label: "🚫 Surprise Out-of-Domain Test",
    text: "What is the government subsidy for buying an electric helicopter for farm tourism?"
  }
];

export const AskDocsView: React.FC<AskDocsViewProps> = ({ apiKey }) => {
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
      const res = await fetch('http://127.0.0.1:8000/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, api_key: apiKey || undefined })
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
      setError(err.message || 'Failed to reach AgriShield backend. Ensure backend is running.');
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
      {/* Search Bar & Prompt Pills */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Search size={20} color="#10b981" />
          Ask Indian Agricultural Policy Documents
        </h2>

        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} style={{ display: 'flex', gap: '12px', marginBottom: '18px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              id="rag-query-input"
              type="text"
              placeholder="Ask about subsidies, crop insurance deadlines, eligibility, or soil health testing..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 18px',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                color: '#fff',
                fontSize: '1rem',
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
            style={{ padding: '0 24px' }}
          >
            {loading ? (
              <>
                <Zap size={18} className="animate-pulse" />
                Retrieving & Reasoning...
              </>
            ) : (
              <>
                <Send size={18} />
                Ask Documents
              </>
            )}
          </button>
        </form>

        {/* Preset Sample Prompts */}
        <div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
            Curated Benchmark Queries (Click to test):
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {SAMPLE_QUERIES.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuery(sample.text);
                  handleSearch(sample.text);
                }}
                className="btn-secondary"
                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 1fr)', gap: '24px' }}>
          {/* Main Answer Card */}
          <div className="glass-panel animate-fade-in" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Header: Grounding Status & Latency HUD */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={13} color="#34d399" />
                  Total: <strong style={{ color: '#fff' }}>{response.total_latency_ms} ms</strong>
                </span>
                <span>•</span>
                <span>Retrieval (BM25+Dense): <strong style={{ color: '#fff' }}>{response.retrieval_latency_ms} ms</strong></span>
                <span>•</span>
                <span>Groq Llama-3.3: <strong style={{ color: '#fff' }}>{response.generation_latency_ms} ms</strong></span>
              </div>
            </div>

            {/* Answer Text */}
            <div style={{ color: 'var(--text-main)', fontSize: '0.98rem', lineHeight: '1.75' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', fontWeight: 600 }}>
                Synthesized Grounded Answer:
              </div>
              <div style={{ whiteSpace: 'pre-wrap', background: 'rgba(0,0,0,0.25)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                {response.answer}
              </div>
            </div>

            {/* Citations Preview Banner */}
            <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(52, 211, 153, 0.2)', padding: '12px 16px', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6ee7b7', fontSize: '0.82rem', fontWeight: 600 }}>
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
                      background: isSelected ? 'rgba(52, 211, 153, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${isSelected ? 'var(--emerald-500)' : 'var(--border-color)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f0fdf4' }}>
                        Source [{idx + 1}]: {item.chunk.scheme.split('(')[0].trim()}
                      </span>
                      <span className="badge-tag" style={{ color: '#34d399', fontSize: '0.7rem' }}>
                        RRF: {item.rrf_score}
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
              <div style={{ marginTop: '12px', background: 'rgba(0,0,0,0.4)', borderRadius: '10px', padding: '16px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#34d399', textTransform: 'uppercase' }}>
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
      )}
    </div>
  );
};
