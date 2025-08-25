import React, { useState, useEffect } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import "./FileUpload.css"; // make sure this path matches your actual CSS file location

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch classes for this tutor
    const fetchClasses = async () => {
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.id || decoded._id;
        
        const res = await axios.get(`http://localhost:5000/api/classes/tutor/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClasses(res.data);
        if (res.data.length > 0) setSelectedClass(res.data[0]._id);
      } catch (err) {
        console.error("Failed to load classes", err);
      }
    };
    fetchClasses();
  }, [token]);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file || !selectedClass) {
      setMessage("Please select a file and a class.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("classId", selectedClass);

    try {
      await axios.post("http://localhost:5000/api/files", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("File uploaded successfully!");
      setFile(null);
    } catch (err) {
      setMessage("File upload failed.");
      console.error(err);
    }
  };

  return (
    <div className="file-upload-container">
      <h2>Upload Study Material</h2>
      <form className="file-upload-form" onSubmit={onSubmit}>
        <label htmlFor="classSelect">Select Class:</label>
        <select
          id="classSelect"
          value={selectedClass}
          onChange={onClassChange}
          required
        >
          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.name}
            </option>
          ))}
        </select>

        <label htmlFor="fileInput">Choose File:</label>
        <input
          id="fileInput"
          type="file"
          onChange={onFileChange}
          required
        />

        <button type="submit">Upload</button>
      </form>
      {message && (
        <p
          className={
            message.toLowerCase().includes("failed")
              ? "file-upload-error"
              : "file-upload-message"
          }
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default FileUpload;
