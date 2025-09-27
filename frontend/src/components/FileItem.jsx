import React from 'react';
import API from '../services/api';

const FileItem = ({ file, onDelete }) => {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        await API.delete(`/${file._id}`);
        onDelete(file._id);
      } catch (err) {
        console.error(err);
        alert('Delete failed');
      }
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '5px 0' }}>
      <h4>{file.title}</h4>
      <p>Class: {file.classId.name}</p>
      <p>Uploaded by: {file.uploadedBy.name}</p>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button 
          onClick={() => window.open(`https://tuitionapp-yq06.onrender.com/${file.url.startsWith('/') ? file.url.slice(1) : file.url}`, '_blank', 'noopener,noreferrer')}
          style={{
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          👁️ View
        </button>
        <button 
          onClick={() => window.open(`https://tuitionapp-yq06.onrender.com/${file.url.startsWith('/') ? file.url.slice(1) : file.url}?download=true`, '_blank', 'noopener,noreferrer')}
          style={{
            backgroundColor: '#10b981',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          ⬇️ Download
        </button>
      </div>
      <button onClick={handleDelete} style={{ marginLeft: '10px' }}>Delete</button>
    </div>
  );
};

export default FileItem;
