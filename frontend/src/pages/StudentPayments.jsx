import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import fileUrl from '../config/fileUrl';
import { useToast } from '../components/Toast';

const StudentPayments = () => {
  const [qrCode, setQrCode] = useState('');
  const [payments, setPayments] = useState([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    month: new Date().toISOString().slice(0, 7),
    transactionId: '',
    notes: '',
    paymentScreenshot: null
  });
  const [resubmitPayment, setResubmitPayment] = useState(null);
  const toast = useToast();

  const fetchQRCode = useCallback(async () => {
    try {
      const response = await api.get(`/payments/qr-code`);
      setQrCode(response.data.qrCodeUrl);
    } catch (error) {
    }
  }, []);

  const fetchPayments = useCallback(async () => {
    try {
      const response = await api.get(`/payments/my-payments`);
      setPayments(response.data);
    } catch (error) {
    }
  }, []);

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
      toast.error('Please upload payment screenshot');
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
        ? `/payments/resubmit/${resubmitPayment._id}`
        : `/payments/submit`;

      const method = resubmitPayment ? 'patch' : 'post';

      await api[method](url, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success(resubmitPayment ? 'Payment resubmitted successfully!' : 'Payment submitted! Awaiting verification.');
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
      toast.error(error.response?.data?.message || 'Error submitting payment');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelPayment = async (paymentId) => {
    if (!window.confirm('Are you sure you want to cancel this payment?')) return;

    try {
      await api.delete(`/payments/cancel/${paymentId}`);
      toast.success('Payment cancelled successfully');
      fetchPayments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error cancelling payment');
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

  const getStatusStyle = (status) => {
    const styles = {
      pending: { bg: '#fef3c7', color: '#92400e', border: '#fbbf24' },
      verified: { bg: '#dcfce7', color: '#166534', border: '#22c55e' },
      rejected: { bg: '#fee2e2', color: '#991b1b', border: '#ef4444' }
    };
    return styles[status] || { bg: '#f1f5f9', color: 'var(--text-secondary)', border: '#94a3b8' };
  };

  const getStatusIcon = (status) => {
    const icons = { pending: '○', verified: '✓', rejected: '✕' };
    return icons[status] || '▣';
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    fontSize: '0.95rem',
    border: '2px solid var(--border-light)',
    borderRadius: '10px',
    outline: 'none',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box'
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
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
          Fee Payments
        </h2>
        <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
          Submit and track your fee payments
        </p>
      </div>

      {/* Payment Instructions */}
      <div style={{
        backgroundColor: 'var(--bg-primary)',
        padding: '2rem',
        borderRadius: '16px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
        border: '1px solid var(--border-light)',
        marginBottom: '1.5rem'
      }}>
        <h3 style={{
          color: 'var(--text-primary)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: 700
        }}>
          📋 Payment Instructions
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          alignItems: 'center'
        }}>
          <div>
            <ol style={{
              color: 'var(--text-secondary)',
              lineHeight: '2',
              paddingLeft: '1.5rem',
              margin: 0
            }}>
              <li>Scan the QR code using Google Pay (GPay)</li>
              <li>Pay the required fee amount</li>
              <li>Take a screenshot of the payment confirmation</li>
              <li>Upload the screenshot using the form below</li>
              <li>Wait for admin verification</li>
            </ol>
          </div>
          <div style={{ textAlign: 'center' }}>
            {qrCode ? (
              <div style={{
                padding: '1rem',
                background: 'var(--bg-primary)',
                borderRadius: '16px',
                border: '3px solid #10b981',
                display: 'inline-block',
                boxShadow: '0 8px 20px rgba(16, 185, 129, 0.2)'
              }}>
                <img
                  src={qrCode}
                  alt="GPay QR Code"
                  style={{ maxWidth: '180px', display: 'block' }}
                />
              </div>
            ) : (
              <div style={{
                width: '200px',
                height: '200px',
                backgroundColor: 'var(--bg-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '16px',
                border: '2px dashed #e2e8f0',
                color: 'var(--text-muted)'
              }}>
                Loading QR Code...
              </div>
            )}
            <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: '#10b981', fontWeight: 600 }}>
              Scan with GPay
            </p>
          </div>
        </div>
      </div>

      {/* Submit Payment Button */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setShowPaymentForm(!showPaymentForm)}
          style={{
            padding: '1rem 2rem',
            background: showPaymentForm ? '#f1f5f9' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: showPaymentForm ? '#64748b' : 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: showPaymentForm ? 'none' : '0 4px 15px rgba(16, 185, 129, 0.4)'
          }}
        >
          {showPaymentForm ? 'Cancel' : 'Submit New Payment'}
        </button>
      </div>

      {/* Payment Form */}
      {showPaymentForm && (
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          padding: '2rem',
          borderRadius: '16px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
          border: '1px solid var(--border-light)',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{
            color: 'var(--text-primary)',
            marginBottom: '1.5rem',
            fontWeight: 700
          }}>
            {resubmitPayment ? '🔄 Resubmit Payment' : '📤 Submit Payment'}
          </h3>
          {resubmitPayment && (
            <div style={{
              padding: '1rem',
              backgroundColor: '#fef3c7',
              border: '2px solid #fbbf24',
              borderRadius: '10px',
              marginBottom: '1.5rem'
            }}>
              <p style={{ margin: 0, fontWeight: 600, color: '#92400e' }}>
                Resubmitting payment for: {resubmitPayment.month}
              </p>
              <p style={{ margin: '0.25rem 0 0', color: '#78350f', fontSize: '0.9rem' }}>
                Previous rejection reason: {resubmitPayment.rejectionReason}
              </p>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Amount (₹)</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Month</label>
                <input
                  type="month"
                  name="month"
                  value={formData.month}
                  onChange={handleInputChange}
                  required
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Transaction ID</label>
              <input
                type="text"
                name="transactionId"
                value={formData.transactionId}
                onChange={handleInputChange}
                placeholder="Enter transaction ID from payment"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Payment Screenshot</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required={!resubmitPayment}
                style={{
                  ...inputStyle,
                  padding: '0.5rem',
                  background: 'var(--bg-secondary)'
                }}
              />
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                {resubmitPayment ? 'Upload new screenshot (optional)' : 'Upload screenshot of payment confirmation'}
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Notes (optional)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="3"
                placeholder="Any additional notes..."
                style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '1rem',
                background: loading ? '#94a3b8' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}
            >
              {loading ? 'Submitting...' : (resubmitPayment ? '🔄 Resubmit Payment' : '📤 Submit Payment')}
            </button>
          </form>
        </div>
      )}

      {/* Payment History */}
      <div style={{
        backgroundColor: 'var(--bg-primary)',
        padding: '2rem',
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
          📋 Payment History
        </h3>

        {payments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem', color: '#10b981' }}>◈</div>
            <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: '0.5rem' }}>
              No Payments Yet
            </h3>
            <p style={{ color: 'var(--text-muted)' }}>Submit your first payment using the form above</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {payments.map((payment) => {
              const statusStyle = getStatusStyle(payment.status);
              return (
                <div
                  key={payment._id}
                  style={{
                    padding: '1.5rem',
                    border: `2px solid ${statusStyle.border}`,
                    borderRadius: '12px',
                    backgroundColor: statusStyle.bg
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
                    <h4 style={{ margin: 0, color: 'var(--text-primary)', fontWeight: 700 }}>
                      {getStatusIcon(payment.status)} Payment for {payment.month}
                    </h4>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: statusStyle.border,
                      color: 'white',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase'
                    }}>
                      {payment.status}
                    </span>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '0.75rem',
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)'
                  }}>
                    <div><strong>Amount:</strong> ₹{payment.amount}</div>
                    <div><strong>Submitted:</strong> {new Date(payment.submittedAt).toLocaleDateString()}</div>
                    {payment.transactionId && <div><strong>Transaction ID:</strong> {payment.transactionId}</div>}
                    {payment.verifiedAt && <div><strong>Verified:</strong> {new Date(payment.verifiedAt).toLocaleDateString()}</div>}
                  </div>

                  {payment.rejectionReason && (
                    <div style={{
                      marginTop: '1rem',
                      padding: '0.75rem',
                      backgroundColor: '#fee2e2',
                      border: '1px solid #fecaca',
                      borderRadius: '8px'
                    }}>
                      <strong style={{ color: '#dc2626' }}>Rejection Reason:</strong> {payment.rejectionReason}
                    </div>
                  )}

                  <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    {payment.paymentScreenshot && (
                      <a
                        href={fileUrl(payment.paymentScreenshot)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: '#10b981',
                          textDecoration: 'none',
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        📷 View Screenshot
                      </a>
                    )}

                    {payment.status === 'pending' && (
                      <button
                        onClick={() => handleCancelPayment(payment._id)}
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
                        Cancel
                      </button>
                    )}

                    {payment.status === 'rejected' && (
                      <button
                        onClick={() => handleResubmitPayment(payment)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                          color: 'var(--text-primary)',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          fontWeight: 500
                        }}
                      >
                        🔄 Resubmit
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentPayments;
