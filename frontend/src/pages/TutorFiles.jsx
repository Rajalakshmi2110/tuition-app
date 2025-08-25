import React, { useEffect, useState } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import FileList from "../components/FileList";

const TutorFiles = () => {
  const [files, setFiles] = useState([]);
  const [classes, setClasses] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    file: null,
    selectedClass: '',
    title: ''
  });
  const [message, setMessage] = useState('');
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchFiles();
    fetchClasses();
  }, []);

  const fetchFiles = async () => {
    try {
      const decoded = jwtDecode(token);
      const userId = decoded.id || decoded._id;
      
      const res = await axios.get("http://localhost:5000/api/files", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const tutorFiles = res.data.filter(file => file.uploadedBy?._id === userId);
      setFiles(tutorFiles);
    } catch (err) {
      console.error("Failed to fetch files", err);
    }
  };

  const fetchClasses = async () => {
    try {
      const decoded = jwtDecode(token);
      const userId = decoded.id || decoded._id;
      
      const res = await axios.get(`http://localhost:5000/api/classes/tutor/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(res.data);
    } catch (err) {
      console.error("Failed to load classes", err);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadData.file || !uploadData.selectedClass) {
      setMessage("Please select a file and a class.");
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadData.file);
    formData.append("classId", uploadData.selectedClass);
    if (uploadData.title) formData.append("title", uploadData.title);

    try {
      await axios.post("http://localhost:5000/api/files", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("File uploaded successfully!");
      setUploadData({ file: null, selectedClass: '', title: '' });
      setShowUploadModal(false);
      fetchFiles(); // Refresh file list
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage("File upload failed.");
      console.error(err);
    }
  };

  const handleDelete = (id) => setFiles(files.filter((f) => f._id !== id));

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#20205c', margin: 0 }}>
          File Management
        </h2>
        <button 
          onClick={() => setShowUploadModal(true)}
          style={{
            background: '#3b82f6', color: 'white', padding: '12px 24px',
            border: 'none', borderRadius: '8px', cursor: 'pointer',
            fontSize: '16px', fontWeight: '600', transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
        >
          📁 Upload New File
        </button>
      </div>

      {message && (
        <div style={{
          padding: '12px 16px', borderRadius: '8px', marginBottom: '1rem',
          backgroundColor: message.includes('failed') ? '#fef2f2' : '#f0fdf4',
          border: `1px solid ${message.includes('failed') ? '#fecaca' : '#bbf7d0'}`,
          color: message.includes('failed') ? '#dc2626' : '#16a34a'
        }}>
          {message}
        </div>
      )}
      
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.1)' }}>
        {files.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📁</div>
            <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No files uploaded yet</p>
            <p>Click "Upload New File" to add your first study material</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>My Uploaded Files ({files.length})</h3>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>Manage your study materials and resources</p>
            </div>
            <FileList files={files} onDelete={handleDelete} />
          </>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white', padding: '2rem', borderRadius: '12px',
            maxWidth: '500px', width: '90%', maxHeight: '80vh', overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: '#20205c', fontSize: '1.5rem' }}>Upload Study Material</h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                style={{
                  background: '#f3f4f6', border: 'none', fontSize: '1.5rem',
                  cursor: 'pointer', borderRadius: '50%', width: '2rem', height: '2rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                  Select Class *
                </label>
                <select
                  value={uploadData.selectedClass}
                  onChange={(e) => setUploadData({...uploadData, selectedClass: e.target.value})}
                  required
                  style={{
                    width: '100%', padding: '12px', borderRadius: '8px',
                    border: '1px solid #d1d5db', fontSize: '14px'
                  }}
                >
                  <option value="">Choose a class...</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name} - {cls.subject}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                  File Title (Optional)
                </label>
                <input
                  type="text"
                  value={uploadData.title}
                  onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
                  placeholder="Enter a descriptive title..."
                  style={{
                    width: '100%', padding: '12px', borderRadius: '8px',
                    border: '1px solid #d1d5db', fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                  Choose File *
                </label>
                <input
                  type="file"
                  onChange={(e) => setUploadData({...uploadData, file: e.target.files[0]})}
                  required
                  style={{
                    width: '100%', padding: '12px', borderRadius: '8px',
                    border: '1px solid #d1d5db', fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  style={{
                    flex: 1, padding: '12px', borderRadius: '8px',
                    border: '1px solid #d1d5db', background: 'white',
                    color: '#374151', cursor: 'pointer', fontWeight: '600'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1, padding: '12px', borderRadius: '8px',
                    border: 'none', background: '#3b82f6',
                    color: 'white', cursor: 'pointer', fontWeight: '600'
                  }}
                >
                  Upload File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorFiles;