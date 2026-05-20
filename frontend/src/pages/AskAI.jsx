import React, { useState, useRef, useEffect, useCallback } from 'react';
import api from '../services/api';

const AskAI = () => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const chatEndRef = useRef(null);
  const fileRef = useRef(null);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await api.get('/ai-doubt/conversations');
      setConversations(res.data);
    } catch (e) {}
  }, []);

  const loadConversation = useCallback(async (convId) => {
    try {
      const res = await api.get(`/ai-doubt/history/${convId}`);
      const history = res.data.map(chat => ([
        { type: 'user', text: chat.question, imageUrl: chat.imageUrl },
        { type: 'bot', data: { answer: chat.answer, status: 'success' } }
      ])).flat();
      setMessages(history);
      setActiveConversation(convId);
      setShowSidebar(false);
    } catch (e) {}
  }, []);

  useEffect(() => {
    const init = async () => {
      await fetchConversations();
      setLoadingHistory(false);
    };
    init();
  }, [fetchConversations]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const startNewChat = () => {
    setMessages([]);
    setActiveConversation(null);
    setShowSidebar(false);
  };

  const handleSend = async () => {
    if (!question.trim() || loading) return;
    const q = question.trim();
    const localPreview = preview;
    const fileToSend = selectedFile;
    setQuestion('');
    removeFile();
    setMessages(prev => [...prev, { type: 'user', text: q, imageUrl: localPreview }]);
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append('question', q);
      fd.append('history', JSON.stringify(messages));
      if (activeConversation) fd.append('conversationId', activeConversation);
      if (fileToSend) fd.append('image', fileToSend);

      const res = await api.post('/ai-doubt/chat', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000
      });

      if (!activeConversation && res.data.conversationId) {
        setActiveConversation(res.data.conversationId);
      }

      setMessages(prev => {
        const updated = [...prev];
        if (res.data.imageUrl && updated.length > 0) {
          const lastUser = [...updated].reverse().find(m => m.type === 'user');
          if (lastUser) lastUser.imageUrl = res.data.imageUrl;
        }
        return [...updated, { type: 'bot', data: res.data }];
      });
      fetchConversations();
    } catch (err) {
      setMessages(prev => [...prev, {
        type: 'bot',
        data: { status: 'error', answer: err.response?.data?.answer || 'Failed to get response. Please try again.' }
      }]);
    }
    setLoading(false);
  };

  const deleteConversation = async (convId, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/ai-doubt/conversations/${convId}`);
      setConversations(prev => prev.filter(c => c.id !== convId));
      if (activeConversation === convId) startNewChat();
    } catch (e) {}
  };

  const clearAllHistory = async () => {
    try {
      await api.delete('/ai-doubt/history');
      setMessages([]);
      setConversations([]);
      setActiveConversation(null);
    } catch (e) {}
    setShowClearModal(false);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '1rem', height: 'calc(100vh - 180px)' }}>
      {/* Sidebar */}
      <div style={{
        width: '260px', flexShrink: 0, display: 'flex', flexDirection: 'column',
        background: 'var(--bg-primary)', borderRadius: '16px', border: '1px solid var(--border-light)',
        overflow: 'hidden',
        position: showSidebar ? 'fixed' : 'relative',
        ...(showSidebar ? { top: 0, left: 0, bottom: 0, zIndex: 1000, borderRadius: 0, width: '280px' } : {}),
      }} className="ai-sidebar">
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-light)' }}>
          <button onClick={startNewChat} style={{
            width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-light)',
            background: 'var(--bg-secondary)', color: 'var(--text-primary)', cursor: 'pointer',
            fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Chat
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
          {conversations.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-light)', fontSize: '0.85rem', padding: '1rem' }}>No conversations yet</p>
          ) : (
            conversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => loadConversation(conv.id)}
                style={{
                  padding: '0.75rem', borderRadius: '10px', cursor: 'pointer', marginBottom: '0.25rem',
                  background: activeConversation === conv.id ? 'var(--bg-tertiary)' : 'transparent',
                  border: activeConversation === conv.id ? '1px solid var(--border-light)' : '1px solid transparent',
                  display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => { if (activeConversation !== conv.id) e.currentTarget.style.background = 'var(--bg-secondary)'; }}
                onMouseLeave={e => { if (activeConversation !== conv.id) e.currentTarget.style.background = 'transparent'; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <span style={{ flex: 1, fontSize: '0.85rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {conv.title}
                </span>
                <button
                  onClick={(e) => deleteConversation(conv.id, e)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', padding: '0.2rem', fontSize: '0.9rem', opacity: 0.5, flexShrink: 0 }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '0.5'}
                >×</button>
              </div>
            ))
          )}
        </div>
        {conversations.length > 0 && (
          <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
            <button onClick={() => setShowClearModal(true)} style={{
              width: '100%', padding: '0.6rem', borderRadius: '8px', border: 'none',
              background: 'transparent', color: '#ef4444', cursor: 'pointer',
              fontSize: '0.8rem', fontWeight: 500
            }}>Clear All History</button>
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
          padding: '1.25rem 1.5rem', borderRadius: '16px', color: 'white', marginBottom: '0.75rem',
          position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '-50%', right: '-10%', width: '200px', height: '200px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0 0 0.2rem 0' }}>AI Doubt Clarification</h1>
              <p style={{ fontSize: '0.85rem', opacity: 0.85, margin: 0 }}>Ask any school subject doubt</p>
            </div>
            <button onClick={() => setShowSidebar(!showSidebar)} className="ai-sidebar-toggle" style={{
              display: 'none', background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white',
              padding: '0.5rem', borderRadius: '8px', cursor: 'pointer'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '1rem',
          background: 'var(--bg-primary)', borderRadius: '16px',
          border: '1px solid var(--border-light)', marginBottom: '0.75rem'
        }}>
          {loadingHistory ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading...</div>
          ) : messages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 1rem', opacity: 0.5 }}>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <p style={{ fontWeight: 600, marginBottom: '0.75rem' }}>Start a new conversation</p>
              <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>You can also attach an image of a textbook page or problem</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', maxWidth: '500px', margin: '0 auto' }}>
                {["What is Newton's 3rd law?", 'Solve: 2x + 5 = 15', 'What is photosynthesis?', 'Explain Pythagoras theorem'].map((q, i) => (
                  <button key={i} onClick={() => setQuestion(q)} style={{
                    padding: '0.4rem 0.8rem', borderRadius: '20px', border: '1px solid var(--border-light)',
                    background: 'var(--bg-secondary)', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer'
                  }}>{q}</button>
                ))}
              </div>
            </div>
          ) : null}

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
                  <>
                    {msg.imageUrl && (
                      <img src={msg.imageUrl} alt="Attached" style={{
                        maxWidth: '100%', maxHeight: '200px', borderRadius: '10px',
                        marginBottom: '0.5rem', display: 'block'
                      }} />
                    )}
                    <p style={{ margin: 0, lineHeight: 1.6 }}>{msg.text}</p>
                  </>
                ) : (
                  <div style={{ margin: 0, lineHeight: 1.8 }}>
                    {msg.data.answer.split('\n').map((line, j) => {
                      const trimmed = line.trim();
                      if (!trimmed) return <br key={j} />;
                      if (/^[-•]\s/.test(trimmed)) return <div key={j} style={{ paddingLeft: '1rem', marginBottom: '0.25rem' }}>{trimmed}</div>;
                      if (/^\d+[.)]\s/.test(trimmed)) return <div key={j} style={{ paddingLeft: '1rem', marginBottom: '0.25rem' }}>{trimmed}</div>;
                      if (/^[A-Z].*[:=]$/.test(trimmed) || /^Where:/.test(trimmed)) return <div key={j} style={{ fontWeight: 600, marginTop: '0.5rem', marginBottom: '0.25rem' }}>{trimmed}</div>;
                      if (/^[F-Z]\s*=/.test(trimmed) || /\^\d/.test(trimmed) || /\/\s*r/.test(trimmed)) {
                        const formatted = trimmed.replace(/\\\s*/g, '×').replace(/\^2/g, '²').replace(/\^3/g, '³');
                        return (
                          <div key={j} style={{
                            fontFamily: 'monospace', background: 'rgba(139,92,246,0.08)',
                            padding: '0.5rem 0.75rem', borderRadius: '8px', margin: '0.5rem 0',
                            fontSize: '0.95rem', borderLeft: '3px solid #8b5cf6'
                          }}>{formatted}</div>
                        );
                      }
                      return <div key={j} style={{ marginBottom: '0.25rem' }}>{trimmed}</div>;
                    })}
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

        {/* File Preview */}
        {preview && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem',
            background: 'var(--bg-secondary)', borderRadius: '12px', marginBottom: '0.5rem',
            border: '1px solid var(--border-light)'
          }}>
            <img src={preview} alt="Preview" style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
            <span style={{ flex: 1, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{selectedFile?.name}</span>
            <button onClick={removeFile} style={{
              background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.2rem', padding: '0.25rem'
            }}>×</button>
          </div>
        )}

        {/* Input */}
        <div style={{
          display: 'flex', gap: '0.5rem', padding: '1rem',
          background: 'var(--bg-primary)', borderRadius: '16px',
          border: '1px solid var(--border-light)', alignItems: 'center'
        }}>
          <input type="file" ref={fileRef} accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={loading}
            title="Attach image"
            style={{
              width: '40px', height: '40px', borderRadius: '10px', border: '1px solid var(--border-light)',
              background: 'var(--bg-secondary)', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--text-muted)'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
            </svg>
          </button>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask your academic doubt..."
            disabled={loading}
            style={{
              flex: 1, padding: '0.75rem 1rem', borderRadius: '12px',
              border: '1px solid var(--border-light)', background: 'var(--bg-secondary)',
              color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none'
            }}
          />
          <button
            onClick={handleSend}
            disabled={!question.trim() || loading}
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
      </div>

      {/* Clear History Modal */}
      {showClearModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-primary)', padding: '2rem', borderRadius: '20px',
            maxWidth: '380px', width: '100%', textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{
              width: '50px', height: '50px', borderRadius: '50%', background: '#fef2f2',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </div>
            <h3 style={{ margin: '0 0 0.5rem', color: 'var(--text-primary)', fontWeight: 700 }}>Clear All History?</h3>
            <p style={{ margin: '0 0 1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              This will permanently delete all conversations. This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setShowClearModal(false)} style={{
                flex: 1, padding: '0.75rem', borderRadius: '10px', border: '2px solid var(--border-light)',
                background: 'var(--bg-primary)', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 600
              }}>Cancel</button>
              <button onClick={clearAllHistory} style={{
                flex: 1, padding: '0.75rem', borderRadius: '10px', border: 'none',
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: 'white',
                cursor: 'pointer', fontWeight: 600
              }}>Clear All</button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile sidebar backdrop */}
      {showSidebar && (
        <div onClick={() => setShowSidebar(false)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 999
        }} />
      )}

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
        }
        @media (max-width: 768px) {
          .ai-sidebar { display: none !important; }
          .ai-sidebar-toggle { display: flex !important; }
        }
      `}</style>
    </div>
  );
};

export default AskAI;
