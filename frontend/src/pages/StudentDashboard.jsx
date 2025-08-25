import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; // removed braces
import FileList from "../components/FileList";

const StudentDashboard = () => {
  const [myClasses, setMyClasses] = useState([]);
  const [files, setFiles] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [showAllClasses, setShowAllClasses] = useState(false);
  const token = localStorage.getItem("token");

  // Fetch student's sessions
  const fetchClasses = useCallback(async () => {
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      const studentClassName = decoded.className;
      console.log('Student className:', studentClassName);

      // Get all classes and filter by student enrollment
      const res = await axios.get(
        'http://localhost:5000/api/classes',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Filter classes where this student is enrolled
      const studentClasses = res.data.filter(cls => 
        cls.students && cls.students.some(student => student._id === decoded.id)
      );
      
      console.log('Student enrolled sessions:', studentClasses);
      setMyClasses(studentClasses);
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
    }
  }, [token]);

  // Fetch files for student's enrolled sessions
  const fetchFiles = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(
        'http://localhost:5000/api/files',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Get student's enrolled class IDs first
      const decoded = jwtDecode(token);
      const classRes = await axios.get(
        'http://localhost:5000/api/classes',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const studentClassIds = classRes.data
        .filter(cls => cls.students && cls.students.some(student => student._id === decoded.id))
        .map(cls => cls._id);
      
      // Filter files that belong to student's enrolled sessions
      const studentFiles = res.data.filter(file => 
        studentClassIds.includes(file.classId?._id)
      );
      
      console.log('Student files:', studentFiles);
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
        "http://localhost:5000/api/announcements",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnnouncements(res.data);
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchClasses();
    fetchFiles();
    fetchAnnouncements();
  }, [fetchClasses, fetchFiles, fetchAnnouncements]);

  return (
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


        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#20205c', marginBottom: '2rem', textAlign: 'center' }}>My Sessions</h2>

        {myClasses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.1)' }}>
            <p style={{ fontSize: '1.2rem', color: '#666' }}>No sessions enrolled yet.</p>
          </div>
        ) : (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem', marginBottom: '1rem' }}>
              {(showAllClasses ? myClasses : myClasses.slice(0, 4)).map((cls) => (
              <div key={cls._id} style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              onClick={() => setSelectedClass(cls)}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#20205c', marginBottom: '0.5rem' }}>{cls.name}</h3>
                <p style={{ color: '#666', marginBottom: '0.5rem' }}><strong>Subject:</strong> {cls.subject}</p>
                <p style={{ color: '#666', marginBottom: '0.5rem' }}><strong>Schedule:</strong> {cls.schedule}</p>
                <p style={{ color: '#666' }}><strong>Tutor:</strong> {cls.tutor?.name || "N/A"}</p>
                <p style={{ fontSize: '0.9rem', color: '#2563eb', marginTop: '1rem', textAlign: 'center' }}>Click for details</p>
              </div>
              ))}
            </div>
            
            {myClasses.length > 4 && (
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
                  {showAllClasses ? 'Show Less' : `Show All (${myClasses.length} sessions)`}
                </button>
              </div>
            )}
          </div>
        )}

        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#20205c', marginBottom: '2rem', textAlign: 'center' }}>Study Materials</h2>
        
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.1)' }}>
          {files.length === 0 ? (
            <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#666' }}>No study materials available for your sessions yet.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              {files.map((file) => (
                <div key={file._id} style={{
                  padding: '1rem',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9ff'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                  <a href={`http://localhost:5000/${file.url}`} target="_blank" rel="noopener noreferrer" 
                     style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '600' }}>
                    📄 {file.title}
                  </a>
                  <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>Session: {file.classId?.name}</p>
                  <p style={{ fontSize: '0.8rem', color: '#999' }}>Uploaded by: {file.uploadedBy?.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Class Details Modal */}
        {selectedClass && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }} onClick={() => setSelectedClass(null)}>
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '12px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto'
            }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#20205c', margin: 0 }}>{selectedClass.name}</h3>
                <button onClick={() => setSelectedClass(null)} style={{ 
                  background: '#f3f4f6', 
                  border: 'none', 
                  fontSize: '1.5rem', 
                  cursor: 'pointer',
                  borderRadius: '50%',
                  width: '2rem',
                  height: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#ef4444'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#f3f4f6'}>×</button>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ marginBottom: '0.5rem' }}><strong>Subject:</strong> {selectedClass.subject}</p>
                <p style={{ marginBottom: '0.5rem' }}><strong>Schedule:</strong> {selectedClass.schedule}</p>
                <p style={{ marginBottom: '1rem' }}><strong>Tutor:</strong> {selectedClass.tutor?.name || "N/A"}</p>
              </div>
              
              {/* Resources */}
              {selectedClass.resources && selectedClass.resources.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#20205c', marginBottom: '0.5rem' }}>📚 Resources</h4>
                  {selectedClass.resources.map((resource, index) => (
                    <div key={index} style={{ marginBottom: '0.5rem' }}>
                      <a href={resource.link} target="_blank" rel="noopener noreferrer" 
                         style={{ color: '#2563eb', textDecoration: 'none', display: 'block', padding: '0.5rem', backgroundColor: '#f8f9ff', borderRadius: '4px' }}>
                        🔗 Resource Link {index + 1}
                      </a>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Announcements */}
              {selectedClass.announcements && selectedClass.announcements.length > 0 && (
                <div>
                  <h4 style={{ color: '#20205c', marginBottom: '0.5rem' }}>📢 Announcements</h4>
                  {selectedClass.announcements.slice().reverse().map((announcement, index) => (
                    <div key={index} style={{
                      backgroundColor: '#f0f9ff',
                      padding: '1rem',
                      borderRadius: '6px',
                      borderLeft: '4px solid #2563eb',
                      marginBottom: '0.5rem'
                    }}>
                      <p style={{ margin: 0, color: '#666' }}>{announcement.text}</p>
                      <small style={{ color: '#999' }}>{new Date(announcement.postedAt).toLocaleDateString()}</small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
    </div>
  );
};

export default StudentDashboard;
