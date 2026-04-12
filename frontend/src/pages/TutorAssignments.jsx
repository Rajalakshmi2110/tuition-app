import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { CLASS_LEVELS, SUBJECTS_BY_CLASS } from '../constants/academic';

const TutorAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [gradeInputs, setGradeInputs] = useState({});
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '', description: '', subject: '', className: '', totalPoints: 100,
    difficulty: 'Medium', dueDate: '', instructions: ''
  });
  const toast = useToast();
  const difficulties = ['Easy', 'Medium', 'Hard'];

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await api.get(`/assignments/tutor`);
      setAssignments(response.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async (assignmentId) => {
    try {
      const response = await api.get(`/assignments/${assignmentId}/submissions`);
      setSubmissions(response.data.submissions);
    } catch (error) {
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/assignments`, formData);

      toast.success('Assignment created successfully!');
      setFormData({
        title: '', description: '', subject: '', className: '', totalPoints: 100,
        difficulty: 'Medium', dueDate: '', instructions: ''
      });
      setShowForm(false);
      fetchAssignments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating assignment');
    }
  };

  const handleGrade = async (submissionId, pointsEarned, feedback) => {
    try {
      await api.put(`/assignments/submissions/${submissionId}/grade`,
        { pointsEarned, feedback }
      );

      toast.success('Assignment graded successfully!');
      fetchSubmissions(selectedAssignment._id);
    } catch (error) {
      toast.error('Error grading assignment');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    fontSize: '0.95rem',
    border: '2px solid var(--border-light)',
    borderRadius: '10px',
    outline: 'none',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box'
  };

  if (loading) {
    return <LoadingSpinner message="Loading assignments..." fullPage />;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            My Assignments
          </h2>
          <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
            Create and manage assignments for your students
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '0.875rem 1.5rem',
            background: showForm ? '#f1f5f9' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: showForm ? 'var(--text-muted)' : 'white',
            border: showForm ? '2px solid #e2e8f0' : 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.95rem',
            boxShadow: showForm ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          {showForm ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              Cancel
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              Create Assignment
            </>
          )}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div style={{
          background: 'var(--bg-primary)',
          padding: '2rem',
          borderRadius: '16px',
          marginBottom: '2rem',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
          border: '1px solid var(--border-light)'
        }}>
          <h3 style={{ margin: '0 0 1.5rem', color: 'var(--text-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="12" y1="18" x2="12" y2="12"></line>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
            Create New Assignment
          </h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
            <input
              name="title"
              placeholder="Assignment Title"
              value={formData.title}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <textarea
              name="description"
              placeholder="Assignment Description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="3"
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              <select name="className" value={formData.className} onChange={e => setFormData({ ...formData, className: e.target.value, subject: '' })} required style={{ ...inputStyle, background: 'var(--bg-primary)' }}>
                <option value="">Select Class</option>
                {CLASS_LEVELS.map(l => <option key={l} value={l}>Class {l}</option>)}
              </select>

              <select name="subject" value={formData.subject} onChange={handleChange} required disabled={!formData.className} style={{ ...inputStyle, background: formData.className ? 'white' : '#f1f5f9', cursor: formData.className ? 'pointer' : 'not-allowed' }}>
                <option value="">{formData.className ? 'Select Subject' : 'Select class first'}</option>
                {formData.className && SUBJECTS_BY_CLASS[formData.className]?.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              <input
                name="totalPoints"
                type="number"
                placeholder="Total Points"
                value={formData.totalPoints}
                onChange={handleChange}
                required
                style={inputStyle}
              />

              <select name="difficulty" value={formData.difficulty} onChange={handleChange} style={{ ...inputStyle, background: 'var(--bg-primary)' }}>
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>

              <input
                name="dueDate"
                type="datetime-local"
                value={formData.dueDate}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <textarea
              name="instructions"
              placeholder="Special Instructions (Optional)"
              value={formData.instructions}
              onChange={handleChange}
              rows="2"
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
            />

            <button
              type="submit"
              style={{
                padding: '1rem',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '1rem',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Create Assignment
            </button>
          </form>
        </div>
      )}

      {/* Assignments List */}
      <div style={{ display: 'grid', gap: '1rem' }}>
        {assignments.length === 0 ? (
          <div style={{
            background: 'var(--bg-primary)',
            padding: '4rem 2rem',
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
            border: '1px solid var(--border-light)'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #10b98120 0%, #05966920 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
            </div>
            <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: '0.5rem' }}>No Assignments Yet</h3>
            <p style={{ color: 'var(--text-muted)' }}>Create your first assignment to get started!</p>
          </div>
        ) : (
          assignments.map((assignment) => (
            <div
              key={assignment._id}
              style={{
                background: 'var(--bg-primary)',
                padding: '1.5rem',
                borderRadius: '16px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                border: '1px solid var(--border-light)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)', fontWeight: 700 }}>{assignment.title}</h3>
                  <p style={{ color: 'var(--text-muted)', margin: '0 0 1rem 0', fontSize: '0.9rem' }}>{assignment.description}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                    <span style={{ backgroundColor: '#dbeafe', color: '#1e40af', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 500 }}>
                      {assignment.subject}
                    </span>
                    <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 500 }}>
                      Class {assignment.className}
                    </span>
                    <span style={{ backgroundColor: '#f0fdf4', color: '#166534', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 500 }}>
                      {assignment.totalPoints} pts
                    </span>
                    <span style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 500 }}>
                      {new Date(assignment.dueDate).toLocaleString()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
                    <span style={{ color: '#3b82f6' }}>{assignment.submissionCount} submissions</span>
                    <span style={{ color: '#10b981' }}>{assignment.gradedCount} graded</span>
                    <span style={{ color: '#fbbf24' }}>{assignment.pendingGrading} pending</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedAssignment(assignment);
                    fetchSubmissions(assignment._id);
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.85rem'
                  }}
                >
                  View Submissions
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Submissions Modal */}
      {selectedAssignment && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: 'var(--bg-primary)',
            padding: '2rem',
            borderRadius: '20px',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '85vh',
            overflow: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: 'var(--text-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                </svg>
                Submissions: {selectedAssignment.title}
              </h3>
              <button
                onClick={() => setSelectedAssignment(null)}
                style={{
                  background: 'var(--bg-secondary)',
                  border: 'none',
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#fee2e2';
                  e.currentTarget.style.color = '#dc2626';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f1f5f9';
                  e.currentTarget.style.color = '#64748b';
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {submissions.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div style={{
                  width: '70px',
                  height: '70px',
                  background: 'linear-gradient(135deg, #fbbf2420 0%, #f59e0b20 100%)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem'
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-6l-2 3h-4l-2-3H2"></path>
                    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
                  </svg>
                </div>
                <p>No submissions yet for this assignment.</p>
              </div>
            ) : (
              submissions.map((submission) => (
                <div
                  key={submission._id}
                  style={{
                    border: '1px solid var(--border-light)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    marginBottom: '1rem',
                    background: 'var(--bg-secondary)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>{submission.studentId?.name}</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Submitted: {new Date(submission.submittedAt).toLocaleString()}
                        {submission.isLate && <span style={{ color: '#ef4444', marginLeft: '0.5rem', fontWeight: 600 }}>LATE</span>}
                      </div>
                    </div>
                    <span style={{
                      background: submission.status === 'Graded' ? '#dcfce7' : '#fef3c7',
                      color: submission.status === 'Graded' ? '#166534' : '#92400e',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}>
                      {submission.status}
                    </span>
                  </div>

                  <div style={{
                    background: 'var(--bg-primary)',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    marginBottom: '0.75rem',
                    border: '1px solid var(--border-light)'
                  }}>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Solution:</strong>
                    <p style={{ margin: '0.25rem 0 0', color: 'var(--text-primary)', fontSize: '0.9rem' }}>{submission.content}</p>
                    {submission.attachments && submission.attachments.length > 0 && (
                      <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {submission.attachments.map((att, idx) => (
                          <a
                            key={idx}
                            href={att.url?.startsWith('http') ? att.url : `${require('../config/apiConfig').default?.BASE_URL || ''}/${att.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                              padding: '0.35rem 0.75rem', background: '#eff6ff', color: '#2563eb',
                              borderRadius: '8px', fontSize: '0.8rem', fontWeight: 500,
                              textDecoration: 'none', border: '1px solid #bfdbfe'
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                            {att.filename || `File ${idx + 1}`}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  {submission.status === 'Submitted' && (
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <input
                        type="number"
                        placeholder="Points"
                        max={selectedAssignment.totalPoints}
                        value={gradeInputs[submission._id]?.points || ''}
                        onChange={e => setGradeInputs({ ...gradeInputs, [submission._id]: { ...gradeInputs[submission._id], points: e.target.value } })}
                        style={{
                          padding: '0.5rem 0.75rem',
                          borderRadius: '8px',
                          border: '2px solid var(--border-light)',
                          width: '100px'
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Feedback"
                        value={gradeInputs[submission._id]?.feedback || ''}
                        onChange={e => setGradeInputs({ ...gradeInputs, [submission._id]: { ...gradeInputs[submission._id], feedback: e.target.value } })}
                        style={{
                          padding: '0.5rem 0.75rem',
                          borderRadius: '8px',
                          border: '2px solid var(--border-light)',
                          flex: 1,
                          minWidth: '150px'
                        }}
                      />
                      <button
                        onClick={() => handleGrade(submission._id, gradeInputs[submission._id]?.points, gradeInputs[submission._id]?.feedback)}
                        style={{
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: 'white',
                          padding: '0.5rem 1rem',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: '0.85rem'
                        }}
                      >
                        Grade
                      </button>
                    </div>
                  )}

                  {submission.status === 'Graded' && (
                    <div style={{
                      background: '#dcfce7',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #bbf7d0'
                    }}>
                      <strong style={{ color: '#166534' }}>Grade:</strong> {submission.pointsEarned}/{selectedAssignment.totalPoints} pts
                      {submission.feedback && (
                        <div style={{ marginTop: '0.25rem', color: '#166534' }}>
                          <strong>Feedback:</strong> {submission.feedback}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorAssignments;
