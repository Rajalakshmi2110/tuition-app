import React, { useEffect, useState } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

const StudentEnrollClass = () => {
  const [availableSessions, setAvailableSessions] = useState([]);
  const [enrolledSessions, setEnrolledSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchSessions = async () => {
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const userId = decoded.id || decoded._id;

      // Get all sessions
      const allSessionsRes = await axios.get('http://localhost:5000/api/classes', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Separate enrolled and available sessions
      const enrolled = [];
      const available = [];

      allSessionsRes.data.forEach(session => {
        const isEnrolled = session.students && session.students.some(student => student._id === userId);
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
  };

  const enrollSession = async (sessionId) => {
    try {
      const decoded = jwtDecode(token);
      const userId = decoded.id || decoded._id;

      await axios.post(
        `http://localhost:5000/api/classes/enroll`,
        { studentId: userId, classId: sessionId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Enrolled successfully!");
      fetchSessions();
    } catch (err) {
      console.error("Enrollment failed:", err);
      alert("Enrollment failed!");
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [token]);

  if (loading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '1.2rem', color: '#666' }}>Loading sessions...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#20205c', marginBottom: '2rem', textAlign: 'center' }}>
        My Session Enrollment
      </h2>

      {/* Enrolled Sessions */}
      <div style={{ marginBottom: '3rem' }}>
        <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#20205c', marginBottom: '1.5rem' }}>
          🎓 Enrolled Sessions
        </h3>
        
        {enrolledSessions.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {enrolledSessions.map((session) => (
              <div key={session._id} style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                border: '2px solid #10b981'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>✅</span>
                  <h4 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#20205c', margin: 0 }}>{session.name}</h4>
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  <span style={{ backgroundColor: '#dbeafe', color: '#1e40af', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.9rem' }}>
                    📚 {session.subject}
                  </span>
                  <span style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.9rem' }}>
                    📅 {session.schedule}
                  </span>
                </div>
                <p style={{ color: '#666', margin: 0 }}>
                  <strong>Tutor:</strong> {session.tutor?.name || "N/A"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Sessions */}
      <div>
        <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#20205c', marginBottom: '1.5rem' }}>
          📚 Enrolled Sessions ({availableSessions.length})
        </h3>
        
        {availableSessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
            <p style={{ fontSize: '1.2rem', color: '#666' }}>No available sessions</p>
            <p style={{ color: '#6b7280' }}>All sessions are either full or you're already enrolled!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {availableSessions.map((session) => (
              <div key={session._id} style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                border: '2px solid #e5e7eb',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}>
                <h4 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#20205c', marginBottom: '1rem' }}>{session.name}</h4>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  <span style={{ backgroundColor: '#dbeafe', color: '#1e40af', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.9rem' }}>
                    📚 {session.subject}
                  </span>
                  <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.9rem' }}>
                    🎓 Grade {session.classLevel}
                  </span>
                  <span style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.9rem' }}>
                    📅 {session.schedule}
                  </span>
                </div>
                <p style={{ color: '#666', marginBottom: '1.5rem' }}>
                  <strong>Tutor:</strong> {session.tutor?.name || "N/A"}
                </p>
                <button
                  onClick={() => enrollSession(session._id)}
                  style={{
                    width: '100%',
                    padding: '12px 20px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '16px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
                >
                  🎓 Enroll Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentEnrollClass;
