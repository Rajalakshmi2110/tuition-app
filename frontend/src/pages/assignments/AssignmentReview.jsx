import React, { useEffect, useState } from "react";
import api from "../../services/api";
import SubmissionCard from "../../components/assignments/SubmissionCard";

const AssignmentReview = ({ assignmentId }) => {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await api.get(`/assignments/${assignmentId}`);
        setSubmissions(res.data.submissions || []);
      } catch (err) {
        console.error("Error fetching submissions:", err);
      }
    };
    fetchSubmissions();
  }, [assignmentId]);

  return (
    <div>
      <h2>Submissions</h2>
      {submissions.length > 0 ? (
        submissions.map((sub) => (
          <SubmissionCard
            key={sub._id}
            assignmentId={assignmentId}
            submission={sub}
          />
        ))
      ) : (
        <p>No submissions yet.</p>
      )}
    </div>
  );
};

export default AssignmentReview;
