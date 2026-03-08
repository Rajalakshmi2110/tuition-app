import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import Header from '../components/Header';
import { useToast } from '../components/Toast';
import kalviLogo from '../assets/logo.png';

const GoogleRoleSelection = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [role, setRole] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [className, setClassName] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const userDataParam = searchParams.get('userData');
    if (userDataParam) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(userDataParam));
        setUserData(parsedData);
      } catch (error) {
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role) {
      toast.error('Please select a role');
      return;
    }

    if (role === 'student' && !className) {
      toast.error('Please select a class');
      return;
    }

    if (role === 'tutor' && !specialization) {
      toast.error('Please enter your specialization');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/auth/complete-google-registration`, {
        googleId: userData.googleId,
        name: userData.name,
        email: userData.email,
        role,
        specialization: role === 'tutor' ? specialization : undefined,
        className: role === 'student' ? className : undefined
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        toast.success('Registration successful!');
        navigate(`/${role}`);
      } else {
        toast.info('Registration successful! Your profile is pending admin approval. You will be notified once verified.');
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.875rem 1rem',
    fontSize: '1rem',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    outline: 'none',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box'
  };

  if (!userData) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #064e3b 0%, #0f172a 50%, #1e293b 100%)'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '3px solid #e2e8f0',
          borderTopColor: '#10b981',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

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
          backgroundColor: 'white',
          padding: '2.5rem',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          width: '100%',
          maxWidth: '420px',
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
              fontSize: '1.5rem',
              fontWeight: 800,
              color: '#0f172a',
              marginBottom: '0.5rem'
            }}>
              Complete Registration
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              Just a few more details to get started
            </p>
          </div>

          {/* User Info */}
          <div style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: '#f0fdf4',
            borderRadius: '12px',
            border: '1px solid #bbf7d0',
            textAlign: 'center'
          }}>
            <p style={{ margin: '0 0 0.25rem 0', fontWeight: 600, color: '#166534' }}>
              Welcome, {userData.name}! 👋
            </p>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#16a34a' }}>{userData.email}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label htmlFor="google-role" style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#374151'
              }}>
                I am a...
              </label>
              <select
                id="google-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                style={{ ...inputStyle, background: 'white' }}
              >
                <option value="">Choose your role</option>
                <option value="student">Student</option>
                <option value="tutor">Tutor</option>
              </select>
            </div>

            {role === 'student' && (
              <div style={{ marginBottom: '1.25rem' }}>
                <label htmlFor="google-class" style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#374151'
                }}>
                  Academic Class
                </label>
                <select
                  id="google-class"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  required
                  style={{ ...inputStyle, background: 'white' }}
                >
                  <option value="">Select your class</option>
                  <option value="4">Class 4</option>
                  <option value="5">Class 5</option>
                  <option value="6">Class 6</option>
                  <option value="7">Class 7</option>
                  <option value="8">Class 8</option>
                  <option value="9">Class 9</option>
                  <option value="10">Class 10</option>
                  <option value="11">Class 11</option>
                  <option value="12">Class 12</option>
                </select>
              </div>
            )}

            {role === 'tutor' && (
              <div style={{ marginBottom: '1.25rem' }}>
                <label htmlFor="google-specialization" style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#374151'
                }}>
                  Specialization
                </label>
                <input
                  id="google-specialization"
                  type="text"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder="e.g., Mathematics, Physics, Chemistry"
                  required
                  style={inputStyle}
                />
              </div>
            )}

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
                  Completing...
                </>
              ) : (
                'Complete Registration'
              )}
            </button>
          </form>
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

export default GoogleRoleSelection;
