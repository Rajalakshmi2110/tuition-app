import React, { useState } from 'react';
import axios from 'axios';

const FeedbackForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: 'Student',
    rating: 5,
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      console.log('Submitting feedback:', formData);
      console.log('Posting to:', 'https://tuitionapp-yq06.onrender.com/api/feedback');
      const response = await axios.post('https://tuitionapp-yq06.onrender.com/api/feedback', formData);
      console.log('Response:', response.data);
      alert('Thank you for your feedback! It will be reviewed and published soon.');
      onClose();
    } catch (err) {
      console.error('Feedback submission error:', err);
      alert(`Failed to submit feedback: ${err.response?.data?.message || err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
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
        <h3 style={{ marginBottom: '1.5rem', color: '#1e293b' }}>Share Your Experience</h3>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
            style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
          />
          
          <select
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
            style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
          >
            <option value="Student">Student</option>
            <option value="Parent">Parent</option>
            <option value="Tutor">Tutor</option>
          </select>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Rating:</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[1,2,3,4,5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({...formData, rating: star})}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '2rem',
                    cursor: 'pointer',
                    color: star <= formData.rating ? '#f59e0b' : 'transparent',
                    WebkitTextStroke: star <= formData.rating ? 'none' : '1px #d1d5db',
                    textStroke: star <= formData.rating ? 'none' : '1px #d1d5db'
                  }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          
          <textarea
            placeholder="Share your experience with Tuitix..."
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            required
            rows="4"
            style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box', resize: 'vertical' }}
          />
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              type="submit" 
              disabled={submitting}
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
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
            <button 
              type="button" 
              onClick={onClose}
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
  );
};

export default FeedbackForm;