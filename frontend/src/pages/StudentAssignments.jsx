import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';

const StudentAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [activeTab, setActiveTab] = useState('assignments');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionContent, setSubmissionContent] = useState('');
  const [submissionFile, setSubmissionFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchAssignments();
    fetchSubmissions();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await api.get(`/assignments/student`);
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const response = await api.get(`/assignments/submissions`);
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('content', submissionContent);
      if (submissionFile) {
        formData.append('file', submissionFile);
      }

      await api.post(`/assignments/${selectedAssignment._id}/submit`,
        formData,
        {
          headers: {
                        'Content-Type': 'multipart/form-data'
          }
        }
      );

      toast.success(selectedAssignment.isSubmitted ? 'Assignment updated!' : 'Assignment submitted!');
      setSelectedAssignment(null);
      setSubmissionContent('');
      setSubmissionFile(null);
      fetchAssignments();
      fetchSubmissions();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error submitting assignment');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      'Submitted': { bg: '#fef3c7', color: '#92400e', border: '#fbbf24' },
      'Graded': { bg: '#dcfce7', color: '#166534', border: '#22c55e' },
      'Not Submitted': { bg: '#fee2e2', color: '#991b1b', border: '#ef4444' }
    };
    return styles[status] || { bg: '#f1f5f9', color: '#475569', border: '#94a3b8' };
  };

  const getDifficultyStyle = (difficulty) => {
    const styles = {
      'Easy': { bg: '#dcfce7', color: '#166534' },
      'Medium': { bg: '#fef3c7', color: '#92400e' },
      'Hard': { bg: '#fee2e2', color: '#991b1b' }
    };
    return styles[difficulty] || { bg: '#f1f5f9', color: '#475569' };
  };

  if (loading) {
    return <LoadingSpinner message="Loading assignments..." fullPage />;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: '#0f172a',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          My Assignments
        </h2>
        <p style={{ color: '#64748b', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
          View and submit your assignments
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '2rem',
        background: '#f1f5f9',
        padding: '0.5rem',
        borderRadius: '12px',
        width: 'fit-content'
      }}>
        {[
          { id: 'assignments', label: 'Available', count: assignments.length },
          { id: 'submissions', label: 'Submissions', count: submissions.length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === tab.id ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#64748b',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
              transition: 'all 0.2s ease',
              boxShadow: activeTab === tab.id ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none'
            }}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Assignments Tab */}
      {activeTab === 'assignments' && (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {assignments.length === 0 ? (
            <div style={{
              background: 'white',
              padding: '4rem 2rem',
              borderRadius: '16px',
              textAlign: 'center',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem', color: '#10b981' }}>☰</div>
              <h3 style={{ color: '#0f172a', fontWeight: 700, marginBottom: '0.5rem' }}>No Assignments</h3>
              <p style={{ color: '#64748b' }}>No assignments available at the moment.</p>
            </div>
          ) : (
            assignments.map((assignment) => {
              const statusStyle = getStatusStyle(assignment.submissionStatus);
              const diffStyle = getDifficultyStyle(assignment.difficulty);
              return (
                <div
                  key={assignment._id}
                  style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '16px',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                    border: assignment.isOverdue ? '2px solid #ef4444' : '1px solid #e2e8f0',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontWeight: 700, fontSize: '1.1rem' }}>
                        {assignment.title}
                      </h3>
                      <p style={{ color: '#64748b', margin: '0 0 1rem 0', fontSize: '0.9rem', lineHeight: 1.5 }}>
                        {assignment.description}
                      </p>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                        <span style={{
                          backgroundColor: '#dbeafe',
                          color: '#1e40af',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: 500
                        }}>
                          {assignment.subject}
                        </span>
                        <span style={{
                          backgroundColor: '#f0fdf4',
                          color: '#166534',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: 500
                        }}>
                          {assignment.totalPoints} pts
                        </span>
                        <span style={{
                          backgroundColor: diffStyle.bg,
                          color: diffStyle.color,
                          padding: '0.25rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: 500
                        }}>
                          {assignment.difficulty}
                        </span>
                        <span style={{
                          backgroundColor: '#fef3c7',
                          color: '#92400e',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: 500
                        }}>
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      {assignment.instructions && (
                        <div style={{
                          padding: '0.75rem',
                          background: '#f8fafc',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          color: '#475569'
                        }}>
                          <strong>Instructions:</strong> {assignment.instructions}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end', gap: '0.75rem' }}>
                      <span style={{
                        background: statusStyle.bg,
                        color: statusStyle.color,
                        border: `1px solid ${statusStyle.border}`,
                        padding: '0.35rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 600
                      }}>
                        {assignment.submissionStatus}
                      </span>
                      {!assignment.isSubmitted && !assignment.isOverdue && (
                        <button
                          onClick={() => setSelectedAssignment(assignment)}
                          style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                          }}
                        >
                          Submit
                        </button>
                      )}
                      {assignment.isSubmitted && assignment.submissionStatus === 'Submitted' && !assignment.isOverdue && (
                        <button
                          onClick={() => setSelectedAssignment(assignment)}
                          style={{
                            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                            color: '#0f172a',
                            padding: '0.5rem 1rem',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '0.85rem'
                          }}
                        >
                          Update
                        </button>
                      )}
                      {assignment.isOverdue && !assignment.isSubmitted && (
                        <span style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 700 }}>⚠️ OVERDUE</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Submissions Tab */}
      {activeTab === 'submissions' && (
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}>
          {submissions.length === 0 ? (
            <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem', color: '#10b981' }}>✓</div>
              <h3 style={{ color: '#0f172a', fontWeight: 700, marginBottom: '0.5rem' }}>No Submissions Yet</h3>
              <p style={{ color: '#64748b' }}>Submit your first assignment to see it here.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '650px' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.85rem', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>Assignment</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.85rem', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>Subject</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.85rem', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>Submitted</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.85rem', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.85rem', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>Score</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.85rem', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>Feedback</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission, index) => {
                  const statusStyle = getStatusStyle(submission.status);
                  return (
                    <tr
                      key={submission._id}
                      style={{ background: index % 2 === 0 ? 'white' : '#f8fafc' }}
                    >
                      <td style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', fontWeight: 600, color: '#0f172a' }}>
                        {submission.assignmentId?.title}
                      </td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', color: '#475569' }}>
                        {submission.assignmentId?.subject}
                      </td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', color: '#64748b', fontSize: '0.9rem' }}>
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                        <span style={{
                          background: statusStyle.bg,
                          color: statusStyle.color,
                          padding: '0.25rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: 600
                        }}>
                          {submission.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', fontWeight: 600, color: '#0f172a' }}>
                        {submission.pointsEarned !== null
                          ? `${submission.pointsEarned}/${submission.assignmentId?.totalPoints}`
                          : '—'
                        }
                      </td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', color: '#64748b', fontSize: '0.9rem' }}>
                        {submission.feedback || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
          )}
        </div>
      )}

      {/* Submission Modal */}
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
            background: 'white',
            padding: '2rem',
            borderRadius: '20px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '85vh',
            overflow: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ margin: 0, color: '#0f172a', fontWeight: 700 }}>
                {selectedAssignment.isSubmitted ? '✏️ Update' : '📤 Submit'}: {selectedAssignment.title}
              </h3>
              <button
                onClick={() => setSelectedAssignment(null)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  color: '#64748b'
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>
                  Your Solution
                </label>
                <textarea
                  value={submissionContent}
                  onChange={(e) => setSubmissionContent(e.target.value)}
                  placeholder="Enter your assignment solution here..."
                  rows="6"
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>
                  Attach File (Optional)
                </label>
                <input
                  type="file"
                  onChange={(e) => setSubmissionFile(e.target.files[0])}
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box',
                    background: '#f8fafc'
                  }}
                />
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                  Supported: PDF, DOC, DOCX, TXT, JPG, PNG
                </p>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setSelectedAssignment(null)}
                  style={{
                    flex: 1,
                    padding: '0.875rem',
                    borderRadius: '10px',
                    border: '2px solid #e2e8f0',
                    background: 'white',
                    color: '#64748b',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    flex: 1,
                    padding: '0.875rem',
                    borderRadius: '10px',
                    border: 'none',
                    background: submitting ? '#94a3b8' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                    boxShadow: submitting ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  {submitting ? 'Submitting...' : (selectedAssignment.isSubmitted ? 'Update' : 'Submit')}
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
