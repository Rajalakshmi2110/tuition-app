import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { SUBJECTS_BY_CLASS, CLASS_LEVELS } from '../constants/academic';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', className: '', subjects: [], specialization: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        const u = res.data.user;
        setUser(u);
        setForm({
          name: u.name || '',
          email: u.email || '',
          className: u.className || '',
          subjects: u.subjects || [],
          specialization: u.specialization || ''
        });
      } catch (err) {}
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await api.put('/users/profile', form);
      setUser(res.data.user);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setEditing(false);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    }
    setSaving(false);
  };

  const handleSubjectToggle = (subject) => {
    setForm(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const handleClassChange = (newClass) => {
    setForm(prev => ({ ...prev, className: newClass, subjects: [] }));
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading profile...</p>
      </div>
    );
  }

  if (!user) return null;

  const availableSubjects = user.role === 'student' && form.className ? (SUBJECTS_BY_CLASS[form.className] || []) : [];

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    border: '1px solid var(--border-light)',
    background: editing ? 'var(--bg-primary)' : 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--text-muted)',
    marginBottom: '0.5rem'
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        padding: '2rem',
        borderRadius: '20px',
        color: 'white',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-50%', right: '-10%',
          width: '300px', height: '300px',
          background: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%'
        }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '64px', height: '64px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.75rem', fontWeight: 700
          }}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.25rem 0' }}>{user.name}</h1>
            <p style={{ fontSize: '0.9rem', opacity: 0.85, margin: 0 }}>{user.email}</p>
            <span style={{
              display: 'inline-block', marginTop: '0.5rem',
              background: 'rgba(255,255,255,0.2)', padding: '0.2rem 0.75rem',
              borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600,
              textTransform: 'capitalize'
            }}>
              {user.role}
            </span>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: '10px',
          marginBottom: '1rem',
          background: message.type === 'success' ? 'var(--bg-success, #f0fdf4)' : 'var(--bg-urgent, #fef2f2)',
          color: message.type === 'success' ? '#059669' : '#dc2626',
          fontSize: '0.9rem', fontWeight: 500
        }}>
          {message.text}
        </div>
      )}

      {/* Form */}
      <div style={{
        background: 'var(--bg-primary)',
        borderRadius: '16px',
        padding: '2rem',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Profile Details
          </h2>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              style={{
                padding: '0.5rem 1.25rem', borderRadius: '10px',
                background: '#10b981', color: 'white', border: 'none',
                cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem'
              }}
            >
              Edit Profile
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  setEditing(false);
                  setForm({
                    name: user.name || '', email: user.email || '',
                    className: user.className || '', subjects: user.subjects || [],
                    specialization: user.specialization || ''
                  });
                  setMessage(null);
                }}
                style={{
                  padding: '0.5rem 1rem', borderRadius: '10px',
                  background: 'var(--bg-secondary)', color: 'var(--text-muted)',
                  border: '1px solid var(--border-light)', cursor: 'pointer',
                  fontWeight: 600, fontSize: '0.85rem'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: '0.5rem 1.25rem', borderRadius: '10px',
                  background: '#10b981', color: 'white', border: 'none',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  fontWeight: 600, fontSize: '0.85rem', opacity: saving ? 0.7 : 1
                }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Name */}
          <div>
            <label style={labelStyle}>Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={!editing}
              style={inputStyle}
            />
          </div>

          {/* Email */}
          <div>
            <label style={labelStyle}>Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={!editing}
              style={inputStyle}
            />
          </div>

          {/* Student: Class */}
          {user.role === 'student' && (
            <div>
              <label style={labelStyle}>Class</label>
              <select
                value={form.className}
                onChange={(e) => handleClassChange(e.target.value)}
                disabled={!editing}
                style={{ ...inputStyle, cursor: editing ? 'pointer' : 'default' }}
              >
                <option value="">Select Class</option>
                {CLASS_LEVELS.map(c => (
                  <option key={c} value={c}>Class {c}</option>
                ))}
              </select>
            </div>
          )}

          {/* Student: Subjects */}
          {user.role === 'student' && form.className && (
            <div>
              <label style={labelStyle}>Subjects</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {availableSubjects.map(subject => {
                  const selected = form.subjects.includes(subject);
                  return (
                    <button
                      key={subject}
                      type="button"
                      onClick={() => editing && handleSubjectToggle(subject)}
                      disabled={!editing}
                      style={{
                        padding: '0.4rem 0.85rem',
                        borderRadius: '20px',
                        border: selected ? '2px solid #10b981' : '1px solid var(--border-light)',
                        background: selected ? 'var(--bg-success, #f0fdf4)' : 'var(--bg-secondary)',
                        color: selected ? '#059669' : 'var(--text-muted)',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        cursor: editing ? 'pointer' : 'default',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {selected && '✓ '}{subject}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tutor: Specialization */}
          {user.role === 'tutor' && (
            <div>
              <label style={labelStyle}>Specialization</label>
              <input
                type="text"
                value={form.specialization}
                onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                disabled={!editing}
                style={inputStyle}
              />
            </div>
          )}

          {/* Read-only info */}
          <div style={{
            padding: '1rem',
            background: 'var(--bg-secondary)',
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Role</span>
              <span style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'capitalize' }}>{user.role}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Status</span>
              <span style={{
                fontSize: '0.85rem', fontWeight: 600,
                color: user.status === 'approved' ? '#059669' : user.status === 'pending' ? '#d97706' : '#dc2626'
              }}>
                {user.status?.charAt(0).toUpperCase() + user.status?.slice(1)}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Joined</span>
              <span style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600 }}>
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
