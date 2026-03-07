import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import API_CONFIG from "../config/apiConfig";

const StudentDashboard = () => {
  const [files, setFiles] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Clock Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatClock = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Fetch student's sessions
  const fetchClasses = useCallback(async () => {
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      const res = await axios.get(
        `${API_CONFIG.BASE_URL}/api/classes`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const studentClasses = res.data.filter(cls => {
        const isEnrolled = cls.students && cls.students.some(student => 
          student._id === decoded.id || student._id?.toString() === decoded.id
        );
        const matchesClassLevel = cls.classLevel === decoded.className;
        return isEnrolled || matchesClassLevel;
      });
      // Classes fetched for potential future use
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
    }
  }, [token]);

  // Fetch files
  const fetchFiles = useCallback(async () => {
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      const res = await axios.get(
        `${API_CONFIG.BASE_URL}/api/files`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const classRes = await axios.get(
        `${API_CONFIG.BASE_URL}/api/classes`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Get classes where student is enrolled OR matches class level
      const studentClassIds = classRes.data
        .filter(cls => {
          const isEnrolled = cls.students && cls.students.some(student => 
            student._id === decoded.id || student._id?.toString() === decoded.id
          );
          const matchesClassLevel = cls.classLevel === decoded.className;
          return isEnrolled || matchesClassLevel;
        })
        .map(cls => cls._id);
      
      const studentFiles = res.data.filter(file =>
        studentClassIds.includes(file.classId?._id)
      );
      setFiles(studentFiles);
    } catch (err) {
      console.error("Failed to fetch files:", err);
    }
  }, [token]);

  // Fetch announcements
  const fetchAnnouncements = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(
        `${API_CONFIG.BASE_URL}/api/announcements`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnnouncements(res.data);
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
    }
  }, [token]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchClasses(),
        fetchFiles(),
        fetchAnnouncements()
      ]);
      setLoading(false);
    };
    loadData();
  }, [fetchClasses, fetchFiles, fetchAnnouncements]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
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
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

      {/* Clock Widget */}
      <div style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        padding: '2rem',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)',
        textAlign: 'center',
        marginBottom: '2rem',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '200px',
          height: '200px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%'
        }} />
        <div style={{
          fontSize: '3rem',
          fontWeight: 800,
          fontFamily: "'JetBrains Mono', monospace",
          marginBottom: '0.5rem',
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
        }}>
          {formatClock(currentTime)}
        </div>
        <div style={{
          fontSize: '1rem',
          opacity: 0.9
        }}>
          {currentTime.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>

      {/* Announcements */}
      {announcements.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#0f172a',
            marginBottom: '1rem'
          }}>
            Announcements
          </h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {announcements.slice(0, 3).map((announcement) => {
              const typeStyles = {
                urgent: { bg: '#fef2f2', border: '#ef4444' },
                holiday: { bg: '#f0fdf4', border: '#22c55e' },
                general: { bg: '#f8fafc', border: '#10b981' }
              };
              const style = typeStyles[announcement.type] || typeStyles.general;

              return (
                <div key={announcement._id} style={{
                  backgroundColor: style.bg,
                  border: `2px solid ${style.border}`,
                  padding: '1.25rem',
                  borderRadius: '12px',
                  transition: 'all 0.2s ease'
                }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontWeight: 600 }}>
                      {announcement.title}
                    </h4>
                    <p style={{ margin: '0 0 0.5rem 0', color: '#475569', lineHeight: 1.5 }}>
                      {announcement.message}
                    </p>
                    <small style={{ color: '#94a3b8' }}>
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Study Materials */}
      {files.length > 0 && (
        <div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#0f172a',
            marginBottom: '1rem'
          }}>
            Study Materials
          </h2>
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '16px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1rem'
            }}>
              {files.map((file) => (
                <a
                  key={file._id}
                  href={`${API_CONFIG.BASE_URL}/${file.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    background: '#f8fafc',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    border: '1px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f0fdf4';
                    e.currentTarget.style.borderColor = '#10b981';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    flexShrink: 0
                  }}>
                    PDF
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      margin: 0,
                      color: '#0f172a',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {file.title}
                    </p>
                    <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.8rem' }}>
                      {file.classId?.name} • {file.uploadedBy?.name}
                    </p>
                  </div>
                  <span style={{ color: '#10b981', fontSize: '1.2rem' }}>↓</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Class Details Modal */}
      {selectedClass && (
        <div
          onClick={() => setSelectedClass(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '20px',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              animation: 'slideUp 0.3s ease'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '1.5rem'
            }}>
              <div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  margin: 0
                }}>
                  {selectedClass.name}
                </h3>
                <p style={{ color: '#64748b', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
                  {selectedClass.subject}
                </p>
              </div>
              <button
                onClick={() => setSelectedClass(null)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: '#f1f5f9',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  color: '#64748b',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#fee2e2';
                  e.target.style.color = '#ef4444';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#f1f5f9';
                  e.target.style.color = '#64748b';
                }}
              >
                ×
              </button>
            </div>

            {/* Class Info */}
            <div style={{
              display: 'grid',
              gap: '0.75rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                padding: '0.75rem',
                background: '#f8fafc',
                borderRadius: '10px'
              }}>
                <span style={{ color: '#475569' }}>Schedule: {selectedClass.schedule}</span>
              </div>
              <div style={{
                padding: '0.75rem',
                background: '#f8fafc',
                borderRadius: '10px'
              }}>
                <span style={{ color: '#475569' }}>Tutor: {selectedClass.tutor?.name || "N/A"}</span>
              </div>
            </div>

            {/* Resources */}
            {selectedClass.resources && selectedClass.resources.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ color: '#0f172a', marginBottom: '0.75rem', fontWeight: 600 }}>
                  Resources
                </h4>
                {selectedClass.resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block',
                      padding: '0.75rem',
                      marginBottom: '0.5rem',
                      background: '#f0fdf4',
                      color: '#059669',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#dcfce7'}
                    onMouseLeave={(e) => e.target.style.background = '#f0fdf4'}
                  >
                    Resource Link {index + 1}
                  </a>
                ))}
              </div>
            )}

            {/* Announcements */}
            {selectedClass.announcements && selectedClass.announcements.length > 0 && (
              <div>
                <h4 style={{ color: '#0f172a', marginBottom: '0.75rem', fontWeight: 600 }}>
                  Class Announcements
                </h4>
                {selectedClass.announcements.slice().reverse().map((announcement, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: '#f8fafc',
                      padding: '1rem',
                      borderRadius: '10px',
                      borderLeft: '3px solid #10b981',
                      marginBottom: '0.75rem'
                    }}
                  >
                    <p style={{ margin: 0, color: '#475569', lineHeight: 1.5 }}>
                      {announcement.text}
                    </p>
                    <small style={{ color: '#94a3b8' }}>
                      {new Date(announcement.postedAt).toLocaleDateString()}
                    </small>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Animation styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default StudentDashboard;
