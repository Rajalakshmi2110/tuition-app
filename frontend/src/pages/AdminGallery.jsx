import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';

const AdminGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'classroom'
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

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
    } finally {
      setLoading(false);
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
      setShowUploadForm(false);
      setFormData({ title: '', description: '', category: 'classroom' });
      setSelectedFile(null);
      fetchImages();
    } catch (err) {
      console.error('Failed to upload image:', err);
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
      fetchImages();
    } catch (err) {
      console.error('Error deleting image:', err);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '16px', boxShadow: '0 6px 20px rgba(0,0,0,0.1)' }}>
            <div style={{ 
              width: '50px', height: '50px', border: '4px solid #f3f4f6', 
              borderTop: '4px solid #3b82f6', borderRadius: '50%', 
              animation: 'spin 1s linear infinite', margin: '0 auto 1.5rem'
            }}></div>
            <h3 style={{ fontSize: '1.5rem', color: '#20205c', marginBottom: '0.5rem' }}>Loading Gallery</h3>
            <p style={{ color: '#666', margin: 0 }}>Please wait while we fetch gallery images...</p>
          </div>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#20205c' }}>Gallery Management</h1>
          <button
            onClick={() => setShowUploadForm(true)}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '1rem 2rem',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1rem'
            }}
          >
            📸 Upload Image
          </button>
        </div>

        {images.length === 0 ? (
          <div style={{ 
            backgroundColor: 'white', 
            padding: '3rem', 
            borderRadius: '16px', 
            textAlign: 'center',
            boxShadow: '0 6px 20px rgba(0,0,0,0.1)'
          }}>
            <p style={{ color: '#666', fontSize: '1.2rem' }}>No images uploaded yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {images.map((image) => (
              <div key={image._id} style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 6px 20px rgba(0,0,0,0.1)'
              }}>
                <img 
                  src={`https://tuitionapp-yq06.onrender.com${image.imageUrl}`}
                  alt={image.title}
                  style={{ 
                    width: '100%', 
                    height: '220px', 
                    objectFit: 'cover',
                    objectPosition: 'center',
                    display: 'block'
                  }}
                />
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#20205c' }}>{image.title}</h3>
                  <p style={{ margin: '0 0 1rem 0', color: '#666', fontSize: '0.9rem' }}>{image.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ 
                      backgroundColor: '#e8f2ff', 
                      color: '#2563eb', 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '20px', 
                      fontSize: '0.8rem',
                      fontWeight: '500'
                    }}>
                      {image.category}
                    </span>
                    <button
                      onClick={() => deleteImage(image._id)}
                      style={{
                        backgroundColor: '#ef4444',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Form Modal */}
        {showUploadForm && (
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
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '16px',
              width: '500px',
              maxWidth: '90%'
            }}>
              <h3 style={{ marginBottom: '1.5rem', color: '#1e293b' }}>Upload New Image</h3>
              
              <form onSubmit={handleUpload}>
                <input
                  type="text"
                  placeholder="Image Title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                />
                
                <textarea
                  placeholder="Description (optional)"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                />
                
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                >
                  <option value="classroom">Classroom</option>
                  <option value="students">Students</option>
                  <option value="events">Events</option>
                  <option value="achievements">Achievements</option>
                </select>
                
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  required
                  style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                />
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    type="submit" 
                    disabled={uploading}
                    style={{ 
                      flex: 1, 
                      padding: '0.75rem', 
                      backgroundColor: '#2563eb', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '8px', 
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    {uploading ? 'Uploading...' : '📸 Upload Image'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowUploadForm(false)}
                    style={{ 
                      flex: 1, 
                      padding: '0.75rem', 
                      backgroundColor: '#6b7280', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '8px', 
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Cancel
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