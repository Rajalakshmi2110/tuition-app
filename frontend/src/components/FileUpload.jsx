import React, { useState, useEffect } from 'react';
import API from '../services/api';
import {jwtDecode} from 'jwt-decode';

const FileUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [classId, setClassId] = useState('');
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return console.error('No token found');

        const decoded = jwtDecode(token);
        const userRole = decoded.role;
        const userId = decoded.id || decoded._id;

        let endpoint;
        if (userRole === 'admin') {
          endpoint = '/classes'; // Admin sees all classes
        } else if (userRole === 'tutor') {
          endpoint = `/classes/tutor/${userId}`; // Tutor sees assigned classes
        }

        const res = await API.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('Fetched classes:', res.data);
        setClasses(res.data);
      } catch (err) {
        console.error('Failed to fetch classes:', err.response?.data || err);
      }
    };

    fetchClasses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title || !classId) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('classId', classId);

    try {
      const token = localStorage.getItem('token');
      const res = await API.post('/files/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload successful:', res.data);
      setFile(null);
      setTitle('');
      setClassId('');
      onUpload(res.data);
    } catch (err) {
      let errorMsg = err.message;
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'object') {
          console.error('Upload error:', err.response.data);
          errorMsg = err.response.data.message || JSON.stringify(err.response.data);
        } else {
          errorMsg = err.response.data;
        }
      }
      console.error('Upload failed:', errorMsg);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <select value={classId} onChange={(e) => setClassId(e.target.value)}>
        <option value="">Select Class</option>
        {classes.map((cls) => (
          <option key={cls._id} value={cls._id}>
            {cls.name} ({cls.subject})
          </option>
        ))}
      </select>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button type="submit">Upload</button>
    </form>
  );
};

export default FileUpload;
