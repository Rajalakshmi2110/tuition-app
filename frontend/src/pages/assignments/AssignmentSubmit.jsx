import React, { useState } from "react";
import axios from "axios";

const AssignmentSubmit = ({ assignmentId }) => {
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    await axios.post(`/api/assignments/${assignmentId}/submit`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    alert("Assignment submitted!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={(e)=>setFile(e.target.files[0])} required />
      <button type="submit">Submit Assignment</button>
    </form>
  );
};

export default AssignmentSubmit;
