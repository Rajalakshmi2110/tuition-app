import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';

const AdminPayments = () => {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [verificationData, setVerificationData] = useState({
    status: '',
    rejectionReason: ''
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchPendingPayments();
    fetchStats();
  }, []);

  const fetchPendingPayments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/payments/pending', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingPayments(response.data);
    } catch (error) {
      console.error('Error fetching pending payments:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/payments/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleVerifyPayment = async (paymentId, status, rejectionReason = '') => {
    setLoading(true);
    try {
      await axios.patch(`http://localhost:5000/api/payments/verify/${paymentId}`, {
        status,
        rejectionReason
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert(`Payment ${status} successfully!`);
      fetchPendingPayments();
      fetchStats();
      setSelectedPayment(null);
    } catch (error) {
      alert(error.response?.data?.message || 'Error verifying payment');
    } finally {
      setLoading(false);
    }
  };

  const sendReminders = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/payments/send-reminders', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || 'Error sending reminders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      verified: '#10b981',
      rejected: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  return (
    <AdminLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#20205c', marginBottom: '2rem', textAlign: 'center' }}>
        💰 Payment Management
      </h2>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</div>
          <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6', margin: '0' }}>{stats.totalStudents || 0}</h3>
          <p style={{ color: '#666', margin: '0.25rem 0 0 0' }}>Total Students</p>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
          <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', margin: '0' }}>{stats.paidStudents || 0}</h3>
          <p style={{ color: '#666', margin: '0.25rem 0 0 0' }}>Paid Students</p>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
          <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b', margin: '0' }}>{stats.pendingStudents || 0}</h3>
          <p style={{ color: '#666', margin: '0.25rem 0 0 0' }}>Pending Verification</p>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>❌</div>
          <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef4444', margin: '0' }}>{stats.unpaidStudents || 0}</h3>
          <p style={{ color: '#666', margin: '0.25rem 0 0 0' }}>Unpaid Students</p>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</div>
          <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', margin: '0' }}>₹{stats.totalRevenue || 0}</h3>
          <p style={{ color: '#666', margin: '0.25rem 0 0 0' }}>Total Revenue</p>
        </div>
      </div>

      {/* Actions */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <button
          onClick={sendReminders}
          disabled={loading}
          style={{
            padding: '1rem 2rem',
            backgroundColor: loading ? '#9ca3af' : '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          {loading ? 'Sending...' : '📧 Send Payment Reminders'}
        </button>
      </div>

      {/* Pending Payments */}
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#20205c', marginBottom: '1.5rem' }}>⏳ Pending Payments ({pendingPayments.length})</h3>
        
        {pendingPayments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <p style={{ fontSize: '1.2rem' }}>No pending payments!</p>
            <p>All payments have been processed.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {pendingPayments.map((payment) => (
              <div key={payment._id} style={{
                padding: '1.5rem',
                border: '2px solid #f59e0b',
                borderRadius: '8px',
                backgroundColor: '#fffbeb'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#20205c' }}>
                      {payment.studentId.name} - {payment.month}
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                      Class: {payment.studentId.className} | Email: {payment.studentId.email}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#f59e0b' }}>₹{payment.amount}</div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>
                      Submitted: {new Date(payment.submittedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
                  {payment.transactionId && <div><strong>Transaction ID:</strong> {payment.transactionId}</div>}
                  {payment.notes && <div><strong>Notes:</strong> {payment.notes}</div>}
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <a 
                    href={`http://localhost:5000${payment.paymentScreenshot}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '6px',
                      fontSize: '0.9rem'
                    }}
                  >
                    📷 View Screenshot
                  </a>
                  
                  <button
                    onClick={() => handleVerifyPayment(payment._id, 'verified')}
                    disabled={loading}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    ✅ Approve
                  </button>
                  
                  <button
                    onClick={() => setSelectedPayment(payment)}
                    disabled={loading}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    ❌ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {selectedPayment && (
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
        }} onClick={() => setSelectedPayment(null)}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '90%'
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '1rem', color: '#20205c' }}>Reject Payment</h3>
            <p style={{ marginBottom: '1rem', color: '#666' }}>
              Student: {selectedPayment.studentId.name} - {selectedPayment.month}
            </p>
            
            <textarea
              placeholder="Enter rejection reason..."
              value={verificationData.rejectionReason}
              onChange={(e) => setVerificationData(prev => ({ ...prev, rejectionReason: e.target.value }))}
              rows="4"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                marginBottom: '1rem'
              }}
            />
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setSelectedPayment(null)}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleVerifyPayment(selectedPayment._id, 'rejected', verificationData.rejectionReason)}
                disabled={!verificationData.rejectionReason.trim()}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  opacity: !verificationData.rejectionReason.trim() ? 0.5 : 1
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