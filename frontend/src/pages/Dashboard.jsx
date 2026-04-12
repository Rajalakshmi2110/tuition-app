import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!token || !user) {
      navigate('/login');
      return;
    }

    switch (user.role) {
      case 'admin':
        navigate('/admin');
        break;
      case 'tutor':
        navigate('/tutor');
        break;
      case 'student':
        navigate('/student');
        break;
      default:
        navigate('/login');
    }
  }, [navigate, token, user]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #064e3b 0%, #0f172a 50%, #1e293b 100%)'
    }}>
      <div style={{
        background: 'var(--bg-primary)',
        padding: '3rem',
        borderRadius: '24px',
        textAlign: 'center',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '3px solid #e2e8f0',
          borderTopColor: '#10b981',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem'
        }} />
        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '1rem' }}>
          Redirecting to dashboard...
        </p>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
