import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

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
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      const userId = decoded.id || decoded._id;

      const classRes = await axios.get(`http://localhost:5000/api/classes/tutor/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Classes data:', classRes.data);

      // Group students by their academic class level (8, 9, 10, 11, 12)
      const grouped = {};
      classRes.data.forEach(session => {
        console.log('Session:', session.name, 'Students:', session.students);
        if (session.students && session.students.length > 0) {
          session.students.forEach(student => {
            console.log('Student data:', student);
            // Use student's academic className (8, 9, 10, 11, 12)
            const academicClass = student.className || 'Unknown';
            if (!grouped[academicClass]) {
              grouped[academicClass] = [];
            }
            // Avoid duplicates
            if (!grouped[academicClass].find(s => s._id === student._id)) {
              grouped[academicClass].push(student);
            }
          });
        }
      });

      console.log('Grouped classes:', grouped);

      setClassesByLevel(grouped);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setLoading(false);
    }
  };

  const fetchStudentPerformance = async (studentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/performance/student/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPerformances(response.data);
    } catch (error) {
      console.error('Error fetching student performance:', error);
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

  if (loading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '1.2rem', color: '#666' }}>Loading student data...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Breadcrumb Navigation */}
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#6b7280' }}>
        <span 
          onClick={handleBackToClasses}
          style={{ cursor: selectedClass ? 'pointer' : 'default', color: selectedClass ? '#3b82f6' : '#6b7280' }}
        >
          Student Progress
        </span>
        {selectedClass && (
          <>
            <span>›</span>
            <span 
              onClick={handleBackToStudents}
              style={{ cursor: selectedStudent ? 'pointer' : 'default', color: selectedStudent ? '#3b82f6' : '#6b7280' }}
            >
              Class {selectedClass}
            </span>
          </>
        )}
        {selectedStudent && (
          <>
            <span>›</span>
            <span style={{ color: '#374151', fontWeight: '500' }}>{selectedStudent.name}</span>
          </>
        )}
      </div>

      <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#20205c', marginBottom: '2rem', textAlign: 'center' }}>
        {selectedStudent ? `${selectedStudent.name}'s Performance` : 
         selectedClass ? `Class ${selectedClass} Students` : 
         'Student Progress by Class'}
      </h2>

      {!selectedClass ? (
        /* Class Level View */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {Object.keys(classesByLevel).length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
              <p style={{ fontSize: '1.2rem', color: '#666' }}>No students found in your classes</p>
            </div>
          ) : (
            Object.entries(classesByLevel)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([className, students]) => (
                <div 
                  key={className}
                  onClick={() => setSelectedClass(className)}
                  style={{
                    backgroundColor: 'white',
                    padding: '2rem',
                    borderRadius: '12px',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease',
                    textAlign: 'center',
                    border: '2px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.borderColor = '#3b82f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#20205c', marginBottom: '0.5rem' }}>
                    Class {className}
                  </h3>
                  <p style={{ color: '#666', fontSize: '1rem' }}>
                    {students.length} student{students.length !== 1 ? 's' : ''}
                  </p>
                  <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#3b82f6' }}>
                    Click to view students →
                  </div>
                </div>
              ))
          )}
        </div>
      ) : !selectedStudent ? (
        /* Student List View */
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {classesByLevel[selectedClass].map((student) => (
              <div 
                key={student._id}
                onClick={() => handleStudentSelect(student)}
                style={{
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '2px solid transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ 
                    width: '50px', height: '50px', borderRadius: '50%', 
                    backgroundColor: '#3b82f6', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.2rem', fontWeight: 'bold'
                  }}>
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem 0', color: '#374151', fontSize: '1.1rem' }}>{student.name}</h4>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>{student.email}</p>
                  </div>
                </div>
                <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#3b82f6', textAlign: 'right' }}>
                  View Performance →
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Performance Details View */
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.1)', padding: '2rem' }}>
          {performances.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
              <p style={{ fontSize: '1.2rem' }}>No performance records found for {selectedStudent.name}</p>
              <p>Student hasn't added any school exam results yet.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>Performance Summary</h3>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>
                  Total Records: {performances.length} | 
                  Average: {(performances.reduce((acc, p) => acc + p.percentage, 0) / performances.length).toFixed(1)}%
                </p>
              </div>
              
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8f9fa' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Subject</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Exam Type</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Marks</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Percentage</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Grade</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Date</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Term</th>
                  </tr>
                </thead>
                <tbody>
                  {performances.map((performance) => (
                    <tr key={performance._id}>
                      <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{performance.subject}</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{performance.examType}</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                        {performance.obtainedMarks}/{performance.totalMarks}
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                        {performance.percentage.toFixed(1)}%
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                        <span style={{
                          background: performance.grade === 'A+' ? '#28a745' : performance.grade === 'A' ? '#17a2b8' : 
                                     performance.grade === 'B+' ? '#ffc107' : performance.grade === 'B' ? '#fd7e14' : '#dc3545',
                          color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'
                        }}>
                          {performance.grade}
                        </span>
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                        {new Date(performance.examDate).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{performance.term}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TutorStudentProgress;