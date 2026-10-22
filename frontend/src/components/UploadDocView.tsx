import React, { useState } from 'react';
import { FilePlus, CheckCircle2, AlertTriangle, RefreshCw, XCircle } from 'lucide-react';
import { API_BASE_URL } from '../apiConfig';

const VALID_AGRI_SAMPLE = {
  title: "National Mission on Natural Farming (NMNF) 2026 Guidelines",
  content: `# NATIONAL MISSION ON NATURAL FARMING (NMNF) GUIDELINES
**Ministry:** Ministry of Agriculture and Farmers Welfare (MoA&FW), Government of India
**Objective:** Promotion of chemical-free and climate-resilient natural farming across agricultural clusters.

### Financial Assistance & Farmer Incentives
* **Incentive per Hectare:** Farmers adopting natural farming receive financial support of **Rs. 15,000 per hectare for 3 years** (disbursed as Rs. 5,000 annually) to compensate for initial yield variations during transition from chemical farming.
* **On-Farm Bio-Input Resource Centres (BRC):** Financial assistance of **Rs. 1.00 Lakh** is provided for establishing village-level Bio-Input Resource Centres to produce Jeevamrit, Beejamrit, and botanical bio-pesticides.
* **Cluster Requirement:** Implemented in contiguous gram panchayat clusters of at least 50 hectares involving 50 or more smallholder farmers.
* **Certification:** Verification and PGS-India (Participatory Guarantee System) green organic certification provided free of cost to participating farmers.`
};

const INVALID_SAMPLE = {
  title: "Introduction to React Hooks & State Management",
  content: `# REACT HOOKS CHEATSHEET
React 19 introduces automated compiler optimizations and eliminates the need for manual useMemo and useCallback hooks in most frontend web applications.

### State Management
* Redux Toolkit and Zustand are the industry standards for client-side state management.
* Server state should be managed with TanStack Query (React Query) for automated caching and deduplication of REST API endpoints.`
};

export const UploadDocView: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [successResult, setSuccessResult] = useState<any | null>(null);
  const [rejectionError, setRejectionError] = useState<string | null>(null);

  const handleUpload = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    setSuccessResult(null);
    setRejectionError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
      });

      const data = await res.json();

      if (!res.ok) {
        setRejectionError(data.detail || 'Document was rejected by the domain guardrail.');
      } else {
        setSuccessResult(data);
      }
    } catch (err: any) {
      setRejectionError(err.message || 'Failed to connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  const loadSample = (sample: { title: string; content: string }) => {
    setTitle(sample.title);
    setContent(sample.content);
    setSuccessResult(null);
    setRejectionError(null);
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'var(--forest-100)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--forest-800)'
          }}>
            <FilePlus size={20} />
          </div>
          <h2 style={{ fontSize: '1.4rem', margin: 0, color: 'var(--forest-900)' }}>
            Add Document & Train Knowledge Base
          </h2>
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
          Expand AgriShield's retrieval corpus with new agricultural scheme gazettes. All submissions pass through an <strong>Automatic Agricultural Domain Guardrail</strong> to reject irrelevant or polluting documents.
        </p>
      </div>

      {/* Quick Test Preset Buttons for Judges */}
      <div className="warm-card" style={{ padding: '16px 20px', marginBottom: '24px', background: 'var(--bg-card-subtle)' }}>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '10px' }}>
          Quick Test Presets (Click to populate):
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <button
            type="button"
            onClick={() => loadSample(VALID_AGRI_SAMPLE)}
            className="btn-secondary"
            style={{ fontSize: '0.82rem', borderColor: 'rgba(45, 106, 79, 0.4)', background: '#fff' }}
          >
            <CheckCircle2 size={15} color="#1b4332" />
            Load Valid Agricultural Policy (NMNF Guidelines)
          </button>

          <button
            type="button"
            onClick={() => loadSample(INVALID_SAMPLE)}
            className="btn-secondary"
            style={{ fontSize: '0.82rem', borderColor: 'rgba(239, 68, 68, 0.4)', color: '#b91c1c', background: '#fff' }}
          >
            <XCircle size={15} color="#b91c1c" />
            Load Out-of-Domain Sample (Test Domain Guardrail Rejection)
          </button>
        </div>
      </div>

      {/* Upload Form */}
      <form onSubmit={handleUpload} className="warm-card" style={{ padding: '28px', marginBottom: '24px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
            Document Scheme Title
          </label>
          <input
            type="text"
            placeholder="e.g. National Mission on Natural Farming (NMNF) Operational Guidelines"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-light)',
              fontSize: '0.94rem',
              color: 'var(--text-main)',
              outline: 'none',
              background: '#fff'
            }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Document Content (Markdown / Text)
            </label>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
              {content.length} characters • {content.split(/\s+/).filter(Boolean).length} words
            </span>
          </div>
          <textarea
            rows={10}
            placeholder="Paste official gazette guidelines, subsidy tables, eligibility clauses, and operational rules here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-light)',
              fontSize: '0.88rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-main)',
              outline: 'none',
              lineHeight: '1.6',
              background: '#fff'
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            type="submit"
            disabled={loading || !title.trim() || !content.trim()}
            className="btn-primary"
            style={{ padding: '10px 24px' }}
          >
            {loading ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Validating & Indexing Corpus...
              </>
            ) : (
              <>
                <FilePlus size={16} />
                Validate Domain & Ingest Document
              </>
            )}
          </button>
        </div>
      </form>

      {/* Success Banner */}
      {successResult && (
        <div className="warm-card animate-fade-in" style={{ padding: '20px 24px', background: 'var(--forest-50)', borderColor: 'rgba(45, 106, 79, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <CheckCircle2 size={24} color="#1b4332" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h3 style={{ fontSize: '1.05rem', margin: '0 0 4px 0', color: 'var(--forest-900)' }}>
                Document Approved & Successfully Embedded!
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--forest-800)', margin: '0 0 10px 0' }}>
                {successResult.message}
              </p>
              <div style={{ display: 'flex', gap: '12px', fontSize: '0.78rem', color: 'var(--forest-700)', fontWeight: 600 }}>
                <span>📁 Filename: <code>{successResult.filename}</code></span>
                <span>•</span>
                <span>📑 Total Chunks Indexed: <strong>{successResult.total_chunks}</strong></span>
                <span>•</span>
                <span>📚 Total Documents: <strong>{successResult.total_documents}</strong></span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px', fontStyle: 'italic' }}>
                Tip: Go to the "Ask Documents" tab now and ask: <em>"What is the financial assistance per hectare under NMNF?"</em> to see instant grounded answers!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Alert */}
      {rejectionError && (
        <div className="warm-card animate-fade-in" style={{ padding: '20px 24px', background: 'var(--red-50)', borderColor: 'rgba(185, 28, 28, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <AlertTriangle size={24} color="#b91c1c" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h3 style={{ fontSize: '1.05rem', margin: '0 0 4px 0', color: 'var(--red-700)' }}>
                Document Rejected: Out-of-Domain Guardrail Triggered
              </h3>
              <p style={{ fontSize: '0.84rem', color: '#7f1d1d', margin: 0, lineHeight: '1.5' }}>
                {rejectionError}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
