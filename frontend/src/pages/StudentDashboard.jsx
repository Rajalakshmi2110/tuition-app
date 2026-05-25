import React, { useEffect, useState, useCallback } from "react";
import api from '../services/api';
import { jwtDecode } from "jwt-decode";
import LoadingSpinner from '../components/LoadingSpinner';

const StudentDashboard = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');

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
    try {
      const decoded = jwtDecode(localStorage.getItem('token'));
      const res = await api.get(`/classes`);
      
      try {
        const userRes = await api.get('/users/profile');
        setStudentName(userRes.data.user?.name || '');
        setStudentEmail(userRes.data.user?.email || '');
      } catch (e) {}

      res.data.filter(cls => {
        const isEnrolled = cls.students && cls.students.some(student => 
          student._id === decoded.id || student._id?.toString() === decoded.id
        );
        const matchesClassLevel = cls.classLevel === decoded.className;
        return isEnrolled || matchesClassLevel;
      });
    } catch (err) {
    }
  }, []);

  const fetchAnnouncements = useCallback(async () => {
    try {
      const res = await api.get(`/announcements`);
      setAnnouncements(res.data);
    } catch (err) {
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchClasses(),
        fetchAnnouncements()
      ]);
      setLoading(false);
    };
    loadData();
  }, [fetchClasses, fetchAnnouncements]);

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." fullPage />;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

      {/* Welcome Section */}
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
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '300px',
          height: '300px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%'
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 0.25rem 0' }}>
            Welcome back, {studentName || 'Student'}!
          </h1>
          {studentEmail && (
            <p style={{ fontSize: '0.9rem', opacity: 0.85, margin: 0 }}>{studentEmail}</p>
          )}
        </div>
      </div>

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

      {/* Daily Motivational Quote */}
      <div style={{
        padding: '1.25rem 1.5rem',
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
        borderRadius: '16px',
        border: '1px solid var(--border-light)',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem'
      }}>
        <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>💡</span>
        <div>
          <p style={{ margin: 0, color: 'var(--text-primary)', fontStyle: 'italic', lineHeight: 1.6, fontWeight: 500 }}>
            {[
              "Education is the most powerful weapon which you can use to change the world.",
              "The beautiful thing about learning is that no one can take it away from you.",
              "Success is the sum of small efforts, repeated day in and day out.",
              "Don't let what you cannot do interfere with what you can do.",
              "The expert in anything was once a beginner.",
              "Learning is not attained by chance, it must be sought for with ardor.",
              "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
              "Education is not preparation for life; education is life itself.",
              "Believe you can and you're halfway there.",
              "The only way to do great work is to love what you are learning.",
              "A person who never made a mistake never tried anything new.",
              "It does not matter how slowly you go as long as you do not stop.",
              "The secret of getting ahead is getting started.",
              "You don't have to be great to start, but you have to start to be great.",
              "Every accomplishment starts with the decision to try.",
              "Knowledge is power. Information is liberating. Education is the premise of progress.",
              "The roots of education are bitter, but the fruit is sweet.",
              "An investment in knowledge pays the best interest.",
              "Live as if you were to die tomorrow. Learn as if you were to live forever.",
              "The mind is not a vessel to be filled, but a fire to be kindled.",
              "Study hard, for the well is deep, and our brains are shallow.",
              "Push yourself, because no one else is going to do it for you.",
              "Great things never come from comfort zones.",
              "Dream big. Work hard. Stay focused.",
              "The future belongs to those who believe in the beauty of their dreams.",
              "Don't watch the clock; do what it does. Keep going.",
              "Hardships often prepare ordinary people for an extraordinary destiny.",
              "Your limitation—it's only your imagination.",
              "Wake up with determination. Go to bed with satisfaction.",
              "Little things make big days.",
              "It's going to be hard, but hard does not mean impossible."
            ][Math.floor((new Date().getFullYear() * 366 + new Date().getMonth() * 31 + new Date().getDate()) % 31)]}
          </p>
          <p style={{ margin: '0.5rem 0 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>Quote of the Day</p>
        </div>
      </div>

      {/* Announcements */}
      {announcements.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '1rem'
          }}>
            Announcements
          </h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {announcements.slice(0, 3).map((announcement) => {
              const typeStyles = {
                urgent: { bg: 'var(--bg-urgent, #fef2f2)', border: '#ef4444' },
                holiday: { bg: 'var(--bg-success, #f0fdf4)', border: '#22c55e' },
                general: { bg: 'var(--bg-secondary)', border: '#10b981' }
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
                    <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)', fontWeight: 600 }}>
                      {announcement.title}
                    </h4>
                    <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {announcement.message}
                    </p>
                    <small style={{ color: 'var(--text-light)' }}>
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              );
            })}
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
              backgroundColor: 'var(--bg-primary)',
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
                  color: 'var(--text-primary)',
                  margin: 0
                }}>
                  {selectedClass.name}
                </h3>
                <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
                  {selectedClass.subject}
                </p>
              </div>
              <button
                onClick={() => setSelectedClass(null)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'var(--bg-secondary)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  color: 'var(--text-muted)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#fee2e2';
                  e.target.style.color = '#ef4444';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'var(--bg-secondary)';
                  e.target.style.color = 'var(--text-muted)';
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
                background: 'var(--bg-secondary)',
                borderRadius: '10px'
              }}>
                <span style={{ color: 'var(--text-secondary)' }}>Schedule: {selectedClass.schedule}</span>
              </div>
              <div style={{
                padding: '0.75rem',
                background: 'var(--bg-secondary)',
                borderRadius: '10px'
              }}>
                <span style={{ color: 'var(--text-secondary)' }}>Tutor: {selectedClass.tutor?.name || "N/A"}</span>
              </div>
            </div>

            {/* Resources */}
            {selectedClass.resources && selectedClass.resources.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem', fontWeight: 600 }}>
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
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem', fontWeight: 600 }}>
                  Class Announcements
                </h4>
                {selectedClass.announcements.slice().reverse().map((announcement, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      padding: '1rem',
                      borderRadius: '10px',
                      borderLeft: '3px solid #10b981',
                      marginBottom: '0.75rem'
                    }}
                  >
                    <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {announcement.text}
                    </p>
                    <small style={{ color: 'var(--text-light)' }}>
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
