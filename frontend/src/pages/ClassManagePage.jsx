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
      await axios.put(`http://localhost:5000/api/tutors/class/${id}`, { schedule }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Schedule updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update schedule');
    }
  };

  const handleResourceUpload = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/tutors/class/${id}/resource`, { link: resourceLink }, {
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
      await axios.post(`http://localhost:5000/api/tutors/class/${id}/announcement`, { text: announcement }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Announcement sent!');
      setAnnouncement('');
    } catch (err) {
      console.error(err);
      alert('Failed to send announcement');
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
        <button className="btn-primary" onClick={handleScheduleUpdate}>Update</button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Upload Resource (Link)</h3>
        <input
          type="text"
          value={resourceLink}
          onChange={(e) => setResourceLink(e.target.value)}
          placeholder="Paste link here"
        />
        <button className="btn-primary" onClick={handleResourceUpload}>Upload</button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Post Announcement</h3>
        <textarea
          rows="4"
          value={announcement}
          onChange={(e) => setAnnouncement(e.target.value)}
          placeholder="Write your announcement..."
        />
        <button className="btn-primary" onClick={handleAnnouncement}>Send</button>
      </div>

      <style>{`
        input, textarea {
          width: 100%;
          padding: 12px;
          margin-top: 8px;
          margin-bottom: 12px;
          border-radius: 8px;
          border: 1px solid #ccc;
          font-size: 16px;
        }
        .btn-primary {
          padding: 12px 20px;
          background-color: #2563eb;
          color: white;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 5px;
          transition: all 0.2s;
        }
        .btn-primary:hover {
          background-color: #1e40af;
        }
      `}</style>
    </div>
  );
};

export default ClassManagePage;
