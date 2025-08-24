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
        const res = await axios.get("http://localhost:5000/api/files", {
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
      await axios.delete(`http://localhost:5000/api/files/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(files.filter(f => f._id !== fileId));
      alert("File deleted successfully");
    } catch (err) {
      alert("Failed to delete file");
      console.error(err);
    }
  };

  if (loading) return <p>Loading files...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

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
                  <a href={`http://localhost:5000/${file.url}`} target="_blank" rel="noopener noreferrer">
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