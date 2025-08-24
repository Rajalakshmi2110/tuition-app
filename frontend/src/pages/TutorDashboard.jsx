import React, { useEffect, useState } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; // removed braces
import { useNavigate, Link } from "react-router-dom";
import FileUpload from "../components/FileUpload";
import FileList from "../components/FileList";
import "../styles/TutorDashboard.css";

const TutorDashboard = () => {
  const [classes, setClasses] = useState([]);
  const [files, setFiles] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [showAllClasses, setShowAllClasses] = useState(false);
  const navigate = useNavigate();

  // Fetch tutor classes
  useEffect(() => {
    const fetchTutorClasses = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token:", token);
        if (!token) return;

        const decoded = jwtDecode(token);
        const userId = decoded.id || decoded._id;

        const res = await axios.get(
          `http://localhost:5000/api/classes/tutor/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setClasses(res.data);
      } catch (err) {
        console.error("Failed to fetch tutor classes", err);
      }
    };

    fetchTutorClasses();
  }, []);

  // Fetch tutor's files only
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        
        const decoded = jwtDecode(token);
        const userId = decoded.id || decoded._id;
        
        const res = await axios.get("http://localhost:5000/api/files", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Filter files uploaded by this tutor
        const tutorFiles = res.data.filter(file => file.uploadedBy?._id === userId);
        setFiles(tutorFiles);
      } catch (err) {
        console.error("Failed to fetch files", err);
      }
    };
    fetchFiles();
  }, []);

  // Fetch announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/announcements", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnnouncements(res.data);
      } catch (err) {
        console.error("Failed to fetch announcements:", err);
      }
    };
    fetchAnnouncements();
  }, []);

  const handleUpload = (newFile) => setFiles([newFile, ...files]);
  const handleDelete = (id) => setFiles(files.filter((f) => f._id !== id));

  return (
    <main style={{ padding: '2rem', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Global Announcements */}
        {announcements.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#20205c', marginBottom: '1rem', textAlign: 'center' }}>📢 Announcements</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {announcements.slice(0, 3).map((announcement) => (
                <div key={announcement._id} style={{
                  backgroundColor: announcement.type === 'urgent' ? '#fef2f2' : announcement.type === 'holiday' ? '#f0fdf4' : '#f8fafc',
                  border: `2px solid ${announcement.type === 'urgent' ? '#ef4444' : announcement.type === 'holiday' ? '#22c55e' : '#3b82f6'}`,
                  padding: '1rem',
                  borderRadius: '8px'
                }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#20205c' }}>{announcement.title}</h4>
                  <p style={{ margin: '0 0 0.5rem 0', color: '#666' }}>{announcement.message}</p>
                  <small style={{ color: '#999' }}>{new Date(announcement.createdAt).toLocaleDateString()}</small>
                </div>
              ))}
            </div>
          </div>
        )}
        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#20205c', marginBottom: '2rem', textAlign: 'center' }}>My Classes</h2>

        {classes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.1)', marginBottom: '3rem' }}>
            <p style={{ fontSize: '1.2rem', color: '#666' }}>No classes assigned.</p>
          </div>
        ) : (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '1rem' }}>
              {(showAllClasses ? classes : classes.slice(0, 3)).map((cls) => (
              <div key={cls._id} style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#20205c', marginBottom: '1rem' }}>{cls.name}</h3>
                <p style={{ color: '#666', marginBottom: '0.5rem' }}><strong>Subject:</strong> {cls.subject}</p>
                <p style={{ color: '#666', marginBottom: '1rem' }}><strong>Schedule:</strong> {cls.schedule}</p>

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
                    <p style={{ color: '#999', fontSize: '0.9rem', marginTop: '0.5rem' }}>No students enrolled yet.</p>
                  )}
                </div>

                <button
                  onClick={() => navigate(`/tutor/class/${cls._id}`)}
                  style={{
                    backgroundColor: '#2563eb',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.2)',
                    transform: 'translateY(0)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#1e40af';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#2563eb';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 8px rgba(37, 99, 235, 0.2)';
                  }}
                >
                  View Class Details
                </button>
              </div>
              ))}
            </div>
            
            {classes.length > 3 && (
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <button 
                  onClick={() => setShowAllClasses(!showAllClasses)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                    transform: 'translateY(0)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#1e40af';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#2563eb';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
                  }}
                >
                  {showAllClasses ? 'Show Less' : `Show All (${classes.length} classes)`}
                </button>
              </div>
            )}
          </div>
        )}

        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#20205c', marginBottom: '1.5rem', textAlign: 'center' }}>Upload Study Materials</h2>
          <FileUpload onUpload={handleUpload} />
        </div>

        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#20205c', marginBottom: '1.5rem', textAlign: 'center' }}>My Uploaded Files</h2>
          <FileList files={files} onDelete={handleDelete} />
        </div>
      </div>
    </main>
  );
};

export default TutorDashboard;
