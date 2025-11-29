import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';
import { useToast } from '../components/Toast';

const AdminGallery = () => {
  const [images, setImages] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'classroom'
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('https://tuitionapp-yq06.onrender.com/api/gallery', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setImages(res.data);
    } catch (err) {
      console.error('Error fetching images:', err);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    const token = localStorage.getItem('token');
    const uploadData = new FormData();
    uploadData.append('image', selectedFile);
    uploadData.append('title', formData.title);
    uploadData.append('description', formData.description);
    uploadData.append('category', formData.category);

    try {
      await axios.post('https://tuitionapp-yq06.onrender.com/api/gallery', uploadData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });
      toast.success('Image uploaded successfully!');
      setShowUploadForm(false);
      setFormData({ title: '', description: '', category: 'classroom' });
      setSelectedFile(null);
      fetchImages();
    } catch (err) {
      toast.error('Failed to upload image');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    const token = localStorage.getItem('token');
    try {
      await axios.delete(`https://tuitionapp-yq06.onrender.com/api/gallery/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Image deleted successfully!');
      fetchImages();
    } catch (err) {
      toast.error('Error deleting image');
      console.error('Error deleting image:', err);
    }
  };

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

  const categoryColors = {
    classroom: { bg: '#dbeafe', color: '#1e40af' },
    students: { bg: '#dcfce7', color: '#166534' },
    events: { bg: '#fef3c7', color: '#92400e' },
    achievements: { bg: '#f3e8ff', color: '#7c3aed' }
  };

  return (
    <AdminLayout>
      <div>
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
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#0f172a',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              Gallery Management
            </h1>
            <p style={{ color: '#64748b', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
              Manage photos for your tuition center
            </p>
          </div>
          <button
            onClick={() => setShowUploadForm(true)}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              padding: '0.875rem 1.5rem',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.95rem',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
            Upload Image
          </button>
        </div>

        {images.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            padding: '4rem 2rem',
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0'
          }}>
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
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
            </div>
            <h3 style={{ color: '#0f172a', fontWeight: 700, marginBottom: '0.5rem' }}>
              No Images Yet
            </h3>
            <p style={{ color: '#64748b' }}>Upload your first image to get started.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {images.map((image) => {
              const catStyle = categoryColors[image.category] || categoryColors.classroom;
              return (
                <div
                  key={image._id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.05)';
                  }}
                >
                  <div style={{
                    width: '100%',
                    height: '200px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <img
                      src={`https://tuitionapp-yq06.onrender.com${image.imageUrl}`}
                      alt={image.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center'
                      }}
                    />
                  </div>
                  <div style={{ padding: '1.25rem' }}>
                    <h3 style={{
                      margin: '0 0 0.5rem 0',
                      color: '#0f172a',
                      fontWeight: 700,
                      fontSize: '1.1rem'
                    }}>
                      {image.title}
                    </h3>
                    {image.description && (
                      <p style={{
                        margin: '0 0 1rem 0',
                        color: '#64748b',
                        fontSize: '0.9rem',
                        lineHeight: 1.5
                      }}>
                        {image.description}
                      </p>
                    )}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{
                        backgroundColor: catStyle.bg,
                        color: catStyle.color,
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        textTransform: 'capitalize'
                      }}>
                        {image.category}
                      </span>
                      <button
                        onClick={() => deleteImage(image._id)}
                        style={{
                          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                          color: 'white',
                          padding: '0.5rem 1rem',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          fontWeight: 500
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Upload Modal */}
        {showUploadForm && (
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
              width: '500px',
              maxWidth: '100%',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{ margin: 0, color: '#0f172a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                    <circle cx="12" cy="13" r="4"></circle>
                  </svg>
                  Upload New Image
                </h3>
                <button
                  onClick={() => setShowUploadForm(false)}
                  style={{
                    background: '#f1f5f9',
                    border: 'none',
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    color: '#64748b'
                  }}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>
                    Title *
                  </label>
                  <input
                    type="text"
                    placeholder="Image Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>
                    Description
                  </label>
                  <textarea
                    placeholder="Description (optional)"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ ...inputStyle, background: 'white' }}
                  >
                    <option value="classroom">Classroom</option>
                    <option value="students">Students</option>
                    <option value="events">Events</option>
                    <option value="achievements">Achievements</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>
                    Image File *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    required
                    style={{ ...inputStyle, padding: '0.5rem', background: '#f8fafc' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowUploadForm(false)}
                    style={{
                      flex: 1,
                      padding: '0.875rem',
                      borderRadius: '10px',
                      border: '2px solid #e2e8f0',
                      background: 'white',
                      color: '#64748b',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
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
                    {uploading ? 'Uploading...' : (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        Upload Image
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminGallery;
