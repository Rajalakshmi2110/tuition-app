import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from '../components/AdminLayout';

const AdminFiles = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axios.get("https://tuitionapp-yq06.onrender.com/api/files", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFiles(res.data);
      } catch (err) {
        setError("Failed to load files");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [token]);

  const handleDelete = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    
    try {
      await axios.delete(`https://tuitionapp-yq06.onrender.com/api/files/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(files.filter(f => f._id !== fileId));
    } catch (err) {
      console.error('Failed to delete file:', err);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '16px', boxShadow: '0 6px 20px rgba(0,0,0,0.1)' }}>
            <div style={{ 
              width: '50px', height: '50px', border: '4px solid #f3f4f6', 
              borderTop: '4px solid #3b82f6', borderRadius: '50%', 
              animation: 'spin 1s linear infinite', margin: '0 auto 1.5rem'
            }}></div>
            <h3 style={{ fontSize: '1.5rem', color: '#20205c', marginBottom: '0.5rem' }}>Loading Files</h3>
            <p style={{ color: '#666', margin: 0 }}>Please wait while we fetch all files...</p>
          </div>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </AdminLayout>
    );
  }
  
  if (error) {
    return (
      <AdminLayout>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '16px', boxShadow: '0 6px 20px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h3 style={{ fontSize: '1.5rem', color: '#dc2626', marginBottom: '0.5rem' }}>Error Loading Files</h3>
            <p style={{ color: '#666', margin: 0 }}>{error}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
      <h2>All Uploaded Files</h2>
      
      {files.length === 0 ? (
        <p>No files uploaded yet.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5" }}>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Title</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Class</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Uploaded By</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Date</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file._id}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  <a href={`https://tuitionapp-yq06.onrender.com/${file.url}`} target="_blank" rel="noopener noreferrer">
                    {file.title}
                  </a>
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {file.classId?.name || "N/A"}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {file.uploadedBy?.name || "N/A"}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {new Date(file.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  <button 
                    onClick={() => handleDelete(file._id)}
                    style={{ 
                      padding: "5px 10px", 
                      backgroundColor: "#ef4444", 
                      color: "white", 
                      border: "none", 
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      </div>
    </AdminLayout>
  );
};

export default AdminFiles;