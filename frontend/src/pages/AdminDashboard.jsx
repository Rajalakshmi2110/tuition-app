import React, { useEffect, useState } from "react";

import axios from "axios";
import AdminLayout from '../components/AdminLayout';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("student");
  const [students, setStudents] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const [announcementType, setAnnouncementType] = useState('general');
  const [announcements, setAnnouncements] = useState([]);
  const [stats, setStats] = useState({
    activeStudents: 0,
    expertTutors: 0,
    completedClasses: 0,
    studyMaterials: 0
  });


  const BASE_URL = "https://tuitionapp-yq06.onrender.com";

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      const [studentsRes, tutorsRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/admin/students`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${BASE_URL}/api/admin/tutors`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setStudents(studentsRes.data);
      setTutors(tutorsRes.data);
    } catch (err) {
      setError("Failed to load data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnnouncements = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${BASE_URL}/api/announcements`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnnouncements(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStats = async () => {
    const token = localStorage.getItem("token");
    try {
      console.log('Fetching stats from frontend...');
      const res = await axios.get(`${BASE_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Stats response:', res.data);
      setStats(res.data);
    } catch (err) {
      console.error('Frontend stats error:', err);
    }
  };



  const deleteAnnouncement = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${BASE_URL}/api/announcements/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchAnnouncements();
    fetchStats();
  }, []);

  const approveTutor = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.patch(
        `${BASE_URL}/api/admin/tutors/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const declineTutor = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.patch(
        `${BASE_URL}/api/admin/tutors/${id}/decline`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const data = activeTab === "student" ? students : tutors;
  const type = activeTab;

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.post(`${BASE_URL}/api/announcements`, {
        title: announcementTitle,
        message: announcementMessage,
        type: announcementType
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Announcement posted successfully!');
      setShowAnnouncementForm(false);
      setAnnouncementTitle('');
      setAnnouncementMessage('');
      setAnnouncementType('general');
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
      alert('Failed to post announcement');
    }
  };

  return (
    <AdminLayout showAnnouncementForm={showAnnouncementForm} setShowAnnouncementForm={setShowAnnouncementForm}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#20205c", marginBottom: "2rem" }}>
          Dashboard Overview
        </h1>

        {/* Statistics Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
          <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>👨‍🎓</div>
            <h3 style={{ fontSize: "2rem", fontWeight: "bold", color: "#2563eb", margin: "0" }}>{stats.activeStudents}</h3>
            <p style={{ color: "#666", margin: "0.25rem 0 0 0" }}>Active Students</p>
          </div>
          <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>👨‍🏫</div>
            <h3 style={{ fontSize: "2rem", fontWeight: "bold", color: "#10b981", margin: "0" }}>{stats.expertTutors}</h3>
            <p style={{ color: "#666", margin: "0.25rem 0 0 0" }}>Expert Tutors</p>
          </div>
          <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>✅</div>
            <h3 style={{ fontSize: "2rem", fontWeight: "bold", color: "#f59e0b", margin: "0" }}>{stats.completedClasses}</h3>
            <p style={{ color: "#666", margin: "0.25rem 0 0 0" }}>Classes Conducted</p>
          </div>
          <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📚</div>
            <h3 style={{ fontSize: "2rem", fontWeight: "bold", color: "#ef4444", margin: "0" }}>{stats.studyMaterials}</h3>
            <p style={{ color: "#666", margin: "0.25rem 0 0 0" }}>Study Materials</p>
          </div>
        </div>



      {/* Tabs */}
      <div style={{ display: "flex", marginBottom: "16px", gap: "10px" }}>
        <button
          onClick={() => setActiveTab("student")}
          style={{
            flex: 1,
            padding: "10px",
            backgroundColor: activeTab === "student" ? "#007bff" : "#f3f4f6",
            color: activeTab === "student" ? "#fff" : "#000",
            borderRadius: "6px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Students
        </button>
        <button
          onClick={() => setActiveTab("tutor")}
          style={{
            flex: 1,
            padding: "10px",
            backgroundColor: activeTab === "tutor" ? "#007bff" : "#f3f4f6",
            color: activeTab === "tutor" ? "#fff" : "#000",
            borderRadius: "6px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Tutors
        </button>
      </div>

      {loading && <p>Loading {type} data...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <thead style={{ backgroundColor: "#f9fafb" }}>
            <tr>
              <th style={{ padding: "12px", textAlign: "left" }}>Name</th>
              {type === "student" ? <th>Class</th> : <th>Specialization</th>}
              {type === "student" ? <th>Subject</th> : <th>Status</th>}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "12px" }}>
                  No {type}s found.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item._id} style={{ backgroundColor: "#fff" }}>
                  <td style={{ padding: "12px" }}>{item.name}</td>
                  {type === "student" ? (
                    <>
                      <td style={{ padding: "12px" }}>{item.className || "—"}</td>
                      <td style={{ padding: "12px" }}>{item.subject || "—"}</td>
                    </>
                  ) : (
                    <>
                      <td style={{ padding: "12px" }}>{item.specialization || "—"}</td>
                      <td style={{ padding: "12px" }}>{item.status}</td>
                    </>
                  )}
                  <td style={{ padding: "12px", display: "flex", gap: "6px" }}>
                    <button style={{ padding: "6px 12px", background: "#007bff", color: "#fff", borderRadius: "4px", border: "none", cursor: "pointer" }}>View</button>

                    {type === "tutor" && item.status?.trim().toLowerCase() === "pending" && (
                      <>
                        <button style={{ padding: "6px 12px", background: "#10b981", color: "#fff", borderRadius: "4px", border: "none", cursor: "pointer" }} onClick={() => approveTutor(item._id)}>Approve</button>
                        <button style={{ padding: "6px 12px", background: "#ef4444", color: "#fff", borderRadius: "4px", border: "none", cursor: "pointer" }} onClick={() => declineTutor(item._id)}>Decline</button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
      
      {/* Current Announcements */}
      {announcements.length > 0 && (
        <div style={{ marginTop: '2rem', backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '1rem', color: '#20205c' }}>Current Announcements</h3>
          {announcements.map((announcement) => (
            <div key={announcement._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '0.5rem' }}>
              <div>
                <strong>{announcement.title}</strong> - {announcement.message}
              </div>
              <button onClick={() => deleteAnnouncement(announcement._id)} style={{ padding: '0.25rem 0.5rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
            </div>
          ))}
        </div>
      )}
      
      {/* Announcement Form Modal */}
      {showAnnouncementForm && (
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
            borderRadius: '12px',
            width: '500px',
            maxWidth: '90%'
          }}>
            <h3 style={{ marginBottom: '1rem', color: '#20205c' }}>Post Global Announcement</h3>
            <form onSubmit={handleCreateAnnouncement}>
              <input
                type="text"
                placeholder="Announcement Title"
                value={announcementTitle}
                onChange={(e) => setAnnouncementTitle(e.target.value)}
                required
                style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '6px', border: '1px solid #ddd' }}
              />
              <select
                value={announcementType}
                onChange={(e) => setAnnouncementType(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '6px', border: '1px solid #ddd' }}
              >
                <option value="general">General</option>
                <option value="holiday">Holiday</option>
                <option value="urgent">Urgent</option>
              </select>
              <textarea
                placeholder="Announcement Message"
                value={announcementMessage}
                onChange={(e) => setAnnouncementMessage(e.target.value)}
                required
                rows="4"
                style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '6px', border: '1px solid #ddd' }}
              />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" style={{ 
                  flex: 1, 
                  padding: '0.75rem', 
                  backgroundColor: '#2563eb', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)'
                }}>📢 Post Announcement</button>
                <button type="button" onClick={() => setShowAnnouncementForm(false)} style={{ 
                  flex: 1, 
                  padding: '0.75rem', 
                  backgroundColor: '#6b7280', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
