import React, { useState, useEffect } from 'react';
import { Layers, FileText, CheckCircle2, ChevronRight } from 'lucide-react';
import type { DocumentSummary } from '../types';

export const DocumentExplorerView: React.FC = () => {
  const [docs, setDocs] = useState<DocumentSummary[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentSummary | null>(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/documents')
      .then(res => res.json())
      .then(data => {
        if (data.documents) {
          setDocs(data.documents);
          if (data.documents.length > 0) setSelectedDoc(data.documents[0]);
        }
      })
      .catch(err => console.error('Error fetching documents:', err));
  }, []);

  return (
    <div style={{ maxWidth: '1350px', margin: '0 auto', padding: '24px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Layers size={24} color="#10b981" />
          <h2 style={{ fontSize: '1.35rem', margin: 0 }}>Ingested Agricultural Policy Repository</h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
          Directly demonstrating <strong>Pipeline Step 01 (Ingestion)</strong>: 5 official Indian government policy guidelines cleaned, section-parsed, and indexed into dense and lexical representations.
        </p>
      </div>

      {/* Docs Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.4fr)', gap: '24px' }}>
        {/* Document Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {docs.map((doc) => {
            const isSelected = selectedDoc?.doc_name === doc.doc_name;
            return (
              <div
                key={doc.doc_name}
                onClick={() => setSelectedDoc(doc)}
                className="glass-panel"
                style={{
                  padding: '16px 20px',
                  cursor: 'pointer',
                  borderColor: isSelected ? 'var(--emerald-500)' : 'var(--border-color)',
                  background: isSelected ? 'rgba(52, 211, 153, 0.1)' : 'var(--bg-card)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: isSelected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isSelected ? '#34d399' : 'var(--text-muted)'
                  }}>
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: '0 0 4px 0', color: isSelected ? '#34d399' : '#fff' }}>
                      {doc.title.split('(')[0].trim()}
                    </h3>
                    <div style={{ display: 'flex', gap: '8px', fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                      <span>{doc.chunks_count} Semantic Chunks</span>
                      <span>•</span>
                      <span>{doc.sections.length} Sections</span>
                    </div>
                  </div>
                </div>
                <ChevronRight size={18} color={isSelected ? '#34d399' : 'var(--text-dim)'} />
              </div>
            );
          })}
        </div>

        {/* Selected Document Section Breakdown */}
        {selectedDoc && (
          <div className="glass-panel animate-fade-in" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
              <div>
                <span className="badge-tag" style={{ color: '#34d399', marginBottom: '6px' }}>
                  {selectedDoc.doc_name}
                </span>
                <h3 style={{ fontSize: '1.2rem', margin: 0, color: '#fff' }}>
                  {selectedDoc.title}
                </h3>
              </div>
              <span className="badge-grounded">
                <CheckCircle2 size={14} /> Ready for RRF
              </span>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                Extracted Sections & Clauses:
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedDoc.sections.map((sec, i) => (
                  <div key={i} style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.82rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                    <span>{sec}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(52, 211, 153, 0.2)', padding: '14px', borderRadius: '10px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <strong style={{ color: '#34d399' }}>RAG Ingestion Strategy:</strong> Markdown headers (<code>###</code>) define parent boundaries. Sub-paragraphs are chunked into 250-450 word units with 80-word overlap to ensure uninterrupted context for compound numerical queries.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
