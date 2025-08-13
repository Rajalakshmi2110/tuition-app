import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("student");
  const [students, setStudents] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = "http://localhost:5000";

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

  useEffect(() => {
    fetchData();
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

  return (
    <div style={{ padding: "24px" }}>
      <style>{`
.tab-container {
  display: flex;
  justify-content: center; /* Center horizontally */
  margin-bottom: 20px;
  border-bottom: 2px solid #e5e7eb;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}
.tab {
  flex: 1;
  text-align: center;
  padding: 10px;
  font-weight: 600;
  cursor: pointer;
  background: #f3f4f6;
  color: #374151;
  border: none;
  transition: all 0.3s;
}
.tab.active {
  background: #2563eb;
  color: white;
  border-radius: 6px 6px 0 0;
}

        .admin-table {
          border-collapse: collapse;
          width: 100%;
          max-width: 800px;
          margin: auto;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .admin-table th, .admin-table td {
          padding: 12px 16px;
          text-align: left;
        }
        .admin-table thead {
          background: #f9fafb;
        }
        .admin-table tbody tr:nth-child(even) {
          background: #f3f4f6;
        }
        .btn {
          padding: 6px 12px;
          font-size: 0.85rem;
          border: none;
          border-radius: 4px;
          margin-right: 6px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn.view { background: #2563eb; color: white; }
        .btn.approve { background: #10b981; color: white; }
        .btn.decline { background: #ef4444; color: white; }
        .btn:hover { opacity: 0.9; }
      `}</style>

      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
        Admin Dashboard
      </h2>

      <div style={{ marginBottom: "20px" }}>
        <Link
          to="/admin/upload"
          style={{
            padding: "8px 14px",
            backgroundColor: "#10b981",
            color: "white",
            borderRadius: "6px",
            textDecoration: "none",
            marginRight: "10px",
            fontWeight: 500
          }}
        >
          📁 Upload Study Materials
        </Link>

        <Link
          to="/admin/create-class"
          style={{
            padding: "8px 14px",
            backgroundColor: "#2563eb",
            color: "white",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: 500
          }}
        >
          ➕ Create New Class
        </Link>
      </div>

      <div className="tab-container">
        <button
          className={`tab ${activeTab === "student" ? "active" : ""}`}
          onClick={() => setActiveTab("student")}
        >
          Students
        </button>
        <button
          className={`tab ${activeTab === "tutor" ? "active" : ""}`}
          onClick={() => setActiveTab("tutor")}
        >
          Tutors
        </button>
      </div>

      {loading && <p>Loading student and tutor data...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              {type === "student" ? <th>Class</th> : <th>Specialization</th>}
              {type === "student" ? <th>Subject</th> : <th>Status</th>}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No {type}s found.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  {type === "student" ? (
                    <>
                      <td>{item.className || "—"}</td>
                      <td>{item.subject || "—"}</td>
                    </>
                  ) : (
                    <>
                      <td>{item.specialization || "—"}</td>
                      <td>{item.status}</td>
                    </>
                  )}
                  <td>
                    <button className="btn view">View</button>
                    {type === "tutor" && item.status === "pending" && (
                      <>
                        <button
                          className="btn approve"
                          onClick={() => approveTutor(item._id)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn decline"
                          onClick={() => declineTutor(item._id)}
                        >
                          Decline
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;
