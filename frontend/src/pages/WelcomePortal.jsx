import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import kalviyagamLogo from '../assets/logo.png';

const WelcomePortal = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #064e3b 0%, #0f172a 50%, #1e293b 100%)'
    }}>
      <Header />
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 80px)',
        padding: '2rem',
        position: 'relative'
      }}>
        {/* Background decorations */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'pulse 4s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '20%',
          right: '15%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'pulse 5s ease-in-out infinite 1s'
        }} />

        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '3rem',
          textAlign: 'center',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Logo */}
          <img 
            src={kalviyagamLogo} 
            alt="Kalviyagam Logo" 
            style={{
              width: '80px',
              height: '80px',
              objectFit: 'contain',
              margin: '0 auto 1.5rem',
              display: 'block'
            }}
          />

          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            color: '#0f172a',
            marginBottom: '0.75rem',
            letterSpacing: '-0.02em'
          }}>
            Welcome to{' '}
            <span style={{
              background: 'linear-gradient(135deg, #10b981 0%, #fbbf24 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Kalviyagam
            </span>
          </h1>
          
          <p style={{
            color: '#64748b',
            fontSize: '1.1rem',
            marginBottom: '2.5rem',
            lineHeight: 1.6
          }}>
            Your journey to academic excellence starts here. Sign in or create an account to continue.
          </p>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <Link
              to="/login"
              style={{
                display: 'block',
                padding: '1rem 2rem',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.4)';
              }}
            >
              Sign In to Your Account
            </Link>
            
            <Link
              to="/register"
              style={{
                display: 'block',
                padding: '1rem 2rem',
                background: 'white',
                color: '#0f172a',
                textDecoration: 'none',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '1rem',
                border: '2px solid #e2e8f0',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#10b981';
                e.target.style.color = '#059669';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.color = '#0f172a';
              }}
            >
              Create New Account
            </Link>
          </div>

          <p style={{
            marginTop: '2rem',
            color: '#94a3b8',
            fontSize: '0.9rem'
          }}>
            By continuing, you agree to our Terms of Service
          </p>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default WelcomePortal;
