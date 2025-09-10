import React, { useEffect, useState } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom";

const TutorClasses = () => {
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTutorClasses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = jwtDecode(token);
        const userId = decoded.id || decoded._id;

        const res = await axios.get(
          `https://tuitionapp-yq06.onrender.com/api/classes/tutor/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setClasses(res.data);
      } catch (err) {
        console.error("Failed to fetch tutor classes", err);
      }
    };

    fetchTutorClasses();
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#20205c', marginBottom: '2rem', textAlign: 'center' }}>
        My Sessions
      </h2>

      {classes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.1)' }}>
          <p style={{ fontSize: '1.2rem', color: '#666' }}>No sessions assigned.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
          {classes.map((cls) => (
            <div key={cls._id} style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#20205c', marginBottom: '1rem' }}>
                {cls.name}
              </h3>
              <p style={{ color: '#666', marginBottom: '0.5rem' }}>
                <strong>Subject:</strong> {cls.subject}
              </p>
              <p style={{ color: '#666', marginBottom: '1rem' }}>
                <strong>Schedule:</strong> {cls.schedule}
              </p>

              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ color: '#20205c' }}>Enrolled Students:</strong>
                {cls.students && cls.students.length > 0 ? (
                  <div style={{ marginTop: '0.5rem' }}>
                    {cls.students.map((student) => (
                      <span key={student._id} style={{
                        display: 'inline-block',
                        backgroundColor: '#e8f2ff',
                        color: '#2563eb',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.9rem',
                        margin: '0.25rem 0.25rem 0 0'
                      }}>
                        {student.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#999', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    No students enrolled yet.
                  </p>
                )}
              </div>

              <button
                onClick={() => navigate(`/tutor/session/${cls._id}`)}
                style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#1e40af'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
              >
                View Session Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TutorClasses;