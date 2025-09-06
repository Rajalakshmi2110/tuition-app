import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AdminLayout = ({ children, showAnnouncementForm, setShowAnnouncementForm }) => {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* Sidebar */}
      <div style={{
        width: isMinimized ? "80px" : "280px",
        backgroundColor: "#20205c",
        padding: isMinimized ? "1rem 0.5rem" : "2rem 1rem",
        boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
        transition: "all 0.3s ease"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
          {!isMinimized && <h2 style={{ color: "white", fontSize: "1.5rem", margin: 0 }}>Admin Panel</h2>}
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            style={{
              backgroundColor: "rgba(255,255,255,0.2)",
              color: "white",
              border: "none",
              borderRadius: "4px",
              padding: "0.5rem",
              cursor: "pointer",
              fontSize: "1rem"
            }}
          >
            {isMinimized ? "→" : "←"}
          </button>
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Link to="/admin" style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "1rem",
            backgroundColor: "rgba(255,255,255,0.1)",
            color: "white",
            textDecoration: "none",
            borderRadius: "8px",
            transition: "all 0.3s ease",
            justifyContent: isMinimized ? "center" : "flex-start"
          }}>
            🏠 {!isMinimized && <span>Dashboard</span>}
          </Link>
          
          <Link to="/admin/files" style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "1rem",
            backgroundColor: "rgba(255,255,255,0.1)",
            color: "white",
            textDecoration: "none",
            borderRadius: "8px",
            transition: "all 0.3s ease",
            justifyContent: isMinimized ? "center" : "flex-start"
          }}>
            📂 {!isMinimized && <span>View All Files</span>}
          </Link>
          
          <Link to="/admin/classes" style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "1rem",
            backgroundColor: "rgba(255,255,255,0.1)",
            color: "white",
            textDecoration: "none",
            borderRadius: "8px",
            transition: "all 0.3s ease",
            justifyContent: isMinimized ? "center" : "flex-start"
          }}>
            📋 {!isMinimized && <span>View Sessions</span>}
          </Link>
          
          <Link to="/admin/create-class" style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "1rem",
            backgroundColor: "rgba(255,255,255,0.1)",
            color: "white",
            textDecoration: "none",
            borderRadius: "8px",
            transition: "all 0.3s ease",
            justifyContent: isMinimized ? "center" : "flex-start"
          }}>
            ➕ {!isMinimized && <span>Create Session</span>}
          </Link>
          
          <Link to="/admin/feedback" style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "1rem",
            backgroundColor: "rgba(255,255,255,0.1)",
            color: "white",
            textDecoration: "none",
            borderRadius: "8px",
            transition: "all 0.3s ease",
            justifyContent: isMinimized ? "center" : "flex-start"
          }}>
            💬 {!isMinimized && <span>Manage Feedback</span>}
          </Link>
          
          <Link to="/admin/gallery" style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "1rem",
            backgroundColor: "rgba(255,255,255,0.1)",
            color: "white",
            textDecoration: "none",
            borderRadius: "8px",
            transition: "all 0.3s ease",
            justifyContent: isMinimized ? "center" : "flex-start"
          }}>
            🖼️ {!isMinimized && <span>Gallery</span>}
          </Link>
          
          <Link to="/admin/payments" style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "1rem",
            backgroundColor: "rgba(255,255,255,0.1)",
            color: "white",
            textDecoration: "none",
            borderRadius: "8px",
            transition: "all 0.3s ease",
            justifyContent: isMinimized ? "center" : "flex-start"
          }}>
            💰 {!isMinimized && <span>Payment Management</span>}
          </Link>
          
          <button onClick={() => {
            if (setShowAnnouncementForm) {
              setShowAnnouncementForm(true);
            } else {
              window.location.href = '/admin';
            }
          }} style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "1rem",
            backgroundColor: "rgba(255,255,255,0.1)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            justifyContent: isMinimized ? "center" : "flex-start"
          }}>
            📢 {!isMinimized && <span>Post Announcement</span>}
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div style={{ flex: 1, padding: "2rem" }}>
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;