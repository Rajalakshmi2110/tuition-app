import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [activeTab, setActiveTab] = useState('assignments');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionContent, setSubmissionContent] = useState('');
  const [submissionFile, setSubmissionFile] = useState(null);

  useEffect(() => {
    fetchAssignments();
    fetchSubmissions();
  }, []);

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/assignments/student', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/assignments/submissions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('content', submissionContent);
      if (submissionFile) {
        formData.append('file', submissionFile);
      }
      
      await axios.post(`http://localhost:5000/api/assignments/${selectedAssignment._id}/submit`, 
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          } 
        }
      );
      
      alert(selectedAssignment.isSubmitted ? 'Assignment updated successfully!' : 'Assignment submitted successfully!');
      setSelectedAssignment(null);
      setSubmissionContent('');
      setSubmissionFile(null);
      fetchAssignments();
      fetchSubmissions();
    } catch (error) {
      alert(error.response?.data?.message || 'Error submitting assignment');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Submitted': return '#ffc107';
      case 'Graded': return '#28a745';
      case 'Not Submitted': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2>My Assignments</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <button 
            onClick={() => setActiveTab('assignments')}
            style={{
              background: activeTab === 'assignments' ? '#007bff' : '#f8f9fa',
              color: activeTab === 'assignments' ? 'white' : '#333',
              padding: '10px 20px', border: 'none', borderRadius: '5px 0 0 5px', cursor: 'pointer'
            }}
          >
            Available Assignments
          </button>
          <button 
            onClick={() => setActiveTab('submissions')}
            style={{
              background: activeTab === 'submissions' ? '#007bff' : '#f8f9fa',
              color: activeTab === 'submissions' ? 'white' : '#333',
              padding: '10px 20px', border: 'none', borderRadius: '0 5px 5px 0', cursor: 'pointer'
            }}
          >
            My Submissions
          </button>
        </div>

        {activeTab === 'assignments' && (
          <div style={{ display: 'grid', gap: '20px' }}>
            {assignments.map((assignment) => (
              <div key={assignment._id} style={{
                background: 'white', padding: '20px', borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: assignment.isOverdue ? '2px solid #dc3545' : '1px solid #dee2e6'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{assignment.title}</h3>
                    <p style={{ color: '#666', margin: '0 0 10px 0' }}>{assignment.description}</p>
                    <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: '#666' }}>
                      <span><strong>Subject:</strong> {assignment.subject}</span>
                      <span><strong>Points:</strong> {assignment.totalPoints}</span>
                      <span><strong>Difficulty:</strong> {assignment.difficulty}</span>
                      <span><strong>Due:</strong> {new Date(assignment.dueDate).toLocaleDateString()}</span>
                    </div>
                    {assignment.instructions && (
                      <div style={{ marginTop: '10px', padding: '10px', background: '#f8f9fa', borderRadius: '4px' }}>
                        <strong>Instructions:</strong> {assignment.instructions}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end', gap: '10px' }}>
                    <span style={{
                      background: getStatusColor(assignment.submissionStatus),
                      color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px'
                    }}>
                      {assignment.submissionStatus}
                    </span>
                    {!assignment.isSubmitted && !assignment.isOverdue && (
                      <button 
                        onClick={() => setSelectedAssignment(assignment)}
                        style={{
                          background: '#28a745', color: 'white', padding: '8px 16px',
                          border: 'none', borderRadius: '4px', cursor: 'pointer'
                        }}
                      >
                        Submit Assignment
                      </button>
                    )}
                    {assignment.isSubmitted && assignment.submissionStatus === 'Submitted' && !assignment.isOverdue && (
                      <button 
                        onClick={() => setSelectedAssignment(assignment)}
                        style={{
                          background: '#ffc107', color: 'white', padding: '8px 16px',
                          border: 'none', borderRadius: '4px', cursor: 'pointer'
                        }}
                      >
                        Update Submission
                      </button>
                    )}
                    {assignment.isOverdue && !assignment.isSubmitted && (
                      <span style={{ color: '#dc3545', fontSize: '12px', fontWeight: 'bold' }}>OVERDUE</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {assignments.length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                No assignments available at the moment.
              </div>
            )}
          </div>
        )}

        {activeTab === 'submissions' && (
          <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Assignment</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Subject</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Submitted</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Score</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Feedback</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr key={submission._id}>
                    <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                      {submission.assignmentId?.title}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                      {submission.assignmentId?.subject}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                      {new Date(submission.submittedAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                      <span style={{
                        background: getStatusColor(submission.status),
                        color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'
                      }}>
                        {submission.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                      {submission.pointsEarned !== null 
                        ? `${submission.pointsEarned}/${submission.assignmentId?.totalPoints}`
                        : 'Not graded'
                      }
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                      {submission.feedback || 'No feedback yet'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {submissions.length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                No submissions yet.
              </div>
            )}
          </div>
        )}

        {selectedAssignment && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{
              background: 'white', padding: '30px', borderRadius: '8px',
              maxWidth: '600px', width: '90%', maxHeight: '80vh', overflow: 'auto'
            }}>
              <h3>{selectedAssignment.isSubmitted ? 'Update' : 'Submit'} Assignment: {selectedAssignment.title}</h3>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Text Submission:</label>
                  <textarea
                    value={submissionContent}
                    onChange={(e) => setSubmissionContent(e.target.value)}
                    placeholder="Enter your assignment solution here..."
                    style={{
                      width: '100%', height: '150px', padding: '10px',
                      border: '1px solid #ccc', borderRadius: '4px', resize: 'vertical'
                    }}
                  />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>File Upload (Optional):</label>
                  <input
                    type="file"
                    onChange={(e) => setSubmissionFile(e.target.files[0])}
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                    style={{
                      width: '100%', padding: '8px',
                      border: '1px solid #ccc', borderRadius: '4px'
                    }}
                  />
                  <small style={{ color: '#666', fontSize: '12px' }}>Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG</small>
                </div>
                <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'end' }}>
                  <button 
                    type="button"
                    onClick={() => setSelectedAssignment(null)}
                    style={{
                      background: '#6c757d', color: 'white', padding: '10px 20px',
                      border: 'none', borderRadius: '4px', cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    style={{
                      background: '#28a745', color: 'white', padding: '10px 20px',
                      border: 'none', borderRadius: '4px', cursor: 'pointer'
                    }}
                  >
                    {selectedAssignment.isSubmitted ? 'Update Assignment' : 'Submit Assignment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
    </div>
  );
};

export default StudentAssignments;