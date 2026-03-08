import React, { useEffect, useState } from 'react';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';
import { useToast } from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminFeedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const res = await api.get(`/admin/feedback`);
      setFeedback(res.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const approveFeedback = async (id) => {
    try {
      await api.patch(`/admin/feedback/${id}/approve`, {});
      toast.success('Feedback approved successfully!');
      fetchFeedback();
    } catch (err) {
      toast.error('Error approving feedback');
    }
  };

  const deleteFeedback = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;
    try {
      await api.delete(`/admin/feedback/${id}`);
      toast.success('Feedback deleted successfully!');
      fetchFeedback();
    } catch (err) {
      toast.error('Error deleting feedback');
    }
  };

  if (loading) return (
    <AdminLayout>
      <LoadingSpinner message="Loading feedback..." fullPage />
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
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
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            Manage Feedback
          </h1>
          <p style={{ color: '#64748b', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
            Review and approve student testimonials
          </p>
        </div>

        {feedback.length === 0 ? (
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
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h3 style={{ color: '#0f172a', fontWeight: 700, marginBottom: '0.5rem' }}>
              No Feedback Yet
            </h3>
            <p style={{ color: '#64748b' }}>Feedback from students will appear here.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {feedback.map((item) => (
              <div
                key={item._id}
                style={{
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '16px',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                  border: `2px solid ${item.approved ? '#10b981' : '#fbbf24'}`,
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '1rem',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.2rem', fontWeight: 700 }}>
                      {item.name}
                    </h3>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{
                        backgroundColor: '#dbeafe',
                        color: '#1e40af',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: 500
                      }}>
                        {item.role}
                      </span>
                      <div style={{ display: 'flex' }}>
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            style={{
                              color: i < item.rating ? '#fbbf24' : '#e2e8f0',
                              fontSize: '1.1rem'
                            }}
                          >
                            ★
                          </span>
                        ))}
                        <span style={{ fontSize: '0.85rem', color: '#64748b', marginLeft: '0.5rem' }}>
                          ({item.rating}/5)
                        </span>
                      </div>
                      <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <span style={{
                    backgroundColor: item.approved ? '#dcfce7' : '#fef3c7',
                    color: item.approved ? '#166534' : '#92400e',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}>
                    {item.approved ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    )}
                    {item.approved ? 'Approved' : 'Pending'}
                  </span>
                </div>

                <div style={{
                  backgroundColor: '#f8fafc',
                  padding: '1rem',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  marginBottom: '1rem'
                }}>
                  <p style={{
                    color: '#374151',
                    lineHeight: 1.6,
                    margin: 0,
                    fontStyle: 'italic'
                  }}>
                    "{item.message?.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')}"
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {!item.approved && (
                    <button
                      onClick={() => approveFeedback(item._id)}
                      style={{
                        background: 'transparent',
                        color: '#10b981',
                        padding: '0.6rem 1.25rem',
                        border: '2px solid #10b981',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#10b981';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#10b981';
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => deleteFeedback(item._id)}
                    style={{
                      background: 'transparent',
                      color: '#94a3b8',
                      padding: '0.6rem 1.25rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#fef2f2';
                      e.currentTarget.style.borderColor = '#fecaca';
                      e.currentTarget.style.color = '#dc2626';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.color = '#94a3b8';
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                    Delete
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
