import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import { useToast } from '../components/Toast';
import kalviLogo from '../assets/logo.png';
import API_CONFIG from '../config/apiConfig';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams] = useSearchParams();

  React.useEffect(() => {
    if (searchParams.get('error') === 'session_expired') {
      toast.error('Session expired. Please sign in again.');
    }
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post(`/auth/login`, formData);
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);
      localStorage.setItem('userId', user.id);
      
      toast.success(`Welcome back! Redirecting to your dashboard...`);

      setTimeout(() => {
        if (user.role === 'admin') navigate('/admin');
        else if (user.role === 'tutor') navigate('/tutor');
        else navigate('/student');
      }, 1000);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #064e3b 0%, #0f172a 50%, #1e293b 100%)' }}>
      <Header />
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 80px)',
        padding: '2rem'
      }}>
        {/* Login Card */}
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

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <img 
              src={kalviLogo} 
              alt="Kalvi Logo" 
              style={{
                width: '60px',
                height: '60px',
                objectFit: 'contain',
                margin: '0 auto 1rem',
                display: 'block'
              }}
            />
            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: '#0f172a',
              marginBottom: '0.5rem',
              letterSpacing: '-0.02em'
            }}>
              Welcome Back
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
              Sign in to continue your learning journey
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label htmlFor="login-email" style={{
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
                  id="login-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
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

            {/* Password Input */}
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="login-password" style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#374151'
              }}>
                Password
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
                  🔒
                </span>
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  style={{
                    width: '100%',
                    padding: '0.875rem 3rem 0.875rem 2.75rem',
                    fontSize: '1rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box',
                    WebkitAppearance: 'none'
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
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    opacity: 0.5,
                    padding: 0
                  }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
              <Link
                to="/forgot-password"
                style={{
                  color: '#10b981',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = '#059669'}
                onMouseLeave={(e) => e.target.style.color = '#10b981'}
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
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
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 14px rgba(16, 185, 129, 0.4)';
                }
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
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '1.75rem 0',
            gap: '1rem'
          }}>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 500 }}>or continue with</span>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          </div>

          {/* Google Login */}
          <a
            href={`${API_CONFIG.BASE_URL}/api/auth/google`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              width: '100%',
              padding: '0.875rem',
              background: 'white',
              color: '#374151',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              textDecoration: 'none',
              fontSize: '0.95rem',
              fontWeight: 600,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#f8fafc';
              e.target.style.borderColor = '#cbd5e1';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'white';
              e.target.style.borderColor = '#e2e8f0';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </a>

          {/* Sign Up Link */}
          <p style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            color: '#64748b',
            fontSize: '0.95rem'
          }}>
            Don't have an account?{' '}
            <Link
              to="/register"
              style={{
                color: '#10b981',
                textDecoration: 'none',
                fontWeight: 600,
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#059669'}
              onMouseLeave={(e) => e.target.style.color = '#10b981'}
            >
              Sign up free
            </Link>
          </p>
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        /* Hide browser's default password reveal icon */
        input::-ms-reveal,
        input::-ms-clear,
        input::-webkit-credentials-auto-fill-button,
        input::-webkit-clear-button {
          display: none !important;
        }
        /* For Edge and Chrome */
        input[type="password"]::-ms-reveal {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Login;
