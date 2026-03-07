import React from 'react';

const EmptyState = ({ icon, title, description, action }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem 2rem',
    textAlign: 'center'
  }}>
    <div style={{
      width: '80px',
      height: '80px',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '1.5rem',
      border: '1px solid #d1fae5'
    }}>
      {icon || (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      )}
    </div>
    <h3 style={{
      fontSize: '1.2rem',
      fontWeight: 700,
      color: '#0f172a',
      margin: '0 0 0.5rem 0'
    }}>
      {title || 'Nothing here yet'}
    </h3>
    <p style={{
      color: '#64748b',
      fontSize: '0.95rem',
      margin: 0,
      maxWidth: '360px',
      lineHeight: 1.5
    }}>
      {description || 'Content will appear here once available.'}
    </p>
    {action && (
      <div style={{ marginTop: '1.5rem' }}>
        {action}
      </div>
    )}
  </div>
);

export default EmptyState;
