import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { useToast } from '../components/Toast';
import API_CONFIG from '../config/apiConfig';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('${API_CONFIG.BASE_URL}/api/auth/forgot-password', { email });
      toast.success('Password reset email sent! Check your inbox.');
      setSent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error sending reset email');
    }
    setLoading(false);
  };

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
        padding: '2rem'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          width: '100%',
          maxWidth: '420px',
          padding: '3rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative gradient */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #10b981, #fbbf24, #10b981)'
          }} />

          {sent ? (
            // Success State
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                fontSize: '2rem',
                boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)'
              }}>
                ✉️
              </div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#0f172a',
                marginBottom: '1rem'
              }}>
                Check Your Email
              </h2>
              <p style={{
                color: '#64748b',
                marginBottom: '2rem',
                lineHeight: 1.6
              }}>
                We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and spam folder.
              </p>
              <Link
                to="/login"
                style={{
                  display: 'inline-block',
                  padding: '0.875rem 2rem',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '12px',
                  fontWeight: 600,
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
                }}
              >
                Back to Login
              </Link>
            </div>
          ) : (
            // Form State
            <>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  fontSize: '1.5rem',
                  boxShadow: '0 8px 20px rgba(251, 191, 36, 0.3)'
                }}>
                  🔑
                </div>
                <h2 style={{
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  marginBottom: '0.5rem',
                  letterSpacing: '-0.02em'
                }}>
                  Forgot Password?
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                  No worries! Enter your email and we'll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: '#374151'
                  }}>
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '1rem',
                      opacity: 0.5
                    }}>
                      @
                    </span>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '0.875rem 1rem 0.875rem 2.75rem',
                        fontSize: '1rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#10b981';
                        e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e2e8f0';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    fontSize: '1rem',
                    fontWeight: 600,
                    background: loading ? '#94a3b8' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: loading ? 'none' : '0 4px 14px rgba(16, 185, 129, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {loading ? (
                    <>
                      <span style={{
                        width: '20px',
                        height: '20px',
                        border: '2px solid white',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                      Sending...
                    </>
                  ) : (
                    <>Send Reset Link</>
                  )}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <Link
                  to="/login"
                  style={{
                    color: '#10b981',
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <span>←</span> Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;
