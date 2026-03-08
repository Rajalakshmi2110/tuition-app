import React, { useEffect, useState, useCallback } from "react";
import api from '../services/api';
import { jwtDecode } from "jwt-decode";
import FileList from "../components/FileList";
import { useToast } from '../components/Toast';

const TutorFiles = () => {
  const [files, setFiles] = useState([]);
  const [classes, setClasses] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    file: null,
    selectedClass: '',
    title: ''
  });
  const [uploading, setUploading] = useState(false);
  const toast = useToast();

  const fetchFiles = useCallback(async () => {
    try {
      const decoded = jwtDecode(localStorage.getItem('token'));
      const userId = decoded.id || decoded._id;

      const res = await api.get(`/files`);

      const tutorFiles = res.data.filter(file => file.uploadedBy?._id === userId);
      setFiles(tutorFiles);
    } catch (err) {
    }
  }, []);

  const fetchClasses = useCallback(async () => {
    try {
      const decoded = jwtDecode(localStorage.getItem('token'));
      const userId = decoded.id || decoded._id;

      const res = await api.get(`/classes/tutor/${userId}`);
      setClasses(res.data);
    } catch (err) {
    }
  }, []);

  useEffect(() => {
    fetchFiles();
    fetchClasses();
  }, [fetchFiles, fetchClasses]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadData.file || !uploadData.selectedClass) {
      toast.error("Please select a file and a class.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", uploadData.file);
    formData.append("classId", uploadData.selectedClass);
    if (uploadData.title) formData.append("title", uploadData.title);

    try {
      await api.post(`/files`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("File uploaded successfully!");
      setUploadData({ file: null, selectedClass: '', title: '' });
      setShowUploadModal(false);
      fetchFiles();
    } catch (err) {
      toast.error("File upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (id) => setFiles(files.filter((f) => f._id !== id));

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    fontSize: '0.95rem',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    outline: 'none',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box'
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#0f172a',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
            File Management
          </h2>
          <p style={{ color: '#64748b', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
            Upload and manage study materials for your sessions
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          style={{
            padding: '0.875rem 1.5rem',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.95rem',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          Upload New File
        </button>
      </div>

      {/* Files Container */}
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '16px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0'
      }}>
        {files.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #10b98120 0%, #05966920 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h3 style={{ color: '#0f172a', fontWeight: 700, marginBottom: '0.5rem' }}>
              No Files Uploaded
            </h3>
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
              Click "Upload New File" to add your first study material
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
              <h3 style={{ margin: '0 0 0.25rem 0', color: '#166534', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
                My Uploaded Files ({files.length})
              </h3>
              <p style={{ margin: 0, color: '#16a34a', fontSize: '0.85rem' }}>
                Manage your study materials and resources
              </p>
            </div>
            <FileList files={files} onDelete={handleDelete} />
          </>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div style={{
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
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '20px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '85vh',
            overflow: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ margin: 0, color: '#0f172a', fontWeight: 700, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                Upload Study Material
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: 600,
                  color: '#374151',
                  fontSize: '0.9rem'
                }}>
                  Select Session *
                </label>
                <select
                  value={uploadData.selectedClass}
                  onChange={(e) => setUploadData({ ...uploadData, selectedClass: e.target.value })}
                  required
                  style={{
                    ...inputStyle,
                    background: 'white'
                  }}
                >
                  <option value="">Choose a session...</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name} - {cls.subject}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: 600,
                  color: '#374151',
                  fontSize: '0.9rem'
                }}>
                  File Title (Optional)
                </label>
                <input
                  type="text"
                  value={uploadData.title}
                  onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                  placeholder="Enter a descriptive title..."
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: 600,
                  color: '#374151',
                  fontSize: '0.9rem'
                }}>
                  Choose File *
                </label>
                <input
                  type="file"
                  onChange={(e) => setUploadData({ ...uploadData, file: e.target.files[0] })}
                  required
                  style={{
                    ...inputStyle,
                    padding: '0.5rem',
                    background: '#f8fafc'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  style={{
                    flex: 1,
                    padding: '0.875rem',
                    borderRadius: '10px',
                    border: '2px solid #e2e8f0',
                    background: 'white',
                    color: '#64748b',
                    cursor: 'pointer',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  style={{
                    flex: 1,
                    padding: '0.875rem',
                    borderRadius: '10px',
                    border: 'none',
                    background: uploading ? '#94a3b8' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                    boxShadow: uploading ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  {uploading ? 'Uploading...' : 'Upload File'}
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
