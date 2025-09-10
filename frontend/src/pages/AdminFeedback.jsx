import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';

const AdminFeedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('https://tuitionapp-yq06.onrender.com/api/admin/feedback', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedback(res.data);
    } catch (err) {
      console.error('Error fetching feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  const approveFeedback = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch(`https://tuitionapp-yq06.onrender.com/api/admin/feedback/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFeedback();
    } catch (err) {
      console.error('Error approving feedback:', err);
    }
  };

  const deleteFeedback = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;
    
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`https://tuitionapp-yq06.onrender.com/api/admin/feedback/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFeedback();
    } catch (err) {
      console.error('Error deleting feedback:', err);
    }
  };

  if (loading) return (
    <AdminLayout>
      <div style={{ textAlign: 'center', padding: '2rem' }}>Loading feedback...</div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#20205c', marginBottom: '2rem' }}>
          Manage Feedback
        </h1>

        {feedback.length === 0 ? (
          <div style={{ 
            backgroundColor: 'white', 
            padding: '3rem', 
            borderRadius: '16px', 
            textAlign: 'center',
            boxShadow: '0 6px 20px rgba(0,0,0,0.1)'
          }}>
            <p style={{ color: '#666', fontSize: '1.2rem' }}>No feedback submitted yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {feedback.map((item) => (
              <div key={item._id} style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '16px',
                boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                border: item.approved ? '2px solid #10b981' : '2px solid #f59e0b'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#20205c', fontSize: '1.3rem' }}>{item.name}</h3>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                      <span style={{ 
                        backgroundColor: '#dbeafe', 
                        color: '#1e40af', 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '20px', 
                        fontSize: '0.9rem',
                        fontWeight: '500'
                      }}>
                        {item.role}
                      </span>
                      <div style={{ display: 'flex' }}>
                        {[...Array(5)].map((_, i) => (
                          <span key={i} style={{ 
                            color: i < item.rating ? '#f59e0b' : 'transparent',
                            WebkitTextStroke: i < item.rating ? 'none' : '1px #d1d5db',
                            textStroke: i < item.rating ? 'none' : '1px #d1d5db',
                            fontSize: '1.2rem'
                          }}>★</span>
                        ))}
                      </div>
                      <span style={{ fontSize: '0.9rem', color: '#6b7280', marginLeft: '0.5rem' }}>({item.rating}/5)</span>
                      <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div style={{ 
                    backgroundColor: item.approved ? '#dcfce7' : '#fef3c7',
                    color: item.approved ? '#166534' : '#92400e',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}>
                    {item.approved ? '✅ Approved' : '⏳ Pending'}
                  </div>
                </div>

                <p style={{ 
                  color: '#374151', 
                  lineHeight: '1.6', 
                  marginBottom: '1.5rem',
                  fontStyle: 'italic',
                  backgroundColor: '#f8fafc',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  "{item.message}"
                </p>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  {!item.approved && (
                    <button
                      onClick={() => approveFeedback(item._id)}
                      style={{
                        backgroundColor: '#10b981',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
                    >
                      ✅ Approve
                    </button>
                  )}
                  <button
                    onClick={() => deleteFeedback(item._id)}
                    style={{
                      backgroundColor: '#ef4444',
                      color: 'white',
                      padding: '0.75rem 1.5rem',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminFeedback;