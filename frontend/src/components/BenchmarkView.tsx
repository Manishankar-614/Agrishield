import React, { useState, useEffect } from 'react';
import { FileCheck, Play, CheckCircle2, XCircle, RefreshCw, Award } from 'lucide-react';
import type { BenchmarkQuestion, QueryResponse } from '../types';

interface BenchmarkViewProps {
  apiKey: string;
}

export const BenchmarkView: React.FC<BenchmarkViewProps> = ({ apiKey }) => {
  const [benchmarks, setBenchmarks] = useState<BenchmarkQuestion[]>([]);
  const [testResults, setTestResults] = useState<{ [id: string]: { loading: boolean; response?: QueryResponse; passed?: boolean; error?: string } }>({});
  const [overallRunning, setOverallRunning] = useState(false);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/benchmark')
      .then(res => res.json())
      .then(data => {
        if (data.benchmark_questions) {
          setBenchmarks(data.benchmark_questions);
        }
      })
      .catch(err => console.error('Error fetching benchmarks:', err));
  }, []);

  const runSingleTest = async (test: BenchmarkQuestion) => {
    setTestResults(prev => ({
      ...prev,
      [test.id]: { loading: true }
    }));

    try {
      const res = await fetch('http://127.0.0.1:8000/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: test.question, api_key: apiKey || undefined })
      });

      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);

      const data: QueryResponse = await res.json();
      
      // Determine pass condition
      let passed = false;
      const lowerAns = data.answer.toLowerCase();
      
      if (test.id === 'q5') {
        // Out-of-domain test: MUST trigger refusal
        passed = !data.grounded || lowerAns.includes('cannot find') || lowerAns.includes('not found') || lowerAns.includes('does not contain');
      } else if (test.id === 'q1') {
        passed = lowerAns.includes('72 hour') || lowerAns.includes('72 hrs');
      } else if (test.id === 'q2') {
        passed = lowerAns.includes('30%') && (lowerAns.includes('central') || lowerAns.includes('state') || lowerAns.includes('60%'));
      } else if (test.id === 'q3') {
        passed = lowerAns.includes('excluded') && (lowerAns.includes('group d') || lowerAns.includes('multi-tasking') || lowerAns.includes('mts'));
      } else if (test.id === 'q4') {
        passed = lowerAns.includes('12') && (lowerAns.includes('nitrogen') || lowerAns.includes('macro') || lowerAns.includes('ph'));
      } else {
        passed = data.grounded;
      }

      setTestResults(prev => ({
        ...prev,
        [test.id]: { loading: false, response: data, passed }
      }));
    } catch (err: any) {
      setTestResults(prev => ({
        ...prev,
        [test.id]: { loading: false, error: err.message, passed: false }
      }));
    }
  };

  const runAllTests = async () => {
    setOverallRunning(true);
    for (const test of benchmarks) {
      await runSingleTest(test);
    }
    setOverallRunning(false);
  };

  const completedTests = Object.keys(testResults).filter(k => !testResults[k].loading);
  const passedTests = Object.keys(testResults).filter(k => testResults[k].passed);

  return (
    <div style={{ maxWidth: '1350px', margin: '0 auto', padding: '24px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <FileCheck size={24} color="#10b981" />
            <h2 style={{ fontSize: '1.35rem', margin: 0 }}>Official 5-Question Hackathon Benchmark</h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Standardized evaluation matrix covering numerical deadlines, multi-tier subsidies, exclusion exceptions, and strict out-of-domain refusals.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {completedTests.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(52, 211, 153, 0.3)', borderRadius: '8px' }}>
              <Award size={18} color="#34d399" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                Score: <strong style={{ color: '#34d399' }}>{passedTests.length} / {benchmarks.length} Passed</strong>
              </span>
            </div>
          )}

          <button
            id="btn-run-all-benchmarks"
            onClick={runAllTests}
            disabled={overallRunning || benchmarks.length === 0}
            className="btn-primary"
          >
            <RefreshCw size={16} className={overallRunning ? 'animate-spin' : ''} />
            {overallRunning ? 'Running Test Suite...' : 'Run All 5 Benchmark Tests'}
          </button>
        </div>
      </div>

      {/* Benchmark Questions Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {benchmarks.map((test, index) => {
          const res = testResults[test.id];
          return (
            <div key={test.id} className="glass-panel" style={{ padding: '20px', borderLeft: `4px solid ${res ? (res.passed ? '#10b981' : '#ef4444') : 'var(--border-color)'}` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="badge-tag" style={{ color: '#6ee7b7' }}>
                    Q{index + 1}
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--amber-400)' }}>
                    {test.category}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {res && !res.loading && (
                    res.passed ? (
                      <span className="badge-grounded" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
                        <CheckCircle2 size={14} /> PASSED GROUNDING
                      </span>
                    ) : (
                      <span className="badge-refusal" style={{ padding: '4px 10px', fontSize: '0.78rem', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.4)' }}>
                        <XCircle size={14} /> FAILED / UNVERIFIED
                      </span>
                    )
                  )}

                  <button
                    id={`btn-run-test-${test.id}`}
                    onClick={() => runSingleTest(test)}
                    disabled={res?.loading}
                    className="btn-secondary"
                    style={{ padding: '5px 12px', fontSize: '0.78rem' }}
                  >
                    <Play size={12} />
                    {res?.loading ? 'Running...' : 'Run Test'}
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '12px', color: '#f8fafc' }}>
                "{test.question}"
              </h3>

              {/* Ground Truth & Target */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '14px' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '3px', textTransform: 'uppercase', fontSize: '0.72rem', fontWeight: 600 }}>
                    Expected Ground Truth Answer:
                  </span>
                  <span style={{ color: '#a7f3d0' }}>{test.expected_answer}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '3px', textTransform: 'uppercase', fontSize: '0.72rem', fontWeight: 600 }}>
                    Judging Rubric Focus:
                  </span>
                  <span style={{ color: '#cbd5e1' }}>{test.rubric_target}</span>
                </div>
              </div>

              {/* Live Output Section */}
              {res && res.response && (
                <div className="animate-fade-in" style={{ marginTop: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.76rem', color: '#34d399', textTransform: 'uppercase', fontWeight: 600 }}>
                      Live System Execution Result ({res.response.total_latency_ms} ms total):
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                      Sources cited: {res.response.retrieved_sources.length} chunks
                    </span>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.5)', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', color: '#e2e8f0', lineHeight: '1.6' }}>
                    {res.response.answer}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
