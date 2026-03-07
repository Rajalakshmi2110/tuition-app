import React, { useState, useEffect } from 'react';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';
import { useToast } from '../components/Toast';

const AdminCreateClass = () => {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    schedule: '',
    scheduledDate: '',
    tutorId: '',
    classLevel: '',
  });

  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(false);
  const classLevels = ["4", "5", "6", "7", "8", "9", "10", "11", "12"];
  const toast = useToast();

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await api.get(`/users/tutors`);
        console.log('Tutors response:', res.data);
        setTutors(res.data.tutors || []);
      } catch (error) {
        console.error('Failed to fetch tutors', error.response?.data || error.message);
      }
    };
    fetchTutors();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(`/classes/create`, {
        name: formData.name,
        subject: formData.subject,
        schedule: formData.schedule,
        scheduledDate: formData.scheduledDate,
        tutor: formData.tutorId,
        classLevel: formData.classLevel,
      });
      toast.success('Session created successfully!');
      setFormData({ name: '', subject: '', schedule: '', scheduledDate: '', tutorId: '', classLevel: '' });
    } catch (err) {
      console.error('Session creation failed', err);
      toast.error('Failed to create session');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.875rem 1rem',
    fontSize: '0.95rem',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    outline: 'none',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box'
  };

  return (
    <AdminLayout>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </div>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#0f172a',
            margin: 0
          }}>
            Create New Session
          </h1>
          <p style={{ color: '#64748b', margin: '0.5rem 0 0', fontSize: '0.9rem' }}>
            Set up a new tuition session with a tutor
          </p>
        </div>

        {/* Form */}
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '20px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0'
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>
                Session Name *
              </label>
              <input
                type="text"
                name="name"
                placeholder="e.g., Math Class for Grade 10"
                value={formData.name}
                onChange={handleChange}
                required
                style={inputStyle}
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

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                placeholder="e.g., Mathematics, Physics"
                value={formData.subject}
                onChange={handleChange}
                required
                style={inputStyle}
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>
                  Time Schedule *
                </label>
                <input
                  type="text"
                  name="schedule"
                  placeholder="e.g., 6:00 PM - 7:00 PM"
                  value={formData.schedule}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>
                  Date *
                </label>
                <input
                  type="date"
                  name="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>
                Assign Tutor *
              </label>
              <select
                name="tutorId"
                value={formData.tutorId}
                onChange={handleChange}
                required
                style={{ ...inputStyle, background: 'white' }}
              >
                <option value="">Select a tutor...</option>
                {tutors.map(tutor => (
                  <option key={tutor._id} value={tutor._id}>
                    {tutor.name} ({tutor.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>
                Class Level *
              </label>
              <select
                name="classLevel"
                value={formData.classLevel}
                onChange={handleChange}
                required
                style={{ ...inputStyle, background: 'white' }}
              >
                <option value="">Select class level...</option>
                {classLevels.map(level => (
                  <option key={level} value={level}>Class {level}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '1rem',
                marginTop: '0.5rem',
                background: loading ? '#94a3b8' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                fontSize: '1rem',
                boxShadow: loading ? 'none' : '0 4px 15px rgba(16, 185, 129, 0.4)',
                transition: 'all 0.3s ease',
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
                  Creating...
                </>
              ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                Create Session
              </>
            )}
            </button>
          </form>
        </div>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </AdminLayout>
  );
};

export default AdminCreateClass;
