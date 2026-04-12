import React from 'react';

const LogoutModal = ({ show, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1100, padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-primary, white)', padding: '2rem', borderRadius: '20px',
        maxWidth: '380px', width: '100%', textAlign: 'center',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        animation: 'slideUp 0.3s ease'
      }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '50%',
          background: 'var(--bg-urgent, #fef2f2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1rem'
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </div>
        <h3 style={{ margin: '0 0 0.5rem', color: 'var(--text-primary, #0f172a)', fontWeight: 700, fontSize: '1.15rem' }}>
          Logout?
        </h3>
        <p style={{ margin: '0 0 1.5rem', color: 'var(--text-muted, #64748b)', fontSize: '0.9rem', lineHeight: 1.5 }}>
          Are you sure you want to logout? You'll need to sign in again.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: '0.75rem', borderRadius: '10px',
              border: '2px solid var(--border-light, #e2e8f0)',
              background: 'var(--bg-primary, white)',
              color: 'var(--text-muted, #64748b)',
              cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem'
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, padding: '0.75rem', borderRadius: '10px', border: 'none',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
            }}
          >
            Logout
          </button>
        </div>
      </div>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default LogoutModal;
