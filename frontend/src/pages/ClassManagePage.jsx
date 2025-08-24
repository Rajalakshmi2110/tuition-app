import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ClassManagePage = () => {
  const { id } = useParams();
  const [classInfo, setClassInfo] = useState(null);
  const [schedule, setSchedule] = useState('');
  const [resourceLink, setResourceLink] = useState('');
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    const fetchClassInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/classes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClassInfo(res.data);
        setSchedule(res.data.schedule);
      } catch (err) {
        console.error('Failed to fetch class info:', err);
      }
    };
    fetchClassInfo();
  }, [id]);

  const handleScheduleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/classes/tutor/class/${id}`, { schedule }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Schedule updated successfully!');
      // Update local state
      setClassInfo({...classInfo, schedule});
    } catch (err) {
      console.error(err);
      alert('Failed to update schedule');
    }
  };

  const handleResourceUpload = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/classes/tutor/class/${id}/resource`, { link: resourceLink }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Resource uploaded!');
      setResourceLink('');
    } catch (err) {
      console.error(err);
      alert('Failed to upload resource');
    }
  };

  const handleAnnouncement = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/classes/tutor/class/${id}/announcement`, { text: announcement }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Announcement sent!');
      setAnnouncement('');
    } catch (err) {
      console.error(err);
      alert('Failed to send announcement');
    }
  };

  const handleMarkComplete = async () => {
    if (!window.confirm('Mark this class as completed? It will be removed from active dashboards.')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/classes/tutor/class/${id}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Class marked as completed!');
      window.history.back();
    } catch (err) {
      console.error(err);
      alert('Failed to mark class as completed');
    }
  };

  if (!classInfo) return <p>Loading class details...</p>;

  return (
    <div style={{
      maxWidth: '600px',
      margin: '40px auto',
      padding: '30px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
        Manage Class: {classInfo.name}
      </h2>
      <p><strong>Subject:</strong> {classInfo.subject}</p>

      <div style={{ marginTop: '20px' }}>
        <h3>Edit Schedule</h3>
        <input
          type="text"
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
        />
        <button 
          onClick={handleScheduleUpdate}
          style={{
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#1e40af'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
        >
          Update Schedule
        </button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Upload Resource (Link)</h3>
        <input
          type="text"
          value={resourceLink}
          onChange={(e) => setResourceLink(e.target.value)}
          placeholder="Paste link here"
        />
        <button 
          onClick={handleResourceUpload}
          style={{
            backgroundColor: '#10b981',
            color: 'white',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
        >
          🔗 Add Resource
        </button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Post Announcement</h3>
        <textarea
          rows="4"
          value={announcement}
          onChange={(e) => setAnnouncement(e.target.value)}
          placeholder="Write your announcement..."
        />
        <button 
          onClick={handleAnnouncement}
          style={{
            backgroundColor: '#f59e0b',
            color: 'white',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 4px rgba(245, 158, 11, 0.2)'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#d97706'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#f59e0b'}
        >
          📢 Send Announcement
        </button>
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button 
          onClick={handleMarkComplete}
          style={{
            padding: '1rem 2rem',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '1.1rem',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
            transform: 'translateY(0)'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#dc2626';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#ef4444';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
          }}
        >
          ✓ Mark Class as Completed
        </button>
      </div>

      <style>{`
        input, textarea {
          width: 100%;
          padding: 12px;
          margin-top: 8px;
          margin-bottom: 12px;
          border-radius: 8px;
          border: 1px solid #ddd;
          font-size: 16px;
          transition: border-color 0.3s ease;
        }
        input:focus, textarea:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
      `}</style>
    </div>
  );
};

export default ClassManagePage;
