import React from 'react';

const LoadingSpinner = ({ message = 'Loading...', fullPage = false }) => {
  const content = (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 2rem',
      gap: '1rem'
    }}>
      <div style={{
        width: '44px',
        height: '44px',
        border: '3px solid #e2e8f0',
        borderTopColor: '#10b981',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: 500, margin: 0 }}>
        {message}
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (fullPage) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh'
      }}>
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
