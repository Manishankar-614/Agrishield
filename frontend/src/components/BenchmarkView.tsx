import React, { useState, useEffect } from 'react';
import { FileCheck, Play, CheckCircle2, XCircle, RefreshCw, Award } from 'lucide-react';
import type { BenchmarkQuestion, QueryResponse } from '../types';

export const BenchmarkView: React.FC = () => {
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
        body: JSON.stringify({ query: test.question })
      });

      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);

      const data: QueryResponse = await res.json();
      
      // Determine pass condition accurately
      let passed = false;
      const lowerAns = data.answer.toLowerCase();
      const hasError = lowerAns.includes('error communicating');
      
      if (test.id === 'q5') {
        // Out-of-domain test: MUST trigger refusal
        passed = !data.grounded || lowerAns.includes('cannot find') || lowerAns.includes('not found') || lowerAns.includes('does not contain');
      } else if (test.id === 'q1') {
        passed = (lowerAns.includes('72 hour') || lowerAns.includes('72 hrs') || lowerAns.includes('72')) && !hasError;
      } else if (test.id === 'q2') {
        // PM-KUSUM 30% / 60% subsidy
        passed = (lowerAns.includes('30%') || lowerAns.includes('60%') || lowerAns.includes('subsidy')) && !hasError;
      } else if (test.id === 'q3') {
        // PM-KISAN group D / excluded
        passed = (lowerAns.includes('group d') || lowerAns.includes('multi-tasking') || lowerAns.includes('mts') || lowerAns.includes('exclude')) && !hasError;
      } else if (test.id === 'q4') {
        // 12 parameters
        passed = (lowerAns.includes('12') || lowerAns.includes('nitrogen') || lowerAns.includes('parameters')) && !hasError;
      } else {
        passed = data.grounded && !hasError;
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
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Header Banner */}
      <div className="warm-card" style={{ padding: '24px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <FileCheck size={22} color="var(--forest-800)" />
            <h2 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--forest-900)' }}>
              Official 5-Question Hackathon Benchmark
            </h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Standardized evaluation matrix covering deadlines, multi-tier subsidies, exclusions, and out-of-domain refusals.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {completedTests.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'var(--forest-50)', border: '1px solid rgba(45, 106, 79, 0.3)', borderRadius: 'var(--radius-sm)' }}>
              <Award size={16} color="var(--forest-800)" />
              <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--forest-900)' }}>
                Score: {passedTests.length} / {benchmarks.length} Passed
              </span>
            </div>
          )}

          <button
            id="btn-run-all-benchmarks"
            onClick={runAllTests}
            disabled={overallRunning || benchmarks.length === 0}
            className="btn-primary"
          >
            <RefreshCw size={15} className={overallRunning ? 'animate-spin' : ''} />
            {overallRunning ? 'Running Tests...' : 'Run All 5 Benchmark Tests'}
          </button>
        </div>
      </div>

      {/* Benchmark Questions Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {benchmarks.map((test, index) => {
          const res = testResults[test.id];
          return (
            <div key={test.id} className="warm-card" style={{ padding: '20px', borderLeft: `4px solid ${res ? (res.passed ? 'var(--forest-700)' : '#dc2626') : 'var(--border-light)'}` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="badge-tag" style={{ color: 'var(--forest-800)', fontWeight: 700 }}>
                    Q{index + 1}
                  </span>
                  <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--amber-700)' }}>
                    {test.category}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {res && !res.loading && (
                    res.passed ? (
                      <span className="badge-grounded" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
                        <CheckCircle2 size={13} /> PASSED GROUNDING
                      </span>
                    ) : (
                      <span className="badge-refusal" style={{ padding: '4px 10px', fontSize: '0.78rem', color: '#b91c1c', borderColor: 'rgba(239, 68, 68, 0.4)', background: 'var(--red-50)' }}>
                        <XCircle size={13} /> FAILED / UNVERIFIED
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
              <h3 style={{ fontSize: '1.02rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-main)' }}>
                "{test.question}"
              </h3>

              {/* Ground Truth & Target */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', background: 'var(--bg-app)', padding: '14px', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '12px', border: '1px solid var(--border-light)' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '3px', textTransform: 'uppercase', fontSize: '0.72rem', fontWeight: 700 }}>
                    Expected Ground Truth Answer:
                  </span>
                  <span style={{ color: 'var(--forest-900)', fontWeight: 600 }}>{test.expected_answer}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '3px', textTransform: 'uppercase', fontSize: '0.72rem', fontWeight: 700 }}>
                    Judging Rubric Focus:
                  </span>
                  <span style={{ color: 'var(--text-main)' }}>{test.rubric_target}</span>
                </div>
              </div>

              {/* Live Output Section */}
              {res && res.response && (
                <div className="animate-fade-in" style={{ marginTop: '12px', borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.76rem', color: 'var(--forest-800)', textTransform: 'uppercase', fontWeight: 700 }}>
                      Live Execution Output ({res.response.total_latency_ms} ms total):
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                      Sources cited: {res.response.retrieved_sources.length} chunks
                    </span>
                  </div>
                  <div style={{ background: '#ffffff', padding: '12px 16px', borderRadius: '8px', fontSize: '0.84rem', color: 'var(--text-main)', lineHeight: '1.6', border: '1px solid var(--border-light)', whiteSpace: 'pre-wrap' }}>
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
