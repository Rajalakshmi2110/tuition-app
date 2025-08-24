import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentFiles = () => {
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchClasses() {
      try {
        const res = await axios.get("http://localhost:5000/api/student/enrolled-classes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEnrolledClasses(res.data);
        if (res.data.length > 0) setSelectedClassId(res.data[0]._id);
      } catch (err) {
        setError("Failed to load classes");
      }
    }
    fetchClasses();
  }, [token]);

  useEffect(() => {
    if (!selectedClassId) return;

    async function fetchFiles() {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/files/class/${selectedClassId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFiles(res.data);
      } catch (err) {
        setError("Failed to load files");
      } finally {
        setLoading(false);
      }
    }
    fetchFiles();
  }, [selectedClassId, token]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Study Materials</h2>

      <label>
        Select Class:{" "}
        <select
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
        >
          {enrolledClasses.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.name}
            </option>
          ))}
        </select>
      </label>

      {loading && <p>Loading files...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <ul>
          {files.length === 0 ? (
            <li>No files uploaded for this class yet.</li>
          ) : (
            files.map((file) => (
              <li key={file._id}>
                <a
                  href={`http://localhost:5000/uploads/${file.filename}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {file.originalName}
                </a>{" "}
                <small>({file.uploaderRole})</small>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default StudentFiles;
