import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../components/Toast';

const ClassManagePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classInfo, setClassInfo] = useState(null);
  const [schedule, setSchedule] = useState('');
  const [resourceLink, setResourceLink] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchClassInfo = async () => {
      try {
        const res = await api.get(`/classes/${id}`);
        setClassInfo(res.data);
        setSchedule(res.data.schedule);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    fetchClassInfo();
  }, [id]);

  const handleScheduleUpdate = async () => {
    try {
      await api.put(`/classes/tutor/class/${id}`, { schedule });
      toast.success('Schedule updated successfully!');
      setClassInfo({...classInfo, schedule});
    } catch (err) {
      toast.error('Failed to update schedule');
    }
  };

  const handleResourceUpload = async () => {
    if (!resourceLink.trim()) {
      toast.warning('Please enter a resource link');
      return;
    }
    try {
      await api.post(`/classes/tutor/class/${id}/resource`, { link: resourceLink });
      toast.success('Resource added successfully!');
      setResourceLink('');
    } catch (err) {
      toast.error('Failed to upload resource');
    }
  };

  const handleAnnouncement = async () => {
    if (!announcement.trim()) {
      toast.warning('Please enter an announcement');
      return;
    }
    try {
      await api.post(`/classes/tutor/class/${id}/announcement`, { text: announcement });
      toast.success('Announcement sent successfully!');
      setAnnouncement('');
    } catch (err) {
      toast.error('Failed to send announcement');
    }
  };

  const handleMarkComplete = async () => {
    if (!window.confirm('Mark this class as completed? It will be removed from active dashboards.')) return;
    
    try {
      await api.put(`/classes/tutor/class/${id}/complete`, {});
      toast.success('Class marked as completed!');
      navigate('/tutor/sessions');
    } catch (err) {
      toast.error('Failed to mark class as completed');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.875rem 1rem',
    fontSize: '0.95rem',
    border: '2px solid var(--border-light)',
    borderRadius: '10px',
    outline: 'none',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
    fontFamily: 'inherit'
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '3px solid #e2e8f0',
          borderTopColor: '#10b981',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Loading class details...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!classInfo) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>Class not found</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => navigate('/tutor/sessions')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: 500,
            padding: '0.5rem 0',
            marginBottom: '1rem'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Sessions
        </button>
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
          </div>
          {classInfo.name}
        </h1>
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginTop: '0.75rem',
          flexWrap: 'wrap'
        }}>
          <span style={{
            backgroundColor: '#dbeafe',
            color: '#1e40af',
            padding: '0.25rem 0.75rem',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: 500
          }}>
            {classInfo.subject}
          </span>
          <span style={{
            backgroundColor: '#dcfce7',
            color: '#166534',
            padding: '0.25rem 0.75rem',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: 500
          }}>
            Class {classInfo.classLevel}
          </span>
        </div>
      </div>

      {/* Schedule Section */}
      <div style={{
        background: 'var(--bg-primary)',
        padding: '1.5rem',
        borderRadius: '16px',
        marginBottom: '1rem',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
        border: '1px solid var(--border-light)'
      }}>
        <h3 style={{
          margin: '0 0 1rem',
          color: 'var(--text-primary)',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '1.1rem'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          Edit Schedule
        </h3>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            placeholder="e.g., 6:00 PM - 8:00 PM"
            style={{ ...inputStyle, flex: 1, minWidth: '200px' }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e2e8f0';
              e.target.style.boxShadow = 'none';
            }}
          />
          <button
            onClick={handleScheduleUpdate}
            style={{
              padding: '0.875rem 1.5rem',
              background: 'transparent',
              color: '#3b82f6',
              border: '2px solid #3b82f6',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#3b82f6';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#3b82f6';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            Update
          </button>
        </div>
      </div>

      {/* Resource Upload Section */}
      <div style={{
        background: 'var(--bg-primary)',
        padding: '1.5rem',
        borderRadius: '16px',
        marginBottom: '1rem',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
        border: '1px solid var(--border-light)'
      }}>
        <h3 style={{
          margin: '0 0 1rem',
          color: 'var(--text-primary)',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '1.1rem'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
          Add Resource Link
        </h3>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={resourceLink}
            onChange={(e) => setResourceLink(e.target.value)}
            placeholder="Paste resource link here..."
            style={{ ...inputStyle, flex: 1, minWidth: '200px' }}
            onFocus={(e) => {
              e.target.style.borderColor = '#10b981';
              e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e2e8f0';
              e.target.style.boxShadow = 'none';
            }}
          />
          <button
            onClick={handleResourceUpload}
            style={{
              padding: '0.875rem 1.5rem',
              background: 'transparent',
              color: '#10b981',
              border: '2px solid #10b981',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap'
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
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            Add
          </button>
        </div>
      </div>

      {/* Announcement Section */}
      <div style={{
        background: 'var(--bg-primary)',
        padding: '1.5rem',
        borderRadius: '16px',
        marginBottom: '1rem',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
        border: '1px solid var(--border-light)'
      }}>
        <h3 style={{
          margin: '0 0 1rem',
          color: 'var(--text-primary)',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '1.1rem'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          Post Announcement
        </h3>
        <textarea
          rows="3"
          value={announcement}
          onChange={(e) => setAnnouncement(e.target.value)}
          placeholder="Write your announcement to students..."
          style={{ ...inputStyle, resize: 'vertical', marginBottom: '0.75rem' }}
          onFocus={(e) => {
            e.target.style.borderColor = '#fbbf24';
            e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e2e8f0';
            e.target.style.boxShadow = 'none';
          }}
        />
        <button
          onClick={handleAnnouncement}
          style={{
            padding: '0.875rem 1.5rem',
            background: 'transparent',
            color: '#f59e0b',
            border: '2px solid #f59e0b',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.9rem',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f59e0b';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#f59e0b';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          Send Announcement
        </button>
      </div>

      {/* Mark Complete Section */}
      <div style={{
        background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
        padding: '1.5rem',
        borderRadius: '16px',
        border: '2px solid #fecaca',
        textAlign: 'center'
      }}>
        <h3 style={{
          margin: '0 0 0.5rem',
          color: '#991b1b',
          fontWeight: 700,
          fontSize: '1rem'
        }}>
          Complete This Session
        </h3>
        <p style={{
          color: '#b91c1c',
          fontSize: '0.85rem',
          margin: '0 0 1rem',
          opacity: 0.8
        }}>
          This action will mark the session as completed and archive it.
        </p>
        <button
          onClick={handleMarkComplete}
          style={{
            padding: '0.875rem 2rem',
            background: 'transparent',
            color: '#dc2626',
            border: '2px solid #dc2626',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.95rem',
            transition: 'all 0.2s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#dc2626';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#dc2626';
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          Mark as Completed
        </button>
      </div>
    </div>
  );
};

export default ClassManagePage;
