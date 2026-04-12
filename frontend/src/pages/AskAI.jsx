import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';

const AskAI = () => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState('checking');
  const chatEndRef = useRef(null);

  useEffect(() => {
    api.get('/ai-doubt/health')
      .then(() => setAiStatus('online'))
      .catch(() => setAiStatus('offline'));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!question.trim() || loading) return;
    const q = question.trim();
    setQuestion('');
    setMessages(prev => [...prev, { type: 'user', text: q }]);
    setLoading(true);

    try {
      const res = await api.post('/ai-doubt/chat', {
        question: q,
        history: messages,
        show_steps: true
      });
      setMessages(prev => [...prev, { type: 'bot', data: res.data }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        type: 'bot',
        data: { status: 'error', answer: err.response?.data?.error || 'Failed to get response. Make sure the AI service is running.' }
      }]);
    }
    setLoading(false);
  };

  const statusColor = aiStatus === 'online' ? '#10b981' : aiStatus === 'offline' ? '#ef4444' : '#fbbf24';

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 180px)' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
        padding: '1.5rem 2rem', borderRadius: '20px', color: 'white', marginBottom: '1rem',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-50%', right: '-10%', width: '250px', height: '250px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.25rem 0' }}>AI Doubt Clarification</h1>
            <p style={{ fontSize: '0.9rem', opacity: 0.85, margin: 0 }}>Ask any academic question and get instant AI-powered answers</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.15)', padding: '0.4rem 0.8rem', borderRadius: '20px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusColor }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>{aiStatus === 'online' ? 'AI Online' : aiStatus === 'offline' ? 'AI Offline' : 'Checking...'}</span>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '1rem',
        background: 'var(--bg-primary)', borderRadius: '16px',
        border: '1px solid var(--border-light)', marginBottom: '1rem'
      }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 1rem', opacity: 0.5 }}>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Ask your first question</p>
            <p style={{ fontSize: '0.85rem' }}>Type any academic doubt below to get an AI-powered answer with source references</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
            marginBottom: '1rem'
          }}>
            <div style={{
              maxWidth: '80%', padding: '1rem 1.25rem', borderRadius: '16px',
              background: msg.type === 'user'
                ? 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)'
                : 'var(--bg-secondary)',
              color: msg.type === 'user' ? 'white' : 'var(--text-primary)',
              border: msg.type === 'bot' ? '1px solid var(--border-light)' : 'none'
            }}>
              {msg.type === 'user' ? (
                <p style={{ margin: 0, lineHeight: 1.6 }}>{msg.text}</p>
              ) : (
                <div>
                  {msg.data.status === 'error' ? (
                    <p style={{ margin: 0, color: '#ef4444' }}>{msg.data.answer || msg.data.message}</p>
                  ) : msg.data.final_status === 'REJECTED' ? (
                    <p style={{ margin: 0, color: 'var(--text-muted)' }}>{msg.data.message || 'This question is not related to the subject. Please ask an academic question.'}</p>
                  ) : (
                    <>
                      <p style={{ margin: '0 0 0.75rem 0', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{msg.data.answer}</p>
                      {msg.data.sources && msg.data.sources.length > 0 && (
                        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 0.25rem 0', fontWeight: 600 }}>Sources:</p>
                          {msg.data.sources.map((src, j) => (
                            <span key={j} style={{
                              display: 'inline-block', fontSize: '0.7rem', background: 'var(--bg-primary)',
                              padding: '0.2rem 0.5rem', borderRadius: '4px', margin: '0.15rem', color: 'var(--text-muted)'
                            }}>{src}</span>
                          ))}
                        </div>
                      )}
                      {msg.data.confidence_score && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', margin: '0.5rem 0 0 0' }}>
                          Confidence: {Math.round(msg.data.confidence_score * 100)}%
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ padding: '1rem 1.25rem', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{
                    width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6',
                    animation: `bounce 1.4s infinite ${i * 0.2}s`
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div style={{
        display: 'flex', gap: '0.75rem', padding: '1rem',
        background: 'var(--bg-primary)', borderRadius: '16px',
        border: '1px solid var(--border-light)'
      }}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={aiStatus === 'offline' ? 'AI service is offline...' : 'Ask your academic doubt...'}
          disabled={aiStatus === 'offline' || loading}
          style={{
            flex: 1, padding: '0.75rem 1rem', borderRadius: '12px',
            border: '1px solid var(--border-light)', background: 'var(--bg-secondary)',
            color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none'
          }}
        />
        <button
          onClick={handleSend}
          disabled={!question.trim() || loading || aiStatus === 'offline'}
          style={{
            padding: '0.75rem 1.5rem', borderRadius: '12px', border: 'none',
            background: question.trim() && !loading ? 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' : 'var(--bg-secondary)',
            color: question.trim() && !loading ? 'white' : 'var(--text-muted)',
            fontWeight: 600, cursor: question.trim() && !loading ? 'pointer' : 'not-allowed',
            fontSize: '0.9rem'
          }}
        >
          {loading ? '...' : 'Ask'}
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
};

export default AskAI;
