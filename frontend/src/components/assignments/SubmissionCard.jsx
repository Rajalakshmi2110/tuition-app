import React, { useState } from "react";
import axios from "axios";

const SubmissionCard = ({ assignmentId, submission }) => {
  const [grade, setGrade] = useState(submission.grade || "");
  const [feedback, setFeedback] = useState(submission.feedback || "");

  const handleGrade = async () => {
    try {
      await axios.post(
        `/api/assignments/${assignmentId}/grade/${submission.student._id || submission.student}`,
        { grade, feedback }
      );
      alert("Graded successfully!");
    } catch (err) {
      console.error(err);
      alert("Error grading submission");
    }
  };

  return (
    <div className="submission-card">
      <p><strong>Student:</strong> {submission.student?.name || submission.student}</p>
      <a href={submission.fileUrl} target="_blank" rel="noreferrer">
        View Submission
      </a>
      <p><strong>Submitted At:</strong> {new Date(submission.submittedAt).toLocaleString()}</p>

      <div>
        <input
          type="text"
          placeholder="Grade"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
        />
        <input
          type="text"
          placeholder="Feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <button onClick={handleGrade}>Submit Grade</button>
      </div>
    </div>
  );
};

export default SubmissionCard;
