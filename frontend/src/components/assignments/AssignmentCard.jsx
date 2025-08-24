import React from "react";

const AssignmentCard = ({ assignment }) => {
  return (
    <div>
      <h3>{assignment.title}</h3>
      <p>{assignment.description}</p>
      <p>Deadline: {new Date(assignment.deadline).toLocaleDateString()}</p>
      {assignment.fileUrl && (
        <a href={assignment.fileUrl} target="_blank" rel="noreferrer">Download File</a>
      )}
    </div>
  );
};

export default AssignmentCard;
