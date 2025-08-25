import React, { useEffect, useState } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

const StudentFiles = () => {
  const [enrolledSessions, setEnrolledSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchSessions() {
      try {
        const decoded = jwtDecode(token);
        console.log('Current user ID:', decoded.id);
        
        // Get all sessions and filter by student enrollment
        const res = await axios.get('http://localhost:5000/api/classes', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        console.log('All sessions:', res.data);
        
        // Filter sessions where this student is enrolled
        const studentSessions = res.data.filter(session => {
          console.log('Checking session:', session.name, 'Students:', session.students);
          return session.students && session.students.some(student => {
            console.log('Comparing student ID:', student._id, 'with user ID:', decoded.id);
            return student._id === decoded.id;
          });
        });
        
        console.log('Student enrolled sessions:', studentSessions);
        setEnrolledSessions(studentSessions);
        if (studentSessions.length > 0) setSelectedSessionId(studentSessions[0]._id);
      } catch (err) {
        console.error('Error fetching sessions:', err);
        setError("Failed to load sessions");
      }
    }
    fetchSessions();
  }, [token]);

  useEffect(() => {
    if (!selectedSessionId) return;

    async function fetchFiles() {
      setLoading(true);
      setError(null);
      try {
        // Get all files and filter by selected session
        const res = await axios.get('http://localhost:5000/api/files', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Filter files that belong to the selected session
        const sessionFiles = res.data.filter(file => 
          file.classId && file.classId._id === selectedSessionId
        );
        
        console.log('Session files:', sessionFiles);
        setFiles(sessionFiles);
      } catch (err) {
        console.error('Error fetching files:', err);
        setError("Failed to load files");
      } finally {
        setLoading(false);
      }
    }
    fetchFiles();
  }, [selectedSessionId, token]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#20205c', marginBottom: '2rem', textAlign: 'center' }}>
        Study Materials
      </h2>

      {enrolledSessions.length > 0 && (
        <div style={{ marginBottom: '2rem', backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
            Select Session:
          </label>
          <select
            value={selectedSessionId}
            onChange={(e) => setSelectedSessionId(e.target.value)}
            style={{
              width: '100%', maxWidth: '400px', padding: '12px', borderRadius: '8px',
              border: '1px solid #d1d5db', fontSize: '16px', backgroundColor: 'white'
            }}
          >
            {enrolledSessions.map((session) => (
              <option key={session._id} value={session._id}>
                {session.name} - {session.subject}
              </option>
            ))}
          </select>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '1.2rem', color: '#666' }}>Loading files...</div>
        </div>
      )}
      
      {error && (
        <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '1.2rem', color: '#dc2626' }}>{error}</div>
        </div>
      )}

      {enrolledSessions.length > 0 && !loading && !error && (
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.1)' }}>
          {files.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📁</div>
              <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No study materials available</p>
              <p>No files have been uploaded for this session yet.</p>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>Available Files ({files.length})</h3>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>Click on any file to download or view</p>
              </div>
              
              <div style={{ display: 'grid', gap: '1rem' }}>
                {files.map((file) => (
                  <div key={file._id} style={{
                    padding: '1.5rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8f9ff';
                    e.currentTarget.style.borderColor = '#3b82f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ fontSize: '2rem' }}>📄</div>
                      <div style={{ flex: 1 }}>
                        <a
                          href={`http://localhost:5000/${file.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: '#2563eb', textDecoration: 'none', fontWeight: '600',
                            fontSize: '1.1rem', display: 'block', marginBottom: '0.25rem'
                          }}
                        >
                          {file.title || file.originalName}
                        </a>
                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: '#6b7280' }}>
                          <span>📤 Uploaded by: {file.uploadedBy?.name}</span>
                          <span>📅 {new Date(file.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div style={{ color: '#3b82f6', fontSize: '1.5rem' }}>↗</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}


    </div>
  );
};

export default StudentFiles;
