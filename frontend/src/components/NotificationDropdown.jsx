import React, { useState, useEffect, useRef, useCallback } from 'react';
import api from '../services/api';

const typeIcons = {
  announcement: '📢', assignment_created: '📝', assignment_submitted: '✅', assignment_graded: '🎯',
  resource_uploaded: '📚', fee_reminder: '💰', payment_submitted: '💳', payment_verified: '✅',
  payment_rejected: '❌', session_assigned: '📅', session_updated: '🔄', account_approved: '🎉',
  account_declined: '⚠️', student_enrolled: '👤', new_registration: '🆕', feedback_submitted: '💬',
  badge_earned: '🏆', performance_added: '📊'
};

const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await api.get('/notifications/unread-count');
      setUnreadCount(res.data.count);
    } catch (e) {}
  }, []);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/notifications?limit=15');
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    } catch (e) {}
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  useEffect(() => {
    if (open) fetchNotifications();
  }, [open, fetchNotifications]);

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {}
  };

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (e) {}
  };

  const timeAgo = (date) => {
    const diff = (Date.now() - new Date(date)) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '40px', height: '40px', borderRadius: '10px',
          background: 'var(--bg-secondary, #f8fafc)', border: '1px solid var(--border-light, #e2e8f0)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.2s ease', position: 'relative', flexShrink: 0
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted, #64748b)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: '4px', right: '4px',
            minWidth: '18px', height: '18px', background: '#ef4444',
            borderRadius: '9px', border: '2px solid var(--bg-primary, white)',
            fontSize: '0.65rem', fontWeight: 700, color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 4px'
          }}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: '48px', right: 0,
          width: '360px', maxHeight: '480px',
          background: 'var(--bg-primary, white)',
          borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          border: '1px solid var(--border-light, #e2e8f0)',
          zIndex: 1000, overflow: 'hidden',
          animation: 'slideDown 0.2s ease'
        }}>
          {/* Header */}
          <div style={{
            padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-light, #e2e8f0)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary, #0f172a)' }}>
              Notifications
              {unreadCount > 0 && (
                <span style={{
                  marginLeft: '0.5rem', fontSize: '0.75rem', background: '#ef4444',
                  color: 'white', padding: '0.15rem 0.5rem', borderRadius: '9999px', fontWeight: 600
                }}>{unreadCount}</span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button onClick={markAllRead} style={{
                background: 'none', border: 'none', color: '#10b981',
                fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer'
              }}>
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted, #64748b)' }}>Loading...</div>
            ) : notifications.length === 0 ? (
              <div style={{ padding: '3rem 1rem', textAlign: 'center' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-light, #94a3b8)" strokeWidth="1.5" style={{ margin: '0 auto 0.75rem' }}>
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p style={{ color: 'var(--text-muted, #64748b)', margin: 0, fontSize: '0.9rem' }}>No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => !n.read && markAsRead(n._id)}
                  style={{
                    padding: '0.875rem 1.25rem',
                    borderBottom: '1px solid var(--border-light, #e2e8f0)',
                    background: n.read ? 'transparent' : 'rgba(16, 185, 129, 0.05)',
                    cursor: n.read ? 'default' : 'pointer',
                    transition: 'background 0.2s ease',
                    display: 'flex', gap: '0.75rem', alignItems: 'flex-start'
                  }}
                >
                  <span style={{ fontSize: '1.25rem', flexShrink: 0, marginTop: '2px' }}>
                    {typeIcons[n.type] || '🔔'}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                      <p style={{
                        margin: 0, fontSize: '0.85rem', fontWeight: n.read ? 500 : 700,
                        color: 'var(--text-primary, #0f172a)', overflow: 'hidden',
                        textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                      }}>
                        {n.title}
                      </p>
                      {!n.read && (
                        <span style={{
                          width: '8px', height: '8px', background: '#10b981',
                          borderRadius: '50%', flexShrink: 0
                        }} />
                      )}
                    </div>
                    <p style={{
                      margin: '0.25rem 0 0', fontSize: '0.8rem',
                      color: 'var(--text-muted, #64748b)', lineHeight: 1.4,
                      display: '-webkit-box', WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden'
                    }}>
                      {n.message}
                    </p>
                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.7rem', color: 'var(--text-light, #94a3b8)' }}>
                      {timeAgo(n.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <style>{`
            @keyframes slideDown {
              from { opacity: 0; transform: translateY(-8px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
