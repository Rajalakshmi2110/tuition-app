import React, { useEffect, useState } from "react";
import api from '../services/api';
import { jwtDecode } from "jwt-decode";
import API_CONFIG from '../config/apiConfig';
import LoadingSpinner from '../components/LoadingSpinner';

const StudentFiles = () => {
  const [enrolledSessions, setEnrolledSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSessions() {
      try {
        const decoded = jwtDecode(localStorage.getItem('token'));
        const userId = decoded.id || decoded._id;

        const res = await api.get(`/classes/student/${userId}`);

        setEnrolledSessions(res.data);
        if (res.data.length > 0) setSelectedSessionId(res.data[0]._id);
      } catch (err) {
        console.error('Error fetching sessions:', err);
        setError("Failed to load sessions");
      }
    }
    fetchSessions();
  }, []);

  useEffect(() => {
    if (!selectedSessionId) return;

    async function fetchFiles() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/files`);

        const sessionFiles = res.data.filter(file =>
          file.classId && file.classId._id === selectedSessionId
        );

        setFiles(sessionFiles);
      } catch (err) {
        console.error('Error fetching files:', err);
        setError("Failed to load files");
      } finally {
        setLoading(false);
      }
    }
    fetchFiles();
  }, [selectedSessionId]);

  const getFileIcon = (filename) => {
    const ext = filename?.split('.').pop()?.toLowerCase();
    const icons = {
      pdf: '▣',
      doc: '▣',
      docx: '▣',
      ppt: '◇',
      pptx: '◇',
      xls: '△',
      xlsx: '△',
      txt: '☰',
      jpg: '⬡',
      jpeg: '⬡',
      png: '⬡',
      mp4: '▷',
      mp3: '♫',
      zip: '◈'
    };
    return icons[ext] || '▣';
  };

  if (loading) {
    return <LoadingSpinner message="Loading files..." fullPage />;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: '#0f172a',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          Study Materials
        </h2>
        <p style={{ color: '#64748b', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
          Access your course files and resources
        </p>
      </div>

      {/* Session Selector */}
      {enrolledSessions.length > 0 && (
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '16px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0',
          marginBottom: '1.5rem'
        }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 600,
            color: '#374151',
            fontSize: '0.9rem'
          }}>
            Select Session
          </label>
          <select
            value={selectedSessionId}
            onChange={(e) => setSelectedSessionId(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '400px',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              border: '2px solid #e2e8f0',
              fontSize: '1rem',
              backgroundColor: 'white',
              outline: 'none',
              transition: 'all 0.2s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = '#10b981'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          >
            {enrolledSessions.map((session) => (
              <option key={session._id} value={session._id}>
                {session.name} - {session.subject}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={{
          padding: '2rem',
          background: '#fef2f2',
          borderRadius: '12px',
          border: '2px solid #fecaca',
          textAlign: 'center'
        }}>
          <p style={{ color: '#dc2626', fontWeight: 600 }}>{error}</p>
        </div>
      )}

      {/* Files Grid */}
      {enrolledSessions.length > 0 && !loading && !error && (
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '16px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0'
        }}>
          {files.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem', color: '#10b981' }}>▣</div>
              <h3 style={{ color: '#0f172a', fontWeight: 700, marginBottom: '0.5rem' }}>
                No Study Materials
              </h3>
              <p style={{ color: '#64748b' }}>
                No files have been uploaded for this session yet.
              </p>
            </div>
          ) : (
            <>
              <div style={{
                marginBottom: '1.5rem',
                padding: '1rem',
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                borderRadius: '10px',
                border: '1px solid #bbf7d0'
              }}>
                <h3 style={{ margin: '0 0 0.25rem 0', color: '#166534', fontSize: '1rem' }}>
                  Available Files ({files.length})
                </h3>
                <p style={{ margin: 0, color: '#16a34a', fontSize: '0.85rem' }}>
                  Click on any file to download or view
                </p>
              </div>

              <div style={{ display: 'grid', gap: '1rem' }}>
                {files.map((file) => (
                  <div
                    key={file._id}
                    style={{
                      padding: '1.25rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f0fdf4';
                      e.currentTarget.style.borderColor = '#10b981';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        flexShrink: 0
                      }}>
                        {getFileIcon(file.originalName)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <a
                          href={`${API_CONFIG.BASE_URL}/${file.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: '#0f172a',
                            textDecoration: 'none',
                            fontWeight: 600,
                            fontSize: '1rem',
                            display: 'block',
                            marginBottom: '0.25rem'
                          }}
                        >
                          {file.title || file.originalName}
                        </a>
                        <div style={{
                          display: 'flex',
                          gap: '1rem',
                          fontSize: '0.85rem',
                          color: '#64748b',
                          flexWrap: 'wrap'
                        }}>
                          <span>By: {file.uploadedBy?.name}</span>
                          <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        background: '#f0fdf4',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#10b981',
                        fontSize: '1rem'
                      }}>
                        ↗
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Empty State - No Sessions */}
      {enrolledSessions.length === 0 && !error && (
        <div style={{
          background: 'white',
          padding: '4rem 2rem',
          borderRadius: '16px',
          textAlign: 'center',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem', color: '#10b981' }}>▣</div>
          <h3 style={{ color: '#0f172a', fontWeight: 700, marginBottom: '0.5rem' }}>
            No Enrolled Sessions
          </h3>
          <p style={{ color: '#64748b', maxWidth: '400px', margin: '0 auto' }}>
            You need to be enrolled in a session to access study materials.
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentFiles;
