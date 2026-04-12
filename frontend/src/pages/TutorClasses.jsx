import React, { useEffect, useState } from "react";
import api from '../services/api';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const TutorClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Subject Icon Component
  const SubjectIcon = ({ subject, size = 22 }) => {
    const subjectLower = subject?.toLowerCase() || '';
    
    if (subjectLower.includes('math')) {
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="5" x2="5" y2="19"></line>
          <circle cx="6.5" cy="6.5" r="2.5"></circle>
          <circle cx="17.5" cy="17.5" r="2.5"></circle>
        </svg>
      );
    }
    if (subjectLower.includes('physics')) {
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <ellipse cx="12" cy="12" rx="10" ry="4"></ellipse>
          <line x1="12" y1="2" x2="12" y2="22"></line>
        </svg>
      );
    }
    if (subjectLower.includes('chemistry')) {
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 3h6v7l4 9H5l4-9V3z"></path>
          <line x1="9" y1="3" x2="15" y2="3"></line>
        </svg>
      );
    }
    if (subjectLower.includes('tamil')) {
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          <line x1="12" y1="6" x2="12" y2="12"></line>
          <line x1="9" y1="9" x2="15" y2="9"></line>
        </svg>
      );
    }
    if (subjectLower.includes('english')) {
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      );
    }
    // Default book icon
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
      </svg>
    );
  };

  useEffect(() => {
    const fetchTutorClasses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const decoded = jwtDecode(token);
        const userId = decoded.id || decoded._id;

        let tutorClasses = [];

        try {
          const res = await api.get(
            `/classes/tutor/${userId}`
          );
          tutorClasses = res.data || [];
        } catch (tutorErr) {
        }

        if (tutorClasses.length === 0) {
          const allRes = await api.get(
            `/classes`
          );
          
          tutorClasses = allRes.data.filter(cls => {
            const clsTutorId = cls.tutor?._id?.toString() || cls.tutor?.toString() || '';
            return clsTutorId === userId;
          });
        }

        setClasses(tutorClasses);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    fetchTutorClasses();
  }, []);

  const totalStudents = classes.reduce((acc, cls) => acc + (cls.students?.length || 0), 0);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: '1rem'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '3px solid #e2e8f0',
          borderTopColor: '#10b981',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Loading sessions...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          margin: '0 0 0.25rem 0',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
          My Sessions
        </h1>
        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>
          Manage your assigned teaching sessions
        </p>
      </div>

      {/* Stats Row */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          flex: 1,
          background: 'var(--bg-primary)',
          padding: '1.25rem',
          borderRadius: '12px',
          border: '1px solid var(--border-light)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: '#f0fdf4',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10b981'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>Total Sessions</p>
              <p style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{classes.length}</p>
            </div>
          </div>
        </div>
        
        <div style={{
          flex: 1,
          background: 'var(--bg-primary)',
          padding: '1.25rem',
          borderRadius: '12px',
          border: '1px solid var(--border-light)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'var(--bg-secondary)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>Total Students</p>
              <p style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{totalStudents}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      {classes.length === 0 ? (
        <div style={{
          background: 'var(--bg-primary)',
          padding: '4rem 2rem',
          borderRadius: '16px',
          textAlign: 'center',
          border: '1px solid var(--border-light)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: '#f0fdf4',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            color: '#10b981'
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
          </div>
          <h3 style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.5rem' }}>
            No Sessions Assigned
          </h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '360px', margin: '0 auto', fontSize: '0.9rem' }}>
            You haven't been assigned to any sessions yet. Please contact the admin.
          </p>
        </div>
      ) : (
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
              Assigned Sessions
            </h2>
            <span style={{
              background: '#f0fdf4',
              color: '#059669',
              padding: '0.25rem 0.625rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 600
            }}>
              {classes.length}
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1rem'
          }}>
            {classes.map((cls) => (
              <div
                key={cls._id}
                style={{
                  background: 'var(--bg-primary)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-light)',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#10b981';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-light)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Card Content */}
                <div style={{ padding: '1.25rem' }}>
                  {/* Session Info */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      background: '#f0fdf4',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#10b981',
                      flexShrink: 0
                    }}>
                      <SubjectIcon subject={cls.subject} size={22} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{
                        fontSize: '1.05rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        margin: '0 0 0.5rem 0'
                      }}>
                        {cls.name}
                      </h3>
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                        <span style={{
                          background: 'var(--bg-secondary)',
                          color: 'var(--text-secondary)',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 500
                        }}>
                          {cls.subject}
                        </span>
                        <span style={{
                          background: 'var(--bg-secondary)',
                          color: 'var(--text-secondary)',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          {cls.schedule}
                        </span>
                        {cls.classLevel && (
                          <span style={{
                            background: 'var(--bg-secondary)',
                            color: 'var(--text-secondary)',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 500
                          }}>
                            Grade {cls.classLevel}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Students Section */}
                  <div style={{
                    background: 'var(--bg-secondary)',
                    padding: '0.875rem',
                    borderRadius: '8px',
                    marginBottom: '1rem'
                  }}>
                    <p style={{
                      margin: '0 0 0.5rem 0',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem'
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                      Students <span style={{ background: '#ecfdf5', color: '#059669', fontSize: '0.7rem', padding: '0.1rem 0.45rem', borderRadius: '10px', fontWeight: 600 }}>{cls.students?.length || 0}</span>
                    </p>
                    {cls.students && cls.students.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                        {cls.students.slice(0, 5).map((student) => (
                          <span
                            key={student._id}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              backgroundColor: '#f0fdf4',
                              color: '#059669',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: 500
                            }}
                          >
                            {student.name}
                          </span>
                        ))}
                        {cls.students.length > 5 && (
                          <span style={{
                            backgroundColor: '#e2e8f0',
                            color: 'var(--text-muted)',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 500
                          }}>
                            +{cls.students.length - 5} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <p style={{ color: 'var(--text-light)', fontSize: '0.8rem', margin: 0 }}>
                        No students enrolled yet
                      </p>
                    )}
                  </div>

                  {/* Manage Button */}
                  <button
                    onClick={() => navigate(`/tutor/session/${cls._id}`)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'var(--bg-primary)',
                      color: '#10b981',
                      border: '2px solid #10b981',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#10b981';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--bg-primary)';
                      e.currentTarget.style.color = '#10b981';
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Manage Session
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorClasses;
