import React, { useEffect, useState } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; // removed braces
import { useNavigate, Link } from "react-router-dom";
import "../styles/TutorDashboard.css";

const TutorDashboard = () => {
  const [announcements, setAnnouncements] = useState([]);
  const navigate = useNavigate();





  // Fetch announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/announcements", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnnouncements(res.data);
      } catch (err) {
        console.error("Failed to fetch announcements:", err);
      }
    };
    fetchAnnouncements();
  }, []);



  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Global Announcements */}
        {announcements.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#20205c', marginBottom: '1rem', textAlign: 'center' }}>📢 Announcements</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {announcements.slice(0, 3).map((announcement) => (
                <div key={announcement._id} style={{
                  backgroundColor: announcement.type === 'urgent' ? '#fef2f2' : announcement.type === 'holiday' ? '#f0fdf4' : '#f8fafc',
                  border: `2px solid ${announcement.type === 'urgent' ? '#ef4444' : announcement.type === 'holiday' ? '#22c55e' : '#3b82f6'}`,
                  padding: '1rem',
                  borderRadius: '8px'
                }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#20205c' }}>{announcement.title}</h4>
                  <p style={{ margin: '0 0 0.5rem 0', color: '#666' }}>{announcement.message}</p>
                  <small style={{ color: '#999' }}>{new Date(announcement.createdAt).toLocaleDateString()}</small>
                </div>
              ))}
            </div>
          </div>
        )}





    </div>
  );
};

export default TutorDashboard;
