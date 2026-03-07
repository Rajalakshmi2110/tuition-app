import React, { useEffect, useState } from "react";
import api from "../../services/api";
import AssignmentCard from "../../components/assignments/AssignmentCard";

const AssignmentList = () => {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    api.get("/assignments")
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
