import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';


const StudentPayments = () => {
  const [qrCode, setQrCode] = useState('');
  const [payments, setPayments] = useState([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    month: new Date().toISOString().slice(0, 7), // Current month
    transactionId: '',
    notes: '',
    paymentScreenshot: null
  });
  const [resubmitPayment, setResubmitPayment] = useState(null);

  const token = localStorage.getItem('token');

  const fetchQRCode = useCallback(async () => {
    try {
      const response = await axios.get('https://tuitionapp-yq06.onrender.com/api/payments/qr-code', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQrCode(response.data.qrCodeUrl);
    } catch (error) {
      console.error('Error fetching QR code:', error);
    }
  }, [token]);

  const fetchPayments = useCallback(async () => {
    try {
      const response = await axios.get('https://tuitionapp-yq06.onrender.com/api/payments/my-payments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  }, [token]);

  useEffect(() => {
    fetchQRCode();
    fetchPayments();
  }, [fetchQRCode, fetchPayments]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, paymentScreenshot: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.paymentScreenshot && !resubmitPayment) {
      alert('Please upload payment screenshot');
      return;
    }

    setLoading(true);
    try {
      const submitData = new FormData();
      submitData.append('amount', formData.amount);
      submitData.append('month', formData.month);
      submitData.append('transactionId', formData.transactionId);
      submitData.append('notes', formData.notes);
      if (formData.paymentScreenshot) {
        submitData.append('paymentScreenshot', formData.paymentScreenshot);
      }

      const url = resubmitPayment 
        ? `https://tuitionapp-yq06.onrender.com/api/payments/resubmit/${resubmitPayment._id}`
        : 'https://tuitionapp-yq06.onrender.com/api/payments/submit';
      
      const method = resubmitPayment ? 'patch' : 'post';

      await axios[method](url, submitData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      alert(resubmitPayment ? 'Payment resubmitted successfully!' : 'Payment submitted successfully! Awaiting admin verification.');
      setShowPaymentForm(false);
      setResubmitPayment(null);
      setFormData({
        amount: '',
        month: new Date().toISOString().slice(0, 7),
        transactionId: '',
        notes: '',
        paymentScreenshot: null
      });
      fetchPayments();
    } catch (error) {
      alert(error.response?.data?.message || 'Error submitting payment');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelPayment = async (paymentId) => {
    if (!window.confirm('Are you sure you want to cancel this payment?')) return;
    
    try {
      await axios.delete(`https://tuitionapp-yq06.onrender.com/api/payments/cancel/${paymentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Payment cancelled successfully');
      fetchPayments();
    } catch (error) {
      alert(error.response?.data?.message || 'Error cancelling payment');
    }
  };

  const handleResubmitPayment = (payment) => {
    setResubmitPayment(payment);
    setFormData({
      amount: payment.amount,
      month: payment.month,
      transactionId: payment.transactionId || '',
      notes: payment.notes || '',
      paymentScreenshot: null
    });
    setShowPaymentForm(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      verified: '#10b981',
      rejected: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      verified: '✅',
      rejected: '❌'
    };
    return icons[status] || '📄';
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#20205c', marginBottom: '2rem', textAlign: 'center' }}>
        💳 Fee Payments
      </h2>

      {/* Payment Instructions */}
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
        <h3 style={{ color: '#20205c', marginBottom: '1rem' }}>📋 Payment Instructions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'center' }}>
          <div>
            <ol style={{ color: '#666', lineHeight: '1.8' }}>
              <li>Scan the QR code using Google Pay (GPay)</li>
              <li>Pay the required fee amount</li>
              <li>Take a screenshot of the payment confirmation</li>
              <li>Upload the screenshot using the form below</li>
              <li>Wait for admin verification</li>
            </ol>
          </div>
          <div style={{ textAlign: 'center' }}>
            {qrCode ? (
              <img 
                src={qrCode} 
                alt="GPay QR Code" 
                style={{ maxWidth: '200px', border: '2px solid #3b82f6', borderRadius: '8px' }}
              />
            ) : (
              <div style={{ width: '200px', height: '200px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
                Loading QR Code...
              </div>
            )}
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>Scan with GPay</p>
          </div>
        </div>
      </div>

      {/* Submit Payment Button */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <button
          onClick={() => setShowPaymentForm(!showPaymentForm)}
          style={{
            padding: '1rem 2rem',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
        >
          {showPaymentForm ? '❌ Cancel Payment' : '💰 Submit New Payment'}
        </button>
      </div>

      {/* Payment Form */}
      {showPaymentForm && (
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
          <h3 style={{ color: '#20205c', marginBottom: '1.5rem' }}>
            {resubmitPayment ? '🔄 Resubmit Payment' : '📤 Submit Payment'}
          </h3>
          {resubmitPayment && (
            <div style={{ padding: '1rem', backgroundColor: '#fef3c7', border: '1px solid #f59e0b', borderRadius: '6px', marginBottom: '1rem' }}>
              <strong>Resubmitting payment for:</strong> {resubmitPayment.month}<br/>
              <strong>Previous rejection reason:</strong> {resubmitPayment.rejectionReason}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Amount (₹):</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Month:</label>
                <input
                  type="month"
                  name="month"
                  value={formData.month}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Transaction ID (from screenshot):</label>
              <input
                type="text"
                name="transactionId"
                value={formData.transactionId}
                onChange={handleInputChange}
                placeholder="Enter transaction ID from payment"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Payment Screenshot:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required={!resubmitPayment}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
              />
              <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                {resubmitPayment ? 'Upload new screenshot (optional - leave empty to keep existing)' : 'Upload screenshot of your GPay payment confirmation'}
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Notes (optional):</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="3"
                placeholder="Any additional notes..."
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: loading ? '#9ca3af' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? (resubmitPayment ? 'Resubmitting...' : 'Submitting...') : (resubmitPayment ? '🔄 Resubmit Payment' : '📤 Submit Payment')}
            </button>
          </form>
        </div>
      )}

      {/* Payment History */}
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#20205c', marginBottom: '1.5rem' }}>📋 Payment History</h3>
        
        {payments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💳</div>
            <p style={{ fontSize: '1.2rem' }}>No payments submitted yet</p>
            <p>Submit your first payment using the form above</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {payments.map((payment) => (
              <div key={payment._id} style={{
                padding: '1.5rem',
                border: `2px solid ${getStatusColor(payment.status)}`,
                borderRadius: '8px',
                backgroundColor: '#f8fafc'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ margin: 0, color: '#20205c' }}>
                    {getStatusIcon(payment.status)} Payment for {payment.month}
                  </h4>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: getStatusColor(payment.status),
                    color: 'white',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    {payment.status}
                  </span>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.9rem', color: '#666' }}>
                  <div><strong>Amount:</strong> ₹{payment.amount}</div>
                  <div><strong>Submitted:</strong> {new Date(payment.submittedAt).toLocaleDateString()}</div>
                  {payment.transactionId && <div><strong>Transaction ID:</strong> {payment.transactionId}</div>}
                  {payment.verifiedAt && <div><strong>Verified:</strong> {new Date(payment.verifiedAt).toLocaleDateString()}</div>}
                </div>
                
                {payment.rejectionReason && (
                  <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px' }}>
                    <strong style={{ color: '#dc2626' }}>Rejection Reason:</strong> {payment.rejectionReason}
                  </div>
                )}
                
                <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  {payment.paymentScreenshot && (
                    <a 
                      href={`https://tuitionapp-yq06.onrender.com${payment.paymentScreenshot}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '0.9rem' }}
                    >
                      📷 View Screenshot
                    </a>
                  )}
                  
                  {payment.status === 'pending' && (
                    <button
                      onClick={() => handleCancelPayment(payment._id)}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      ❌ Cancel Payment
                    </button>
                  )}
                  
                  {payment.status === 'rejected' && (
                    <button
                      onClick={() => handleResubmitPayment(payment)}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#f59e0b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      🔄 Resubmit Payment
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentPayments;