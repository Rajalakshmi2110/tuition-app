import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TutorAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [formData, setFormData] = useState({
    title: '', description: '', subject: '', className: '', totalPoints: 100,
    difficulty: 'Medium', dueDate: '', instructions: ''
  });

  const subjects = ['Mathematics', 'Science', 'English', 'Social Studies', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Tamil', 'Hindi', 'Sanskrit', 'French', 'German'];
  const classes = ['8', '9', '10', '11', '12'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://tuitionapp-yq06.onrender.com/api/assignments/tutor', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const fetchSubmissions = async (assignmentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://tuitionapp-yq06.onrender.com/api/assignments/${assignmentId}/submissions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmissions(response.data.submissions);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://tuitionapp-yq06.onrender.com/api/assignments', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Assignment created successfully!');
      setFormData({
        title: '', description: '', subject: '', className: '', totalPoints: 100,
        difficulty: 'Medium', dueDate: '', instructions: ''
      });
      setShowForm(false);
      fetchAssignments();
    } catch (error) {
      alert('Error creating assignment');
      console.error(error);
    }
  };

  const handleGrade = async (submissionId, pointsEarned, feedback) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://tuitionapp-yq06.onrender.com/api/assignments/submissions/${submissionId}/grade`, 
        { pointsEarned, feedback },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert('Assignment graded successfully!');
      fetchSubmissions(selectedAssignment._id);
    } catch (error) {
      alert('Error grading assignment');
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>My Assignments</h2>
          <button 
            onClick={() => setShowForm(!showForm)}
            style={{
              background: '#007bff', color: 'white', padding: '10px 20px',
              border: 'none', borderRadius: '5px', cursor: 'pointer'
            }}
          >
            {showForm ? 'Cancel' : 'Create New Assignment'}
          </button>
        </div>

        {showForm && (
          <div style={{ 
            background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' 
          }}>
            <h3>Create Assignment</h3>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
              <input name="title" placeholder="Assignment Title" value={formData.title} 
                onChange={handleChange} required
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />

              <textarea name="description" placeholder="Assignment Description" 
                value={formData.description} onChange={handleChange} required
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', height: '80px' }} />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                <select name="subject" value={formData.subject} onChange={handleChange} required
                  style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>

                <select name="className" value={formData.className} onChange={handleChange} required
                  style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls} value={cls}>Class {cls}</option>
                  ))}
                </select>

                <input name="totalPoints" type="number" placeholder="Total Points" 
                  value={formData.totalPoints} onChange={handleChange} required
                  style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />

                <select name="difficulty" value={formData.difficulty} onChange={handleChange}
                  style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
                  {difficulties.map(diff => (
                    <option key={diff} value={diff}>{diff}</option>
                  ))}
                </select>

                <input name="dueDate" type="datetime-local" value={formData.dueDate} 
                  onChange={handleChange} required
                  style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
              </div>

              <textarea name="instructions" placeholder="Special Instructions (Optional)" 
                value={formData.instructions} onChange={handleChange}
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', height: '60px' }} />

              <button type="submit" style={{
                background: '#28a745', color: 'white', padding: '12px 20px',
                border: 'none', borderRadius: '5px', cursor: 'pointer'
              }}>
                Create Assignment
              </button>
            </form>
          </div>
        )}

        <div style={{ display: 'grid', gap: '20px' }}>
          {assignments.map((assignment) => (
            <div key={assignment._id} style={{
              background: 'white', padding: '20px', borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 10px 0' }}>{assignment.title}</h3>
                  <p style={{ color: '#666', margin: '0 0 10px 0' }}>{assignment.description}</p>
                  <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: '#666' }}>
                    <span><strong>Subject:</strong> {assignment.subject}</span>
                    <span><strong>Class:</strong> {assignment.className}</span>
                    <span><strong>Points:</strong> {assignment.totalPoints}</span>
                    <span><strong>Due:</strong> {new Date(assignment.dueDate).toLocaleString()}</span>
                  </div>
                  <div style={{ marginTop: '10px', display: 'flex', gap: '20px', fontSize: '14px' }}>
                    <span style={{ color: '#007bff' }}>
                      <strong>Submissions:</strong> {assignment.submissionCount}
                    </span>
                    <span style={{ color: '#28a745' }}>
                      <strong>Graded:</strong> {assignment.gradedCount}
                    </span>
                    <span style={{ color: '#ffc107' }}>
                      <strong>Pending:</strong> {assignment.pendingGrading}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setSelectedAssignment(assignment);
                    fetchSubmissions(assignment._id);
                  }}
                  style={{
                    background: '#17a2b8', color: 'white', padding: '8px 16px',
                    border: 'none', borderRadius: '4px', cursor: 'pointer'
                  }}
                >
                  View Submissions
                </button>
              </div>
            </div>
          ))}
          {assignments.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
              No assignments created yet. Create your first assignment!
            </div>
          )}
        </div>

        {selectedAssignment && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{
              background: 'white', padding: '30px', borderRadius: '8px',
              maxWidth: '800px', width: '90%', maxHeight: '80vh', overflow: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>Submissions: {selectedAssignment.title}</h3>
                <button 
                  onClick={() => setSelectedAssignment(null)}
                  style={{
                    background: '#6c757d', color: 'white', padding: '8px 16px',
                    border: 'none', borderRadius: '4px', cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>

              {submissions.map((submission) => (
                <div key={submission._id} style={{
                  border: '1px solid #dee2e6', borderRadius: '8px', padding: '15px', marginBottom: '15px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                    <div>
                      <strong>{submission.studentId?.name}</strong>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        Submitted: {new Date(submission.submittedAt).toLocaleString()}
                        {submission.isLate && <span style={{ color: '#dc3545', marginLeft: '10px' }}>LATE</span>}
                      </div>
                    </div>
                    <span style={{
                      background: submission.status === 'Graded' ? '#28a745' : '#ffc107',
                      color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'
                    }}>
                      {submission.status}
                    </span>
                  </div>
                  
                  <div style={{ background: '#f8f9fa', padding: '10px', borderRadius: '4px', marginBottom: '10px' }}>
                    <strong>Solution:</strong>
                    <p style={{ margin: '5px 0 0 0' }}>{submission.content}</p>
                  </div>

                  {submission.status === 'Submitted' && (
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'end' }}>
                      <input 
                        type="number" 
                        placeholder="Points"
                        max={selectedAssignment.totalPoints}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100px' }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const points = e.target.value;
                            const feedback = e.target.nextSibling.value;
                            handleGrade(submission._id, points, feedback);
                          }
                        }}
                      />
                      <input 
                        type="text" 
                        placeholder="Feedback"
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', flex: 1 }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const points = e.target.previousSibling.value;
                            const feedback = e.target.value;
                            handleGrade(submission._id, points, feedback);
                          }
                        }}
                      />
                      <button 
                        onClick={() => {
                          const pointsInput = document.querySelector(`input[type="number"]`);
                          const feedbackInput = document.querySelector(`input[placeholder="Feedback"]`);
                          handleGrade(submission._id, pointsInput.value, feedbackInput.value);
                        }}
                        style={{
                          background: '#28a745', color: 'white', padding: '8px 16px',
                          border: 'none', borderRadius: '4px', cursor: 'pointer'
                        }}
                      >
                        Grade
                      </button>
                    </div>
                  )}

                  {submission.status === 'Graded' && (
                    <div style={{ background: '#d4edda', padding: '10px', borderRadius: '4px' }}>
                      <strong>Grade:</strong> {submission.pointsEarned}/{selectedAssignment.totalPoints} points
                      {submission.feedback && (
                        <div><strong>Feedback:</strong> {submission.feedback}</div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {submissions.length === 0 && (
                <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                  No submissions yet for this assignment.
                </div>
              )}
            </div>
          </div>
        )}
    </div>
  );
};

export default TutorAssignments;