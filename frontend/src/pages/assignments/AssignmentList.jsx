import React, { useEffect, useState } from "react";
import axios from "axios";
import AssignmentCard from "../../components/assignments/AssignmentCard";

const AssignmentList = () => {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    axios.get("/api/assignments")
      .then(res => setAssignments(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Assignments</h2>
      {assignments.map(a => (
        <AssignmentCard key={a._id} assignment={a} />
      ))}
    </div>
  );
};

export default AssignmentList;
