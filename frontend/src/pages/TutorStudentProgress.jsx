import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';
import LoadingSpinner from '../components/LoadingSpinner';

const TutorStudentProgress = () => {
  const [classesByLevel, setClassesByLevel] = useState({});
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [performances, setPerformances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClassesByLevel();
  }, []);

  const fetchClassesByLevel = async () => {
    try {
      const decoded = jwtDecode(localStorage.getItem('token'));
      const userId = decoded.id || decoded._id;

      const classRes = await api.get(`/classes/tutor/${userId}`);

      const grouped = {};
      classRes.data.forEach(session => {
        if (session.students && session.students.length > 0) {
          session.students.forEach(student => {
            const academicClass = student.className || 'Unknown';
            if (!grouped[academicClass]) {
              grouped[academicClass] = [];
            }
            if (!grouped[academicClass].find(s => s._id === student._id)) {
              grouped[academicClass].push(student);
            }
          });
        }
      });

      setClassesByLevel(grouped);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const fetchStudentPerformance = async (studentId) => {
    try {
      const response = await api.get(`/performance/student/${studentId}`);
      setPerformances(response.data);
    } catch (error) {
      setPerformances([]);
    }
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    fetchStudentPerformance(student._id);
  };

  const handleBackToClasses = () => {
    setSelectedClass(null);
    setSelectedStudent(null);
    setPerformances([]);
  };

  const handleBackToStudents = () => {
    setSelectedStudent(null);
    setPerformances([]);
  };

  const getGradeStyle = (grade) => {
    const styles = {
      'A+': { bg: '#dcfce7', color: '#166534' },
      'A': { bg: '#dbeafe', color: '#1e40af' },
      'B+': { bg: '#fef3c7', color: '#92400e' },
      'B': { bg: '#ffedd5', color: '#c2410c' },
      'C': { bg: '#fee2e2', color: '#991b1b' },
      'D': { bg: '#fee2e2', color: '#991b1b' },
      'F': { bg: '#fee2e2', color: '#991b1b' }
    };
    return styles[grade] || { bg: '#f1f5f9', color: 'var(--text-secondary)' };
  };

  if (loading) {
    return <LoadingSpinner message="Loading student data..." fullPage />;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Breadcrumb Navigation */}
      <div style={{
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.9rem',
        color: 'var(--text-muted)'
      }}>
        <span
          onClick={handleBackToClasses}
          style={{
            cursor: selectedClass ? 'pointer' : 'default',
            color: selectedClass ? '#10b981' : '#64748b',
            fontWeight: selectedClass ? 500 : 400
          }}
        >
          Student Progress
        </span>
        {selectedClass && (
          <>
            <span>›</span>
            <span
              onClick={handleBackToStudents}
              style={{
                cursor: selectedStudent ? 'pointer' : 'default',
                color: selectedStudent ? '#10b981' : '#64748b',
                fontWeight: selectedStudent ? 500 : 400
              }}
            >
              Class {selectedClass}
            </span>
          </>
        )}
        {selectedStudent && (
          <>
            <span>›</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{selectedStudent.name}</span>
          </>
        )}
      </div>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          {selectedStudent ? `${selectedStudent.name}'s Performance` :
            selectedClass ? `Class ${selectedClass} Students` :
              'Student Progress by Class'}
        </h2>
        <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
          {selectedStudent ? 'View detailed performance records' :
            selectedClass ? 'Select a student to view their progress' :
              'Select a class to view enrolled students'}
        </p>
      </div>

      {!selectedClass ? (
        /* Class Level View */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {Object.keys(classesByLevel).length === 0 ? (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '4rem 2rem',
              backgroundColor: 'var(--bg-primary)',
              borderRadius: '16px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
              border: '1px solid var(--border-light)'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem', color: '#10b981' }}>▣</div>
              <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: '0.5rem' }}>No Students Found</h3>
              <p style={{ color: 'var(--text-muted)' }}>No students found in your classes</p>
            </div>
          ) : (
            Object.entries(classesByLevel)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([className, students]) => (
                <div
                  key={className}
                  onClick={() => setSelectedClass(className)}
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    padding: '2rem',
                    borderRadius: '16px',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'center',
                    border: '2px solid var(--border-light)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = '#10b981';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(16, 185, 129, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'var(--border-light)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.05)';
                  }}
                >
                  <div style={{
                    width: '64px',
                    height: '64px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                    fontSize: '1.75rem',
                    boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
                  }}>
                    ▣
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    Class {className}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0 }}>
                    {students.length} student{students.length !== 1 ? 's' : ''}
                  </p>
                  <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#10b981', fontWeight: 600 }}>
                    View students →
                  </div>
                </div>
              ))
          )}
        </div>
      ) : !selectedStudent ? (
        /* Student List View */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem'
        }}>
          {classesByLevel[selectedClass].map((student) => (
            <div
              key={student._id}
              onClick={() => handleStudentSelect(student)}
              style={{
                backgroundColor: 'var(--bg-primary)',
                padding: '1.25rem',
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '2px solid var(--border-light)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#10b981';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-light)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  fontWeight: 700
                }}>
                  {student.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 600 }}>
                    {student.name}
                  </h4>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>{student.email}</p>
                </div>
                <div style={{ color: '#10b981', fontSize: '1.2rem' }}>→</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Performance Details View */
        <div style={{
          background: 'var(--bg-primary)',
          borderRadius: '16px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
          border: '1px solid var(--border-light)',
          overflow: 'hidden'
        }}>
          {performances.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem', color: '#10b981' }}>△</div>
              <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: '0.5rem' }}>
                No Performance Records
              </h3>
              <p style={{ color: 'var(--text-muted)' }}>
                {selectedStudent.name} hasn't added any school exam results yet.
              </p>
            </div>
          ) : (
            <>
              {/* Summary */}
              <div style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                borderBottom: '1px solid #bbf7d0'
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#166534', fontWeight: 700 }}>Performance Summary</h3>
                <p style={{ margin: 0, color: '#16a34a', fontSize: '0.9rem' }}>
                  Total Records: {performances.length} | Average: {(performances.reduce((acc, p) => acc + p.percentage, 0) / performances.length).toFixed(1)}%
                </p>
              </div>

              {/* Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-secondary)' }}>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-light)' }}>Subject</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-light)' }}>Exam Type</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-light)' }}>Marks</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-light)' }}>%</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-light)' }}>Grade</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-light)' }}>Date</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-light)' }}>Term</th>
                    </tr>
                  </thead>
                  <tbody>
                    {performances.map((performance, index) => {
                      const gradeStyle = getGradeStyle(performance.grade);
                      return (
                        <tr
                          key={performance._id}
                          style={{ background: index % 2 === 0 ? 'white' : '#f8fafc' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#f0fdf4'}
                          onMouseLeave={(e) => e.currentTarget.style.background = index % 2 === 0 ? 'white' : '#f8fafc'}
                        >
                          <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-light)', fontWeight: 600, color: 'var(--text-primary)' }}>{performance.subject}</td>
                          <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-light)', color: 'var(--text-secondary)' }}>{performance.examType}</td>
                          <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-light)', color: 'var(--text-secondary)' }}>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{performance.obtainedMarks}</span>/{performance.totalMarks}
                          </td>
                          <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-light)', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {performance.percentage.toFixed(1)}%
                          </td>
                          <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-light)' }}>
                            <span style={{
                              background: gradeStyle.bg,
                              color: gradeStyle.color,
                              padding: '0.25rem 0.75rem',
                              borderRadius: '20px',
                              fontSize: '0.8rem',
                              fontWeight: 700
                            }}>
                              {performance.grade}
                            </span>
                          </td>
                          <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            {new Date(performance.examDate).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-light)', color: 'var(--text-secondary)' }}>{performance.term}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TutorStudentProgress;
