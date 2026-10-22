import React, { useState, useEffect } from 'react';
import {
  Layers,
  FileText,
  FilePlus,
  Upload,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  RefreshCw,
  XCircle,
  FileCode
} from 'lucide-react';
import type { DocumentSummary } from '../types';
import { API_BASE_URL } from '../apiConfig';

const VALID_SAMPLE = {
  title: "National Mission on Natural Farming (NMNF) 2026 Guidelines",
  content: `# NATIONAL MISSION ON NATURAL FARMING (NMNF) GUIDELINES
**Ministry:** Ministry of Agriculture and Farmers Welfare (MoA&FW), Government of India
**Objective:** Promotion of chemical-free and climate-resilient natural farming across agricultural clusters.

### Financial Assistance & Farmer Incentives
* **Incentive per Hectare:** Farmers adopting natural farming receive financial support of **Rs. 15,000 per hectare for 3 years** (disbursed as Rs. 5,000 annually) to compensate for initial yield variations during transition from chemical farming.
* **On-Farm Bio-Input Resource Centres (BRC):** Financial assistance of **Rs. 1.00 Lakh** is provided for establishing village-level Bio-Input Resource Centres to produce Jeevamrit, Beejamrit, and botanical bio-pesticides.
* **Cluster Requirement:** Implemented in contiguous gram panchayat clusters of at least 50 hectares involving 50 or more smallholder farmers.`
};

const INVALID_SAMPLE = {
  title: "Introduction to React Hooks & State Management",
  content: `# REACT HOOKS CHEATSHEET
React 19 introduces automated compiler optimizations and eliminates manual useCallback hooks in frontend web development. Redux Toolkit and Zustand manage client-side stores.`
};

export const KnowledgeBaseView: React.FC = () => {
  const [docs, setDocs] = useState<DocumentSummary[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentSummary | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadMode, setUploadMode] = useState<'file' | 'text'>('file');

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileTitle, setFileTitle] = useState('');
  
  // Text upload state
  const [textTitle, setTextTitle] = useState('');
  const [textContent, setTextContent] = useState('');

  const [loading, setLoading] = useState(false);
  const [successResult, setSuccessResult] = useState<any | null>(null);
  const [rejectionError, setRejectionError] = useState<string | null>(null);

  const fetchDocuments = () => {
    fetch(`${API_BASE_URL}/api/documents`)
      .then(res => res.json())
      .then(data => {
        if (data.documents) {
          setDocs(data.documents);
          if (data.documents.length > 0 && !selectedDoc) {
            setSelectedDoc(data.documents[0]);
          }
        }
      })
      .catch(err => console.error('Error fetching documents:', err));
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setLoading(true);
    setSuccessResult(null);
    setRejectionError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    if (fileTitle.trim()) {
      formData.append('custom_title', fileTitle.trim());
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/upload-file`, {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok) {
        setRejectionError(data.detail || 'File rejected by domain guardrail.');
      } else {
        setSuccessResult(data);
        setSelectedFile(null);
        setFileTitle('');
        fetchDocuments();
      }
    } catch (err: any) {
      setRejectionError(err.message || 'Failed to upload file.');
    } finally {
      setLoading(false);
    }
  };

  const handleTextUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textTitle.trim() || !textContent.trim()) return;

    setLoading(true);
    setSuccessResult(null);
    setRejectionError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: textTitle, content: textContent })
      });

      const data = await res.json();
      if (!res.ok) {
        setRejectionError(data.detail || 'Document rejected by domain guardrail.');
      } else {
        setSuccessResult(data);
        setTextTitle('');
        setTextContent('');
        fetchDocuments();
      }
    } catch (err: any) {
      setRejectionError(err.message || 'Failed to submit document.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Header Banner */}
      <div className="warm-card" style={{ padding: '24px', marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--forest-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--forest-800)' }}>
              <Layers size={20} />
            </div>
            <h2 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--forest-900)' }}>
              Agricultural Policy Knowledge Base
            </h2>
          </div>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: 0 }}>
            {docs.length} Official Guidelines Indexed • Supported Formats: <strong>PDF, Word (.docx), Excel (.xlsx), Markdown</strong>
          </p>
        </div>

        <button
          id="btn-toggle-upload"
          onClick={() => {
            setShowUploadModal(!showUploadModal);
            setSuccessResult(null);
            setRejectionError(null);
          }}
          className="btn-primary"
        >
          <FilePlus size={16} />
          {showUploadModal ? 'Close Uploader' : 'Add Policy Document'}
        </button>
      </div>

      {/* Embedded Document Uploader Panel */}
      {showUploadModal && (
        <div className="warm-card animate-fade-in" style={{ padding: '28px', marginBottom: '32px', border: '1px solid var(--forest-600)', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', borderBottom: '1px solid var(--border-light)', paddingBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '1.18rem', margin: '0 0 4px 0', color: 'var(--forest-900)' }}>
                Upload & Ingest New Policy Manual
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                Automatic <strong>Agricultural Domain Guardrail</strong> rejects non-farming files to prevent knowledge base pollution.
              </p>
            </div>

            {/* Mode Switcher */}
            <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-app)', padding: '4px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
              <button
                type="button"
                onClick={() => setUploadMode('file')}
                className={uploadMode === 'file' ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '6px 12px', fontSize: '0.78rem' }}
              >
                <Upload size={13} />
                Upload File (PDF / Word / Excel)
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('text')}
                className={uploadMode === 'text' ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '6px 12px', fontSize: '0.78rem' }}
              >
                <FileCode size={13} />
                Paste Text / Markdown
              </button>
            </div>
          </div>

          {/* Preset Buttons for Demo */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', alignSelf: 'center', fontWeight: 600 }}>
              Demo Presets:
            </span>
            <button
              type="button"
              onClick={() => {
                setUploadMode('text');
                setTextTitle(VALID_SAMPLE.title);
                setTextContent(VALID_SAMPLE.content);
              }}
              className="btn-secondary"
              style={{ fontSize: '0.78rem', padding: '5px 10px', borderColor: 'rgba(45, 106, 79, 0.4)' }}
            >
              <CheckCircle2 size={13} color="var(--forest-800)" />
              Valid Agri Sample (NMNF)
            </button>
            <button
              type="button"
              onClick={() => {
                setUploadMode('text');
                setTextTitle(INVALID_SAMPLE.title);
                setTextContent(INVALID_SAMPLE.content);
              }}
              className="btn-secondary"
              style={{ fontSize: '0.78rem', padding: '5px 10px', borderColor: 'rgba(185, 28, 28, 0.4)', color: '#b91c1c' }}
            >
              <XCircle size={13} color="#b91c1c" />
              Out-of-Domain Sample (Test Rejection)
            </button>
          </div>

          {/* Mode 1: File Upload Form (PDF, DOCX, XLSX) */}
          {uploadMode === 'file' ? (
            <form onSubmit={handleFileUpload} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Select File (PDF, DOCX, XLSX, TXT)
                </label>
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.xlsx,.xls,.txt,.md"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px dashed var(--border-strong)',
                    background: 'var(--bg-app)',
                    fontSize: '0.88rem'
                  }}
                />
                {selectedFile && (
                  <div style={{ fontSize: '0.76rem', color: 'var(--forest-800)', marginTop: '4px', fontWeight: 600 }}>
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Custom Scheme Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Karnataka Krishi Bhagya Scheme 2026"
                  value={fileTitle}
                  onChange={(e) => setFileTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    fontSize: '0.9rem',
                    background: '#ffffff'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="submit"
                  disabled={loading || !selectedFile}
                  className="btn-primary"
                  style={{ padding: '9px 22px' }}
                >
                  {loading ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" />
                      Parsing & Verifying Domain...
                    </>
                  ) : (
                    <>
                      <Upload size={15} />
                      Verify Domain & Ingest File
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Mode 2: Text / Markdown Upload */
            <form onSubmit={handleTextUpload} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Document Scheme Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. National Mission on Natural Farming Operational Guidelines"
                  value={textTitle}
                  onChange={(e) => setTextTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    fontSize: '0.9rem',
                    background: '#ffffff'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Document Content (Markdown / Text)
                </label>
                <textarea
                  rows={6}
                  placeholder="Paste policy text or circular guidelines..."
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    fontSize: '0.86rem',
                    fontFamily: 'var(--font-mono)',
                    background: '#ffffff'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="submit"
                  disabled={loading || !textTitle.trim() || !textContent.trim()}
                  className="btn-primary"
                  style={{ padding: '9px 22px' }}
                >
                  {loading ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" />
                      Validating Domain...
                    </>
                  ) : (
                    <>
                      <FilePlus size={15} />
                      Verify Domain & Ingest Text
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Success Banner */}
          {successResult && (
            <div className="warm-card animate-fade-in" style={{ padding: '16px 20px', marginTop: '18px', background: 'var(--forest-50)', borderColor: 'rgba(45, 106, 79, 0.4)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <CheckCircle2 size={20} color="var(--forest-800)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontSize: '0.95rem', margin: '0 0 2px 0', color: 'var(--forest-900)' }}>
                    Document Approved & Successfully Indexed!
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--forest-800)', margin: 0 }}>
                    {successResult.message} Knowledge base now contains <strong>{successResult.total_chunks} chunks</strong> across <strong>{successResult.total_documents} circulars</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Rejection Alert */}
          {rejectionError && (
            <div className="warm-card animate-fade-in" style={{ padding: '16px 20px', marginTop: '18px', background: 'var(--red-50)', borderColor: 'rgba(185, 28, 28, 0.4)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <AlertTriangle size={20} color="#b91c1c" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontSize: '0.95rem', margin: '0 0 2px 0', color: 'var(--red-700)' }}>
                    Document Rejected: Domain Guardrail Enforced
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: '#7f1d1d', margin: 0 }}>
                    {rejectionError}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Docs Grid Explorer */}
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

        {/* Selected Document Section Breakdown */}
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
              <strong>Pipeline Step 01 (Ingestion):</strong> Guidelines are split along structural section boundaries (<code>###</code>) with 80-word overlap to ensure uninterrupted context for compound numerical queries.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
