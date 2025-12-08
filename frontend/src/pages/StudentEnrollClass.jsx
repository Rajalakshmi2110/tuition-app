import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import API_CONFIG from "../config/apiConfig";

const StudentEnrollClass = () => {
  const [availableSessions, setAvailableSessions] = useState([]);
  const [enrolledSessions, setEnrolledSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const token = localStorage.getItem("token");

  const fetchSessions = useCallback(async () => {
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const userId = decoded.id || decoded._id;
      const studentClassName = decoded.className;

      const allSessionsRes = await axios.get(`${API_CONFIG.BASE_URL}/api/classes`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const enrolled = [];
      const available = [];

      allSessionsRes.data.forEach(session => {
        const isEnrolledById = session.students && session.students.some(student => 
          student._id === userId || student._id?.toString() === userId
        );
        const matchesClassLevel = session.classLevel === studentClassName;
        const isEnrolled = isEnrolledById || matchesClassLevel;
        
        if (isEnrolled) {
          enrolled.push(session);
        } else {
          available.push(session);
        }
      });
      
      setEnrolledSessions(enrolled);
      setAvailableSessions(available);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Subject Icon Component
  const SubjectIcon = ({ subject, size = 24 }) => {
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
    if (subjectLower.includes('biology')) {
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a10 10 0 1 0 10 10H12V2z"></path>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
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
        <p style={{ color: '#64748b', fontWeight: 500 }}>Loading sessions...</p>
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
          color: '#0f172a',
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
        <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>
          View your enrolled classes and available sessions
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
          background: 'white',
          padding: '1.25rem',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
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
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div>
              <p style={{ color: '#64748b', fontSize: '0.8rem', margin: 0 }}>Enrolled</p>
              <p style={{ color: '#0f172a', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{enrolledSessions.length}</p>
            </div>
          </div>
        </div>
        
        <div style={{
          flex: 1,
          background: 'white',
          padding: '1.25rem',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: '#f8fafc',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
            </div>
            <div>
              <p style={{ color: '#64748b', fontSize: '0.8rem', margin: 0 }}>Available</p>
              <p style={{ color: '#0f172a', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{availableSessions.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enrolled Sessions */}
      {enrolledSessions.length > 0 && (
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>
              Enrolled Sessions
            </h2>
            <span style={{
              background: '#f0fdf4',
              color: '#059669',
              padding: '0.25rem 0.625rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 600
            }}>
              {enrolledSessions.length}
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '1rem'
          }}>
            {enrolledSessions.map((session) => (
              <div
                key={session._id}
                onClick={() => setSelectedSession(session)}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  border: '2px solid #10b981',
                  padding: '1.25rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Enrolled Badge */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: '#f0fdf4',
                  color: '#059669',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.025em'
                }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Enrolled
                </div>

                {/* Session Info */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
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
                    <SubjectIcon subject={session.subject} size={22} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{
                      fontSize: '1.05rem',
                      fontWeight: 600,
                      color: '#0f172a',
                      margin: '0 0 0.5rem 0'
                    }}>
                      {session.name}
                    </h3>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '0.75rem' }}>
                      <span style={{
                        background: '#f1f5f9',
                        color: '#475569',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 500
                      }}>
                        {session.subject}
                      </span>
                      <span style={{
                        background: '#f1f5f9',
                        color: '#475569',
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
                        {session.schedule}
                      </span>
                      {session.classLevel && (
                        <span style={{
                          background: '#f1f5f9',
                          color: '#475569',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 500
                        }}>
                          Grade {session.classLevel}
                        </span>
                      )}
                    </div>
                    
                    {/* Tutor */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        background: '#e2e8f0',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#64748b',
                        fontSize: '0.7rem',
                        fontWeight: 600
                      }}>
                        {session.tutor?.name?.charAt(0) || 'T'}
                      </div>
                      <span style={{ color: '#64748b', fontSize: '0.8rem' }}>
                        {session.tutor?.name || 'Tutor'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Sessions */}
      {availableSessions.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>
              Other Sessions
            </h2>
            <span style={{
              background: '#f1f5f9',
              color: '#64748b',
              padding: '0.25rem 0.625rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 600
            }}>
              {availableSessions.length}
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '1rem'
          }}>
            {availableSessions.map((session) => (
              <div
                key={session._id}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  padding: '1.25rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#cbd5e1';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Session Info */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    background: '#f8fafc',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#94a3b8',
                    flexShrink: 0
                  }}>
                    <SubjectIcon subject={session.subject} size={22} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{
                      fontSize: '1.05rem',
                      fontWeight: 600,
                      color: '#0f172a',
                      margin: '0 0 0.5rem 0'
                    }}>
                      {session.name}
                    </h3>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '0.75rem' }}>
                      <span style={{
                        background: '#f1f5f9',
                        color: '#475569',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 500
                      }}>
                        {session.subject}
                      </span>
                      <span style={{
                        background: '#f1f5f9',
                        color: '#475569',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 500
                      }}>
                        Grade {session.classLevel}
                      </span>
                      <span style={{
                        background: '#f1f5f9',
                        color: '#475569',
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
                        {session.schedule}
                      </span>
                    </div>
                    
                    {/* Tutor */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '1rem'
                    }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        background: '#e2e8f0',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#64748b',
                        fontSize: '0.7rem',
                        fontWeight: 600
                      }}>
                        {session.tutor?.name?.charAt(0) || 'T'}
                      </div>
                      <span style={{ color: '#64748b', fontSize: '0.8rem' }}>
                        {session.tutor?.name || 'Tutor'}
                      </span>
                    </div>
                    
                    {/* Contact Admin */}
                    <div style={{
                      padding: '0.625rem',
                      background: '#f8fafc',
                      borderRadius: '8px',
                      textAlign: 'center',
                      color: '#64748b',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.375rem'
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                      Contact Admin to Enroll
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {enrolledSessions.length === 0 && availableSessions.length === 0 && (
        <div style={{
          background: 'white',
          padding: '4rem 2rem',
          borderRadius: '16px',
          textAlign: 'center',
          border: '1px solid #e2e8f0'
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
          <h3 style={{ color: '#0f172a', fontWeight: 600, marginBottom: '0.5rem' }}>
            No Sessions Available
          </h3>
          <p style={{ color: '#64748b', maxWidth: '360px', margin: '0 auto', fontSize: '0.9rem' }}>
            There are no sessions available at the moment. Please check back later.
          </p>
        </div>
      )}

      {/* Session Detail Modal */}
      {selectedSession && (
        <div
          onClick={() => setSelectedSession(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '440px',
              maxHeight: '90vh',
              overflow: 'auto'
            }}
          >
            {/* Modal Header */}
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  background: '#f0fdf4',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10b981'
                }}>
                  <SubjectIcon subject={selectedSession.subject} size={22} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>
                    {selectedSession.name}
                  </h2>
                  <p style={{ color: '#64748b', fontSize: '0.8rem', margin: 0 }}>Session Details</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSession(null)}
                style={{
                  width: '32px',
                  height: '32px',
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748b'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            {/* Modal Body */}
            <div style={{ padding: '1.5rem' }}>
              {/* Session Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.875rem',
                  background: '#f8fafc',
                  borderRadius: '10px'
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                  <div>
                    <p style={{ color: '#64748b', fontSize: '0.7rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subject</p>
                    <p style={{ color: '#0f172a', fontWeight: 600, margin: 0, fontSize: '0.9rem' }}>{selectedSession.subject}</p>
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.875rem',
                  background: '#f8fafc',
                  borderRadius: '10px'
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <div>
                    <p style={{ color: '#64748b', fontSize: '0.7rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Schedule</p>
                    <p style={{ color: '#0f172a', fontWeight: 600, margin: 0, fontSize: '0.9rem' }}>{selectedSession.schedule}</p>
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.875rem',
                  background: '#f8fafc',
                  borderRadius: '10px'
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <div>
                    <p style={{ color: '#64748b', fontSize: '0.7rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Instructor</p>
                    <p style={{ color: '#0f172a', fontWeight: 600, margin: 0, fontSize: '0.9rem' }}>{selectedSession.tutor?.name || 'TBA'}</p>
                  </div>
                </div>
                
                {selectedSession.classLevel && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.875rem',
                    background: '#f8fafc',
                    borderRadius: '10px'
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="3" y1="9" x2="21" y2="9"></line>
                    </svg>
                    <div>
                      <p style={{ color: '#64748b', fontSize: '0.7rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Grade Level</p>
                      <p style={{ color: '#0f172a', fontWeight: 600, margin: 0, fontSize: '0.9rem' }}>Grade {selectedSession.classLevel}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Resources Section */}
              {selectedSession.resources && selectedSession.resources.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: '#0f172a',
                    margin: '0 0 0.75rem 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                    Resources ({selectedSession.resources.length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {selectedSession.resources.map((resource, index) => (
                      <a
                        key={index}
                        href={resource.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.75rem',
                          background: '#f0fdf4',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          color: '#059669',
                          fontSize: '0.85rem',
                          fontWeight: 500,
                          transition: 'all 0.2s ease',
                          border: '1px solid #d1fae5'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#dcfce7';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#f0fdf4';
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          Resource {index + 1}
                        </span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Announcements Section */}
              {selectedSession.announcements && selectedSession.announcements.length > 0 && (
                <div>
                  <h3 style={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: '#0f172a',
                    margin: '0 0 0.75rem 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                    Announcements ({selectedSession.announcements.length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {selectedSession.announcements.slice().reverse().map((announcement, index) => (
                      <div
                        key={index}
                        style={{
                          padding: '0.875rem',
                          background: '#fffbeb',
                          borderRadius: '8px',
                          borderLeft: '3px solid #f59e0b'
                        }}
                      >
                        <p style={{ 
                          margin: '0 0 0.5rem 0', 
                          color: '#1a1a2e', 
                          fontSize: '0.85rem',
                          lineHeight: 1.5
                        }}>
                          {announcement.text}
                        </p>
                        <p style={{ 
                          margin: 0, 
                          color: '#92400e', 
                          fontSize: '0.7rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                          {new Date(announcement.postedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Updates Message */}
              {(!selectedSession.resources || selectedSession.resources.length === 0) && 
               (!selectedSession.announcements || selectedSession.announcements.length === 0) && (
                <div style={{
                  padding: '1.5rem',
                  background: '#f8fafc',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 0.5rem' }}>
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
                    No resources or announcements yet
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentEnrollClass;
