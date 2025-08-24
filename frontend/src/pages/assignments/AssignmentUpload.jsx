import React, { useState } from "react";
import axios from "axios";

const AssignmentUpload = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [file, setFile] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("deadline", deadline);
    formData.append("file", file);

    await axios.post("/api/assignments/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    alert("Assignment uploaded!");
  };

  return (
    <form onSubmit={handleUpload}>
      <input type="text" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} required />
      <textarea placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} />
      <input type="date" value={deadline} onChange={(e)=>setDeadline(e.target.value)} required />
      <input type="file" onChange={(e)=>setFile(e.target.files[0])} required />
      <button type="submit">Upload Assignment</button>
    </form>
  );
};

export default AssignmentUpload;
