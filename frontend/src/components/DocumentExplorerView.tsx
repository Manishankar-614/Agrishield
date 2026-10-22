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
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Header Banner */}
      <div className="warm-card" style={{ padding: '24px', marginBottom: '24px' }}>
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
            <Layers size={20} />
          </div>
          <h2 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--forest-900)' }}>
            Agricultural Policy Knowledge Base
          </h2>
        </div>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: 0 }}>
          Demonstrates <strong>Pipeline Step 01 (Ingestion)</strong>: {docs.length} verified government guidelines parsed by section headers into cohesive semantic chunks.
        </p>
      </div>

      {/* Docs Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.4fr)', gap: '24px' }}>
        {/* Document Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {docs.map((doc) => {
            const isSelected = selectedDoc?.doc_name === doc.doc_name;
            return (
              <div
                key={doc.doc_name}
                onClick={() => setSelectedDoc(doc)}
                className="warm-card"
                style={{
                  padding: '16px 18px',
                  cursor: 'pointer',
                  borderColor: isSelected ? 'var(--forest-700)' : 'var(--border-light)',
                  background: isSelected ? 'var(--forest-50)' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: isSelected ? 'var(--shadow-sm)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    background: isSelected ? 'var(--forest-100)' : 'var(--bg-app)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isSelected ? 'var(--forest-800)' : 'var(--text-dim)'
                  }}>
                    <FileText size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.92rem', fontWeight: 700, margin: '0 0 3px 0', color: 'var(--forest-900)' }}>
                      {doc.title.split('(')[0].trim()}
                    </h3>
                    <div style={{ display: 'flex', gap: '8px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      <span>{doc.chunks_count} Chunks</span>
                      <span>•</span>
                      <span>{doc.sections.length} Sections</span>
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} color={isSelected ? 'var(--forest-700)' : 'var(--text-dim)'} />
              </div>
            );
          })}
        </div>

        {/* Selected Document Breakdown */}
        {selectedDoc && (
          <div className="warm-card animate-fade-in" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '14px' }}>
              <div>
                <span className="badge-tag" style={{ color: 'var(--forest-800)', marginBottom: '4px' }}>
                  {selectedDoc.doc_name}
                </span>
                <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--forest-900)' }}>
                  {selectedDoc.title}
                </h3>
              </div>
              <span className="badge-grounded">
                <CheckCircle2 size={13} /> Active in Index
              </span>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                Extracted Sections & Clauses:
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedDoc.sections.map((sec, i) => (
                  <div key={i} style={{ background: 'var(--bg-app)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.82rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--forest-700)' }} />
                    <span>{sec}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--forest-50)', border: '1px solid rgba(45, 106, 79, 0.25)', padding: '12px 14px', borderRadius: '8px', fontSize: '0.78rem', color: 'var(--forest-900)' }}>
              <strong>RAG Ingestion Strategy:</strong> Markdown headers define parent boundaries. Sub-paragraphs are chunked into 250-450 word units with 80-word overlap to ensure uninterrupted context for compound numerical queries.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
