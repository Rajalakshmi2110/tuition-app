import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import fileUrl from '../config/fileUrl';
import AdminLayout from '../components/AdminLayout';
import { useToast } from '../components/Toast';

const AdminPayments = () => {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [verificationData, setVerificationData] = useState({
    status: '',
    rejectionReason: ''
  });
  const toast = useToast();

  const fetchPendingPayments = useCallback(async () => {
    try {
      const response = await api.get(`/payments/pending`);
      setPendingPayments(response.data);
    } catch (error) {
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await api.get(`/payments/stats`);
      setStats(response.data);
    } catch (error) {
    }
  }, []);

  useEffect(() => {
    fetchPendingPayments();
    fetchStats();
  }, [fetchPendingPayments, fetchStats]);

  const handleVerifyPayment = async (paymentId, status, rejectionReason = '') => {
    setLoading(true);
    try {
      await api.patch(`/payments/verify/${paymentId}`, {
        status,
        rejectionReason
      });

      toast.success(`Payment ${status} successfully!`);
      fetchPendingPayments();
      fetchStats();
      setSelectedPayment(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error verifying payment');
    } finally {
      setLoading(false);
    }
  };

  const sendReminders = async () => {
    setLoading(true);
    try {
      const response = await api.post(`/payments/send-reminders`, {});
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error sending reminders');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      value: stats.totalStudents || 0, 
      label: 'Total Students', 
      color: '#3b82f6',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    },
    { 
      value: stats.paidStudents || 0, 
      label: 'Paid Students', 
      color: '#10b981',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      )
    },
    { 
      value: stats.pendingStudents || 0, 
      label: 'Pending Verification', 
      color: '#fbbf24',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      )
    },
    { 
      value: stats.unpaidStudents || 0, 
      label: 'Unpaid Students', 
      color: '#ef4444',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
      )
    },
    { 
      value: `₹${stats.totalRevenue || 0}`, 
      label: 'Total Revenue', 
      color: '#10b981',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      )
    }
  ];

  return (
    <AdminLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
            Payment Management
          </h2>
          <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
            Verify payments and track revenue
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {statCards.map((stat, index) => (
            <div
              key={index}
              style={{
                background: 'var(--bg-primary)',
                padding: '1.25rem',
                borderRadius: '16px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                border: '1px solid var(--border-light)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.borderColor = stat.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.05)';
                e.currentTarget.style.borderColor = 'var(--border-light)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '0 0 0.25rem 0', fontWeight: 500 }}>
                    {stat.label}
                  </p>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    {stat.value}
                  </h3>
                </div>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: `${stat.color}15`,
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <button
            onClick={sendReminders}
            disabled={loading}
            style={{
              padding: '0.875rem 2rem',
              background: loading ? '#94a3b8' : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              color: loading ? 'white' : '#0f172a',
              border: 'none',
              borderRadius: '10px',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: loading ? 'none' : '0 4px 15px rgba(251, 191, 36, 0.4)'
            }}
          >
            {loading ? 'Sending...' : 'Send Payment Reminders'}
          </button>
        </div>

        {/* Pending Payments */}
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          padding: '1.5rem',
          borderRadius: '16px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
          border: '1px solid var(--border-light)'
        }}>
          <h3 style={{
            color: 'var(--text-primary)',
            marginBottom: '1.5rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            Pending Payments <span style={{ background: '#fef3c7', color: '#92400e', fontSize: '0.8rem', padding: '0.15rem 0.6rem', borderRadius: '12px', fontWeight: 600 }}>{pendingPayments.length}</span>
          </h3>

          {pendingPayments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #10b98120 0%, #05966920 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: '0.5rem' }}>
                All Caught Up!
              </h3>
              <p style={{ color: 'var(--text-muted)' }}>No pending payments to verify.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {pendingPayments.map((payment) => (
                <div
                  key={payment._id}
                  style={{
                    padding: '1.25rem',
                    border: '2px solid #fbbf24',
                    borderRadius: '12px',
                    backgroundColor: '#fffbeb'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-primary)', fontWeight: 700 }}>
                        {payment.studentId.name} - {payment.month}
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Class: {payment.studentId.className} | {payment.studentId.email}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f59e0b' }}>
                        ₹{payment.amount}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(payment.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '1rem',
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    marginBottom: '1rem',
                    flexWrap: 'wrap'
                  }}>
                    {payment.transactionId && (
                      <span><strong>Transaction ID:</strong> {payment.transactionId}</span>
                    )}
                    {payment.notes && (
                      <span><strong>Notes:</strong> {payment.notes}</span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <a
                      href={fileUrl(payment.paymentScreenshot)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                      View Screenshot
                    </a>

                    <button
                      onClick={() => handleVerifyPayment(payment._id, 'verified')}
                      disabled={loading}
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 500
                      }}
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => setSelectedPayment(payment)}
                      disabled={loading}
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 500
                      }}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rejection Modal */}
        {selectedPayment && (
          <div
            style={{
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
            }}
            onClick={() => setSelectedPayment(null)}
          >
            <div
              style={{
                backgroundColor: 'var(--bg-primary)',
                padding: '2rem',
                borderRadius: '20px',
                maxWidth: '500px',
                width: '100%',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)', fontWeight: 700 }}>
                Reject Payment
              </h3>
              <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
                Student: <strong>{selectedPayment.studentId.name}</strong> - {selectedPayment.month}
              </p>

              <textarea
                placeholder="Enter rejection reason..."
                value={verificationData.rejectionReason}
                onChange={(e) => setVerificationData(prev => ({ ...prev, rejectionReason: e.target.value }))}
                rows="4"
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  borderRadius: '10px',
                  border: '2px solid var(--border-light)',
                  marginBottom: '1rem',
                  fontFamily: 'inherit',
                  fontSize: '0.95rem',
                  resize: 'vertical',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setSelectedPayment(null)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-muted)',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleVerifyPayment(selectedPayment._id, 'rejected', verificationData.rejectionReason)}
                  disabled={!verificationData.rejectionReason.trim()}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: !verificationData.rejectionReason.trim()
                      ? '#94a3b8'
                      : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: !verificationData.rejectionReason.trim() ? 'not-allowed' : 'pointer',
                    fontWeight: 600
                  }}
                >
                  Reject Payment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPayments;
