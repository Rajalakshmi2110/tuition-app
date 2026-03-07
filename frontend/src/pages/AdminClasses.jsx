import React, { useEffect, useState } from 'react';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';
import { useToast } from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('all');
  const toast = useToast();
  
  const classLevels = ['4', '5', '6', '7', '8', '9', '10', '11', '12'];

  const handleDeleteClass = async (classId) => {
    if (!window.confirm('Are you sure you want to delete this session? This will also remove all student enrollments.')) {
      return;
    }
    try {
      await api.delete(`/classes/${classId}`);
      setClasses(classes.filter(cls => cls._id !== classId));
      toast.success('Session deleted successfully!');
    } catch (err) {
      console.error('Error deleting session:', err);
      toast.error('Failed to delete session');
    }
  };

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.get(`/classes`);
        setClasses(res.data);
      } catch (err) {
        console.error('Error fetching sessions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  if (loading) return (
    <AdminLayout>
      <LoadingSpinner message="Loading sessions..." fullPage />
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#0f172a',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            All Tuition Sessions
          </h1>
          <p style={{ color: '#64748b', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
            Manage all sessions and their assignments
          </p>
        </div>

        {/* Class Filter Dropdown */}
        {classes.length > 0 && (
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '1.5rem',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'white',
              padding: '0.5rem 0.75rem 0.5rem 1rem',
              borderRadius: '12px',
              border: '2px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Filter by Class</span>
              </div>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                style={{
                  padding: '0.6rem 2.5rem 0.6rem 1rem',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: '#0f172a',
                  cursor: 'pointer',
                  outline: 'none',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center',
                  minWidth: '160px',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#10b981';
                  e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="all">All Classes ({classes.length})</option>
                {classLevels.map(level => {
                  const count = classes.filter(c => c.classLevel === level).length;
                  if (count === 0) return null;
                  return (
                    <option key={level} value={level}>
                      Class {level} ({count})
                    </option>
                  );
                })}
              </select>
            </div>
            {selectedClass !== 'all' && (
              <button
                onClick={() => setSelectedClass('all')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.5rem 1rem',
                  background: '#fef2f2',
                  color: '#dc2626',
                  border: '2px solid #fecaca',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#fee2e2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fef2f2';
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                Clear Filter
              </button>
            )}
          </div>
        )}

        {(() => {
          const filteredClasses = selectedClass === 'all' 
            ? classes 
            : classes.filter(c => c.classLevel === selectedClass);
          
          if (classes.length === 0) {
            return (
              <div style={{
                backgroundColor: 'white',
                padding: '4rem 2rem',
                borderRadius: '16px',
                textAlign: 'center',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #10b98120 0%, #05966920 100%)',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem'
                }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                <h3 style={{ color: '#0f172a', fontWeight: 700, marginBottom: '0.5rem' }}>
                  No Sessions Yet
                </h3>
                <p style={{ color: '#64748b' }}>Create your first session to get started.</p>
              </div>
            );
          }
          
          if (filteredClasses.length === 0) {
            return (
              <div style={{
                backgroundColor: 'white',
                padding: '3rem 2rem',
                borderRadius: '16px',
                textAlign: 'center',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                border: '1px solid #e2e8f0'
              }}>
                <p style={{ color: '#64748b', margin: 0 }}>No sessions found for Class {selectedClass}</p>
              </div>
            );
          }
          
          return (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {filteredClasses.map((cls) => (
              <div
                key={cls._id}
                style={{
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '16px',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.borderColor = '#10b981';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.05)';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '1rem',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 0.75rem 0', color: '#0f172a', fontSize: '1.25rem', fontWeight: 700 }}>
                      {cls.name}
                    </h3>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{
                        backgroundColor: '#dbeafe',
                        color: '#1e40af',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: 500
                      }}>
                        {cls.subject}
                      </span>
                      <span style={{
                        backgroundColor: '#dcfce7',
                        color: '#166534',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: 500
                      }}>
                        Grade {cls.classLevel}
                      </span>
                      <span style={{
                        backgroundColor: '#fef3c7',
                        color: '#92400e',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: 500
                      }}>
                        {cls.schedule}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{
                      backgroundColor: cls.status === 'completed' ? '#fee2e2' : '#f0fdf4',
                      color: cls.status === 'completed' ? '#991b1b' : '#166534',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}>
                      {cls.status === 'completed' ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                      )}
                      {cls.status === 'completed' ? 'Completed' : 'Scheduled'}
                    </span>
                    <button
                      onClick={() => handleDeleteClass(cls._id)}
                      style={{
                        background: 'transparent',
                        color: '#94a3b8',
                        border: '2px solid #e2e8f0',
                        padding: '0.5rem 1rem',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#fef2f2';
                        e.currentTarget.style.borderColor = '#fecaca';
                        e.currentTarget.style.color = '#dc2626';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.color = '#94a3b8';
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>

                {/* Tutor Info */}
                <div style={{
                  backgroundColor: '#f8fafc',
                  padding: '1rem',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0'
                }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151', fontSize: '0.9rem', fontWeight: 600 }}>
                    Assigned Tutor
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 700
                    }}>
                      {cls.tutor?.name?.charAt(0) || 'N'}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, color: '#0f172a' }}>
                        {cls.tutor?.name || 'No tutor assigned'}
                      </p>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                        {cls.tutor?.email || 'No email available'}
                      </p>
                    </div>
                  </div>
                </div>

                {cls.scheduledDate && (
                  <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
                    Scheduled for: {new Date(cls.scheduledDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
          );
        })()}
      </div>
    </AdminLayout>
  );
};

export default AdminClasses;
