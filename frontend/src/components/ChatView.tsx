import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Zap,
  BookOpen,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  Bot,
  User,
  Volume2,
  VolumeX,
  ExternalLink
} from 'lucide-react';
import type { QueryResponse } from '../types';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  responseMeta?: QueryResponse;
}

const SAMPLE_QUESTIONS = [
  {
    tag: "⏱️ 72-Hour Claim Rule",
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

// Natural formatting helper that eliminates raw markdown symbols and presents clean, readable typography
const renderNaturalContent = (rawText: string) => {
  // Strip out any markdown symbols like #, ##, ###, **, *, `
  const cleaned = rawText
    .replace(/^#+\s*/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1');

  const lines = cleaned.split('\n');
  const blocks: React.ReactNode[] = [];
  let currentList: string[] = [];

  const flushList = () => {
    if (currentList.length > 0) {
      blocks.push(
        <ul
          key={`list-${blocks.length}`}
          style={{
            margin: '8px 0 12px 0',
            paddingLeft: 0,
            listStyleType: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          {currentList.map((item, idx) => (
            <li
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                lineHeight: '1.6',
                color: 'var(--text-main)',
                fontSize: '0.92rem'
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--forest-600)',
                  marginTop: '8px',
                  flexShrink: 0
                }}
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      return;
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
      currentList.push(trimmed.substring(2));
    } else if (/^\d+[\.\)]\s+/.test(trimmed)) {
      currentList.push(trimmed.replace(/^\d+[\.\)]\s+/, ''));
    } else {
      flushList();
      blocks.push(
        <p
          key={`p-${idx}`}
          style={{
            margin: '0 0 10px 0',
            lineHeight: '1.7',
            color: 'var(--text-main)',
            fontSize: '0.93rem'
          }}
        >
          {trimmed}
        </p>
      );
    }
  });

  flushList();
  return <div>{blocks}</div>;
};

export const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedSources, setExpandedSources] = useState<{ [msgId: string]: boolean }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSpeak = (text: string, id: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanForSpeech = text.replace(/\[Source:.*?\]/g, '').replace(/[-•*#]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanForSpeech);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (queryText?: string) => {
    const q = (queryText || input).trim();
    if (!q || loading) return;

    const userMsgId = `user_${Date.now()}`;
    const newMessages: ChatMessage[] = [
      ...messages,
      {
        id: userMsgId,
        sender: 'user',
        text: q,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];

    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q })
      });

      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);

      const data: QueryResponse = await res.json();
      const assistantMsgId = `asst_${Date.now()}`;

      setMessages([
        ...newMessages,
        {
          id: assistantMsgId,
          sender: 'assistant',
          text: data.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          responseMeta: data
        }
      ]);
      // Auto-expand sources by default
      setExpandedSources(prev => ({ ...prev, [assistantMsgId]: true }));
    } catch (err: any) {
      setMessages([
        ...newMessages,
        {
          id: `err_${Date.now()}`,
          sender: 'assistant',
          text: `⚠️ Error retrieving answer: ${err.message || 'Server connection failed.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleSources = (msgId: string) => {
    setExpandedSources(prev => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="chat-container">
      {/* Chat Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--border-light)',
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'var(--forest-100)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--forest-800)'
          }}>
            <Bot size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--forest-900)', fontWeight: 700 }}>
              AgriShield Policy Assistant
            </h2>
            <span style={{ fontSize: '0.72rem', color: 'var(--forest-700)', fontWeight: 600 }}>
              Grounded in 6 Official Government Circulars
            </span>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.78rem' }}
          >
            <RotateCcw size={13} />
            Clear Chat
          </button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div style={{ margin: 'auto', textAlign: 'center', maxWidth: '600px', padding: '32px 16px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'var(--forest-100)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--forest-800)',
              margin: '0 auto 18px auto',
              boxShadow: '0 4px 12px rgba(27,67,50,0.1)'
            }}>
              <Shield size={32} />
            </div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--forest-900)', margin: '0 0 8px 0' }}>
              Welcome to AgriShield Chat
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6', margin: '0 0 24px 0' }}>
              Ask questions regarding agricultural subsidies, claim windows, or eligibility guidelines. All answers are strictly cited from official operational circulars.
            </p>

            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '10px' }}>
                Try one of these sample queries:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {SAMPLE_QUESTIONS.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(s.text)}
                    className="warm-card"
                    style={{
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      textAlign: 'left',
                      background: '#ffffff'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--forest-800)', display: 'block', marginBottom: '2px' }}>
                        {s.tag}
                      </span>
                      <span style={{ fontSize: '0.84rem', color: 'var(--text-main)' }}>
                        "{s.text}"
                      </span>
                    </div>
                    <Sparkles size={16} color="var(--forest-700)" style={{ flexShrink: 0 }} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} style={{ display: 'flex', flexDirection: 'column' }}>
              {msg.sender === 'user' ? (
                <div className="chat-bubble-user animate-fade-in">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', opacity: 0.8, marginBottom: '4px' }}>
                    <User size={12} />
                    <span>You • {msg.timestamp}</span>
                  </div>
                  <div>{msg.text}</div>
                </div>
              ) : (
                <div className="chat-bubble-assistant animate-fade-in">
                  {/* Assistant Header Badge & Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'var(--forest-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--forest-800)' }}>
                        <Bot size={14} />
                      </div>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--forest-900)' }}>
                        AgriShield
                      </span>
                      {msg.responseMeta && (
                        msg.responseMeta.grounded ? (
                          <span className="badge-grounded" style={{ padding: '3px 8px', fontSize: '0.7rem' }}>
                            <CheckCircle2 size={12} /> Grounded
                          </span>
                        ) : (
                          <span className="badge-refusal" style={{ padding: '3px 8px', fontSize: '0.7rem' }}>
                            <AlertTriangle size={12} /> Refusal
                          </span>
                        )
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {/* Voice Listen Button */}
                      <button
                        onClick={() => handleSpeak(msg.text, msg.id)}
                        title={speakingId === msg.id ? "Stop reading" : "Read aloud in natural voice"}
                        style={{
                          background: speakingId === msg.id ? 'var(--forest-100)' : 'transparent',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '3px 7px',
                          cursor: 'pointer',
                          color: speakingId === msg.id ? 'var(--forest-800)' : 'var(--text-dim)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.72rem',
                          fontWeight: speakingId === msg.id ? 700 : 500
                        }}
                      >
                        {speakingId === msg.id ? <VolumeX size={13} color="var(--forest-800)" /> : <Volume2 size={13} />}
                        <span>{speakingId === msg.id ? "Stop" : "Listen"}</span>
                      </button>

                      {/* Copy clean text */}
                      <button
                        onClick={() => handleCopy(msg.text.replace(/[*#]/g, ''), msg.id)}
                        title="Copy answer"
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--text-dim)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          padding: '3px 6px',
                          fontSize: '0.72rem'
                        }}
                      >
                        {copiedId === msg.id ? <Check size={12} color="var(--forest-800)" /> : <Copy size={12} />}
                      </button>

                      {msg.responseMeta && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} /> {msg.responseMeta.total_latency_ms} ms
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Main Natural Synthesized Text */}
                  <div style={{ margin: '8px 0 4px 0' }}>
                    {renderNaturalContent(msg.text)}
                  </div>

                  {/* Expandable Citations Drawer - Top 3 Verified Sources with Official Links */}
                  {msg.responseMeta && msg.responseMeta.retrieved_sources && msg.responseMeta.retrieved_sources.length > 0 && (
                    <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
                      <button
                        onClick={() => toggleSources(msg.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--forest-800)',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: 0
                        }}
                      >
                        <BookOpen size={14} />
                        <span>{Math.min(3, msg.responseMeta.retrieved_sources.length)} Top Verified Sources Cited</span>
                        {expandedSources[msg.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>

                      {expandedSources[msg.id] && (
                        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {msg.responseMeta.retrieved_sources.slice(0, 3).map((item, i) => (
                            <div
                              key={i}
                              style={{
                                background: 'var(--bg-app)',
                                border: '1px solid var(--border-light)',
                                borderRadius: '8px',
                                padding: '10px 12px',
                                fontSize: '0.78rem'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                                <span style={{ fontWeight: 700, color: 'var(--forest-900)' }}>
                                  [{i + 1}] {item.chunk.scheme.split('(')[0].trim()} — {item.chunk.section}
                                </span>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  {item.chunk.source_url && (
                                    <a
                                      href={item.chunk.source_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      title="Open official scheme portal"
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        color: 'var(--forest-800)',
                                        textDecoration: 'none',
                                        fontWeight: 600,
                                        fontSize: '0.72rem',
                                        background: 'var(--forest-100)',
                                        border: '1px solid var(--forest-200)',
                                        padding: '2px 8px',
                                        borderRadius: '4px'
                                      }}
                                    >
                                      <span>Official Portal</span>
                                      <ExternalLink size={11} />
                                    </a>
                                  )}
                                  <button
                                    onClick={() => handleCopy(item.chunk.content, `${msg.id}_${i}`)}
                                    title="Copy excerpt"
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem' }}
                                  >
                                    {copiedId === `${msg.id}_${i}` ? <Check size={11} color="var(--forest-800)" /> : <Copy size={11} />}
                                  </button>
                                </div>
                              </div>
                              <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', whiteSpace: 'pre-wrap', lineHeight: '1.45' }}>
                                {item.chunk.content.slice(0, 260)}...
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}

        {loading && (
          <div className="chat-bubble-assistant animate-fade-in" style={{ width: '220px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--forest-800)', fontSize: '0.84rem' }}>
              <Zap size={16} className="animate-spin" />
              <span>Synthesizing answer...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Sticky Bottom Chat Input Bar */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid var(--border-light)',
        background: '#ffffff',
        flexShrink: 0
      }}>
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
          <textarea
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about subsidies, claim hours, drone grants, or soil parameters... (Press Enter to send)"
            style={{
              flex: 1,
              padding: '12px 14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-light)',
              background: 'var(--bg-app)',
              color: 'var(--text-main)',
              fontSize: '0.94rem',
              outline: 'none',
              resize: 'none',
              lineHeight: '1.4'
            }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="btn-primary"
            style={{ height: '48px', padding: '0 20px' }}
          >
            <Send size={16} />
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
