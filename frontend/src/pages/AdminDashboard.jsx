import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = "http://localhost:5000"; 

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchData = async () => {
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
        setError("Failed to load student and tutor data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: "24px" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
        Admin Dashboard
      </h2>

      <Link
        to="/admin/create-class"
        style={{
          display: "inline-block",
          padding: "8px 16px",
          backgroundColor: "#2563eb",
          color: "white",
          borderRadius: "4px",
          textDecoration: "none",
          marginBottom: "24px",
        }}
      >
        Create New Class
      </Link>

      {loading && <p>Loading student and tutor data...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <>
          <section style={{ marginBottom: "32px" }}>
            <h3 style={{ fontSize: "20px", marginBottom: "8px" }}>Students</h3>
            {students.length === 0 ? (
              <p>No students found.</p>
            ) : (
              <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f3f4f6" }}>
                    <th
                      style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}
                    >
                      Name
                    </th>
                    <th
                      style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}
                    >
                      Email
                    </th>
                    <th
                      style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}
                    >
                      Phone
                    </th>
                    <th
                      style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}
                    >
                      Enrolled Classes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((stu) => (
                    <tr key={stu._id} style={{ borderBottom: "1px solid #ddd" }}>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>{stu.name}</td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>{stu.email}</td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>{stu.phone}</td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                        {stu.enrolledClasses?.join(", ") || "None"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          <section>
            <h3 style={{ fontSize: "20px", marginBottom: "8px" }}>Tutors</h3>
            {tutors.length === 0 ? (
              <p>No tutors found.</p>
            ) : (
              <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f3f4f6" }}>
                    <th
                      style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}
                    >
                      Name
                    </th>
                    <th
                      style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}
                    >
                      Email
                    </th>
                    <th
                      style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}
                    >
                      Phone
                    </th>
                    <th
                      style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}
                    >
                      Subjects
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tutors.map((tut) => (
                    <tr key={tut._id} style={{ borderBottom: "1px solid #ddd" }}>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>{tut.name}</td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>{tut.email}</td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>{tut.phone}</td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                        {tut.subjects?.join(", ") || "None"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
