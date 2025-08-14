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
    <div style={{ padding: "24px", maxWidth: "900px", margin: "auto" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
        Admin Dashboard
      </h2>

      {/* Action Links */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <Link
          to="/admin/upload"
          style={{
            padding: "10px 16px",
            backgroundColor: "#007bff",
            color: "#fff",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          📁 Upload Study Materials
        </Link>

        <Link
          to="/admin/create-class"
          style={{
            padding: "10px 16px",
            backgroundColor: "#10b981",
            color: "#fff",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          ➕ Create New Class
        </Link>
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
    </div>
  );
};

export default AdminDashboard;
