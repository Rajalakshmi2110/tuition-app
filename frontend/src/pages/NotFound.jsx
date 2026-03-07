import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  const role = localStorage.getItem('role');

  const getDashboardLink = () => {
    if (role === 'admin') return '/admin';
    if (role === 'tutor') return '/tutor';
    if (role === 'student') return '/student';
    return '/';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #064e3b 0%, #0f172a 50%, #1e293b 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: '480px' }}>
        <div style={{
          fontSize: '8rem',
          fontWeight: 800,
          lineHeight: 1,
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #10b981 0%, #fbbf24 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          404
        </div>
        <h1 style={{
          color: 'white',
          fontSize: '1.75rem',
          fontWeight: 700,
          marginBottom: '1rem'
        }}>
          Page Not Found
        </h1>
        <p style={{
          color: '#94a3b8',
          fontSize: '1.05rem',
          lineHeight: 1.6,
          marginBottom: '2rem'
        }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to={getDashboardLink()}
            style={{
              padding: '0.875rem 1.75rem',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
              transition: 'all 0.3s ease'
            }}
          >
            {role ? 'Go to Dashboard' : 'Go Home'}
          </Link>
          <button
            onClick={() => window.history.back()}
            style={{
              padding: '0.875rem 1.75rem',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
