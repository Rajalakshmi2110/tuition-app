import React, { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';
import { useToast } from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [tutors, setTutors] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState({
    name: '', subject: '', schedule: '', scheduledDate: '', tutorId: '', classLevel: ''
  });
  const toast = useToast();
  const classLevels = ['6', '7', '8', '9', '10', '11', '12'];
  const SUBJECTS_BY_CLASS = {
    '6': ['Tamil', 'English', 'Maths', 'Science', 'Social Science'],
    '7': ['Tamil', 'English', 'Maths', 'Science', 'Social Science'],
    '8': ['Tamil', 'English', 'Maths', 'Physics', 'Chemistry', 'Biology', 'Social Science'],
    '9': ['Tamil', 'English', 'Maths', 'Physics', 'Chemistry', 'Biology', 'Social Science'],
    '10': ['Tamil', 'English', 'Maths', 'Physics', 'Chemistry', 'Biology', 'Social Science'],
    '11': ['Tamil', 'English', 'Maths', 'Physics', 'Chemistry', 'Computer Science', 'Biology', 'Accountancy', 'Commerce', 'Economics', 'Business Maths'],
    '12': ['Tamil', 'English', 'Maths', 'Physics', 'Chemistry', 'Computer Science', 'Biology', 'Accountancy', 'Commerce', 'Economics', 'Business Maths'],
  };

  const fetchClasses = useCallback(async () => {
    try {
      const res = await api.get('/classes');
      setClasses(res.data);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }, []);

  const fetchTutors = useCallback(async () => {
    try {
      const res = await api.get('/users/tutors');
      setTutors(res.data.tutors || []);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { fetchClasses(); fetchTutors(); }, [fetchClasses, fetchTutors]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post('/classes/create', {
        name: formData.name, subject: formData.subject, schedule: formData.schedule,
        scheduledDate: formData.scheduledDate, tutor: formData.tutorId, classLevel: formData.classLevel
      });
      toast.success('Session created successfully!');
      setFormData({ name: '', subject: '', schedule: '', scheduledDate: '', tutorId: '', classLevel: '' });
      setShowCreateModal(false);
      fetchClasses();
    } catch {
      toast.error('Failed to create session');
    } finally {
      setCreating(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/classes/${deleteTarget._id}`);
      setClasses(classes.filter(cls => cls._id !== deleteTarget._id));
      toast.success('Session deleted successfully!');
    } catch {
      toast.error('Failed to delete session');
    } finally {
      setDeleteTarget(null);
    }
  };

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem', fontSize: '0.95rem',
    border: '2px solid #e2e8f0', borderRadius: '10px', outline: 'none',
    transition: 'all 0.2s ease', boxSizing: 'border-box'
  };

  const filteredClasses = selectedClass === 'all' ? classes : classes.filter(c => c.classLevel === selectedClass);

  if (loading) return <AdminLayout><LoadingSpinner message="Loading sessions..." fullPage /></AdminLayout>;

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Sessions
            </h1>
            <p style={{ color: '#64748b', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>Manage all tuition sessions</p>
          </div>
          <button onClick={() => setShowCreateModal(true)} style={{
            padding: '0.875rem 1.5rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600,
            fontSize: '0.95rem', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}>
            + Create Session
          </button>
        </div>

        {/* Filter */}
        {classes.length > 0 && (
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} style={{
              padding: '0.6rem 1rem', border: '2px solid #e2e8f0', borderRadius: '8px',
              fontWeight: 600, fontSize: '0.9rem', color: '#0f172a', cursor: 'pointer', outline: 'none'
            }}>
              <option value="all">All Classes ({classes.length})</option>
              {classLevels.map(l => {
                const count = classes.filter(c => c.classLevel === l).length;
                return count > 0 ? <option key={l} value={l}>Class {l} ({count})</option> : null;
              })}
            </select>
            {selectedClass !== 'all' && (
              <button onClick={() => setSelectedClass('all')} style={{
                padding: '0.5rem 1rem', background: '#fef2f2', color: '#dc2626',
                border: '2px solid #fecaca', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem'
              }}>✕ Clear</button>
            )}
          </div>
        )}

        {/* Sessions List */}
        {classes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
            <h3 style={{ color: '#0f172a', fontWeight: 700, marginBottom: '0.5rem' }}>No Sessions Yet</h3>
            <p style={{ color: '#64748b' }}>Click "Create Session" to get started</p>
          </div>
        ) : filteredClasses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 2rem', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <p style={{ color: '#64748b' }}>No sessions found for Class {selectedClass}</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {filteredClasses.map(cls => (
              <div key={cls._id} style={{
                backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0',
                transition: 'all 0.2s ease'
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#10b981'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 0.75rem', color: '#0f172a', fontSize: '1.15rem', fontWeight: 700 }}>{cls.name}</h3>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ backgroundColor: '#dbeafe', color: '#1e40af', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 500 }}>{cls.subject}</span>
                      <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 500 }}>Class {cls.classLevel}</span>
                      <span style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 500 }}>{cls.schedule}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                      backgroundColor: cls.status === 'completed' ? '#fee2e2' : '#f0fdf4',
                      color: cls.status === 'completed' ? '#991b1b' : '#166534',
                      padding: '0.4rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600
                    }}>
                      {cls.status === 'completed' ? '✓ Completed' : '◷ Scheduled'}
                    </span>
                    <button onClick={() => setDeleteTarget(cls)} style={{
                      padding: '0.4rem 0.75rem', background: 'transparent', color: '#94a3b8',
                      border: '2px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem'
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.borderColor = '#fecaca'; e.currentTarget.style.color = '#dc2626'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#94a3b8'; }}
                    >Delete</button>
                  </div>
                </div>

                {/* Tutor + Date */}
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '32px', height: '32px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 700, fontSize: '0.8rem'
                    }}>{cls.tutor?.name?.charAt(0) || 'N'}</div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>{cls.tutor?.name || 'No tutor'}</p>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>{cls.tutor?.email || ''}</p>
                    </div>
                  </div>
                  {cls.scheduledDate && (
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      {new Date(cls.scheduledDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Session Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'white', padding: '2rem', borderRadius: '20px',
            maxWidth: '500px', width: '100%', maxHeight: '85vh', overflow: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: '#0f172a', fontWeight: 700, fontSize: '1.25rem' }}>📅 Create Session</h3>
              <button onClick={() => setShowCreateModal(false)} style={{
                background: '#f1f5f9', border: 'none', width: '32px', height: '32px',
                borderRadius: '8px', cursor: 'pointer', fontSize: '1.2rem', color: '#64748b',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>×</button>
            </div>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>Session Name *</label>
                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Math Class for Grade 10" required style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>Class Level *</label>
                <select value={formData.classLevel} onChange={e => setFormData({ ...formData, classLevel: e.target.value, subject: '' })} required style={{ ...inputStyle, background: 'white' }}>
                  <option value="">Select class level...</option>
                  {classLevels.map(l => <option key={l} value={l}>Class {l}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>Subject *</label>
                <select value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} required disabled={!formData.classLevel} style={{ ...inputStyle, background: formData.classLevel ? 'white' : '#f1f5f9', cursor: formData.classLevel ? 'pointer' : 'not-allowed' }}>
                  <option value="">{formData.classLevel ? 'Select subject...' : 'Select class level first'}</option>
                  {formData.classLevel && SUBJECTS_BY_CLASS[formData.classLevel]?.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>Time *</label>
                  <input type="text" value={formData.schedule} onChange={e => setFormData({ ...formData, schedule: e.target.value })} placeholder="6:00 PM - 7:00 PM" required style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>Date *</label>
                  <input type="date" value={formData.scheduledDate} onChange={e => setFormData({ ...formData, scheduledDate: e.target.value })} required style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>Assign Tutor *</label>
                <select value={formData.tutorId} onChange={e => setFormData({ ...formData, tutorId: e.target.value })} required style={{ ...inputStyle, background: 'white' }}>
                  <option value="">Select a tutor...</option>
                  {tutors.map(t => <option key={t._id} value={t._id}>{t.name} ({t.email})</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} style={{
                  flex: 1, padding: '0.875rem', borderRadius: '10px', border: '2px solid #e2e8f0',
                  background: 'white', color: '#64748b', cursor: 'pointer', fontWeight: 600
                }}>Cancel</button>
                <button type="submit" disabled={creating} style={{
                  flex: 1, padding: '0.875rem', borderRadius: '10px', border: 'none',
                  background: creating ? '#94a3b8' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white', cursor: creating ? 'not-allowed' : 'pointer', fontWeight: 600,
                  boxShadow: creating ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.3)'
                }}>{creating ? 'Creating...' : 'Create Session'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'white', padding: '2rem', borderRadius: '20px',
            maxWidth: '400px', width: '100%', textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem' }}>⚠️</div>
            <h3 style={{ margin: '0 0 0.5rem', color: '#0f172a', fontWeight: 700, fontSize: '1.15rem' }}>Delete Session?</h3>
            <p style={{ margin: '0 0 1.5rem', color: '#64748b', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Are you sure you want to delete <strong style={{ color: '#0f172a' }}>{deleteTarget.name}</strong>? This will also remove all student enrollments.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setDeleteTarget(null)} style={{ flex: 1, padding: '0.75rem', borderRadius: '10px', border: '2px solid #e2e8f0', background: 'white', color: '#64748b', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button onClick={confirmDelete} style={{ flex: 1, padding: '0.75rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: 'white', cursor: 'pointer', fontWeight: 600, boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminClasses;
