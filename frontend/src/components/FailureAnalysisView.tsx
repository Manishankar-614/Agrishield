import React, { useState, useEffect } from 'react';
import { AlertCircle, Bug, CheckCircle, Cpu, Zap, GitBranch, ShieldAlert } from 'lucide-react';
import type { FailureCase } from '../types';
import { API_BASE_URL } from '../apiConfig';

export const FailureAnalysisView: React.FC = () => {
  const [failures, setFailures] = useState<FailureCase[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/benchmark`)
      .then(res => res.json())
      .then(data => {
        if (data.failure_analyses) {
          setFailures(data.failure_analyses);
        }
      })
      .catch(err => console.error('Error fetching failure analysis:', err));
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
            background: 'var(--amber-100)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--amber-700)'
          }}>
            <Bug size={20} />
          </div>
          <h2 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--forest-900)' }}>
            Honest Failure Analysis & System Upgrades
          </h2>
        </div>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: 0 }}>
          As required by the Judging Rubric, this section documents real failure modes encountered during development, their root causes, and the concrete mitigations engineered into AgriShield.
        </p>
      </div>

      {/* Failure Cases Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {failures.map((f, idx) => (
          <div key={f.case_id} className="warm-card" style={{ padding: '24px', borderTop: '3px solid var(--amber-600)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span className="badge-tag" style={{ color: 'var(--amber-700)', fontWeight: 700 }}>
                Failure Case {idx + 1}
              </span>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                {f.case_id}
              </span>
            </div>

            <h3 style={{ fontSize: '1.08rem', fontWeight: 700, marginBottom: '10px', color: 'var(--forest-900)' }}>
              {f.title}
            </h3>

            {/* Test Query Box */}
            <div style={{ background: 'var(--bg-app)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '14px', border: '1px solid var(--border-light)' }}>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700, marginBottom: '2px' }}>
                Trigger Query:
              </span>
              <code style={{ color: 'var(--forest-800)', fontWeight: 600 }}>"{f.query_example}"</code>
            </div>

            {/* Failure Mode & Root Cause */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              <div style={{ background: 'var(--red-50)', border: '1px solid rgba(239, 68, 68, 0.25)', padding: '12px', borderRadius: '8px' }}>
                <span style={{ color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                  <AlertCircle size={13} /> Observed Failure Mode
                </span>
                <p style={{ fontSize: '0.82rem', color: '#7f1d1d', margin: 0, lineHeight: '1.5' }}>
                  {f.failure_mode}
                </p>
              </div>

              <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-light)', padding: '12px', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                  Underlying Root Cause
                </span>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', margin: 0, lineHeight: '1.5' }}>
                  {f.cause}
                </p>
              </div>
            </div>

            {/* Implemented Mitigation */}
            <div style={{ background: 'var(--forest-50)', border: '1px solid rgba(45, 106, 79, 0.3)', padding: '14px', borderRadius: '8px' }}>
              <span style={{ color: 'var(--forest-800)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                <CheckCircle size={14} /> Implemented System Mitigation
              </span>
              <p style={{ fontSize: '0.82rem', color: 'var(--forest-900)', margin: 0, lineHeight: '1.5' }}>
                {f.mitigation_implemented}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Upgrades Section */}
      <div className="warm-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Cpu size={18} color="var(--forest-800)" />
          <h3 style={{ fontSize: '1.15rem', margin: 0, color: 'var(--forest-900)' }}>
            Architectural Upgrades (Creativity & Upgrades Rubric)
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
          <div style={{ background: 'var(--bg-app)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--forest-800)', fontWeight: 700, marginBottom: '6px', fontSize: '0.88rem' }}>
              <GitBranch size={15} /> 1. Hybrid Lexical-Dense RRF
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              Combines BM25Okapi lexical matching with dense SentenceTransformer embeddings via rank reciprocal fusion ($k=60$).
            </p>
          </div>

          <div style={{ background: 'var(--bg-app)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--forest-800)', fontWeight: 700, marginBottom: '6px', fontSize: '0.88rem' }}>
              <Zap size={15} /> 2. Query Expansion Engine
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              Translates acronyms (e.g., 'kusum', 'pmfby', 'shc') into full statutory terms to prevent keyword mismatch.
            </p>
          </div>

          <div style={{ background: 'var(--bg-app)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--forest-800)', fontWeight: 700, marginBottom: '6px', fontSize: '0.88rem' }}>
              <ShieldAlert size={15} /> 3. Domain Upload Guardrail
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              Rejects any non-agricultural document uploaded to prevent corpus pollution and hallucination risks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
