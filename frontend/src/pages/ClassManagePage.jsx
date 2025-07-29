import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/ClassManagePage.css';

const ClassManagePage = () => {
  const { id } = useParams(); // class ID
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
      await axios.put(
        `http://localhost:5000/api/tutors/class/${id}`,
        { schedule },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Schedule updated successfully!');
    } catch (err) {
      alert('Failed to update schedule');
    }
  };

  const handleResourceUpload = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/tutors/class/${id}/resource`,
        { link: resourceLink },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Resource uploaded!');
      setResourceLink('');
    } catch (err) {
      alert('Failed to upload resource');
    }
  };

  const handleAnnouncement = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/tutors/class/${id}/announcement`,
        { text: announcement },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Announcement sent!');
      setAnnouncement('');
    } catch (err) {
      alert('Failed to send announcement');
    }
  };

  if (!classInfo) return <p>Loading class details...</p>;

  return (
    <div className="manage-page">
      <h2>Manage Class: {classInfo.name}</h2>
      <p><strong>Subject:</strong> {classInfo.subject}</p>

      <div className="section">
        <h3>Edit Schedule</h3>
        <input
          type="text"
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
        />
        <button onClick={handleScheduleUpdate}>Update</button>
      </div>

      <div className="section">
        <h3>Upload Resource (Link)</h3>
        <input
          type="text"
          value={resourceLink}
          onChange={(e) => setResourceLink(e.target.value)}
          placeholder="Paste link here"
        />
        <button onClick={handleResourceUpload}>Upload</button>
      </div>

      <div className="section">
        <h3>Post Announcement</h3>
        <textarea
          rows="4"
          value={announcement}
          onChange={(e) => setAnnouncement(e.target.value)}
          placeholder="Write your announcement..."
        />
        <button onClick={handleAnnouncement}>Send</button>
      </div>
    </div>
  );
};

export default ClassManagePage;
