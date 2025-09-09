import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TutorPerformanceAnalytics = () => {
  const [classAnalytics, setClassAnalytics] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classDetails, setClassDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAllClassesAnalytics();
  }, []);

  console.log('Class analytics data:', classAnalytics);

  const fetchAllClassesAnalytics = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tutor-analytics/classes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('API Response:', response.data);
      setClassAnalytics(response.data.classAnalytics || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClassDetails = async (classId) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/tutor-analytics/class/${classId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClassDetails(response.data);
      setSelectedClass(classId);
    } catch (error) {
      console.error('Error fetching class details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      excellent: '#10b981',
      good: '#3b82f6',
      average: '#f59e0b',
      needs_attention: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getTrendIcon = (trend) => {
    const icons = {
      improving: '📈',
      stable: '➡️',
      declining: '📉'
    };
    return icons[trend] || '📊';
  };

  if (loading && !classDetails) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '1.2rem', color: '#666' }}>Loading analytics...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#20205c', marginBottom: '2rem', textAlign: 'center' }}>
        📊 Class Performance Analytics
      </h2>

      {!selectedClass ? (
        <>
          {/* Overview Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎓</div>
              <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6', margin: '0' }}>{classAnalytics.length}</h3>
              <p style={{ color: '#666', margin: '0.25rem 0 0 0' }}>Total Classes</p>
            </div>
            
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</div>
              <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', margin: '0' }}>
                {classAnalytics.reduce((sum, cls) => sum + cls.totalStudents, 0)}
              </h3>
              <p style={{ color: '#666', margin: '0.25rem 0 0 0' }}>Total Students</p>
            </div>
            
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📈</div>
              <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b', margin: '0' }}>
                {classAnalytics.length > 0 ? 
                  Math.round((classAnalytics.reduce((sum, cls) => sum + cls.classAverage, 0) / classAnalytics.length) * 100) / 100 
                  : 0}%
              </h3>
              <p style={{ color: '#666', margin: '0.25rem 0 0 0' }}>Overall Average</p>
            </div>
          </div>

          {/* Classes Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {classAnalytics.map((classData) => (
              <div key={classData.classId} 
                   style={{
                     backgroundColor: 'white',
                     padding: '1.5rem',
                     borderRadius: '12px',
                     boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                     cursor: 'pointer',
                     transition: 'transform 0.3s ease'
                   }}
                   onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                   onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                   onClick={() => fetchClassDetails(classData.classId)}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#20205c', margin: 0 }}>{classData.className}</h3>
                  <span style={{ fontSize: '0.9rem', color: '#666', backgroundColor: '#f3f4f6', padding: '0.25rem 0.5rem', borderRadius: '12px' }}>
                    {classData.subject}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>{classData.totalStudents}</div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>Students</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>{classData.classAverage}%</div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>Class Average</div>
                  </div>
                </div>

                {/* Performance Distribution */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: '#20205c' }}>Performance Distribution:</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', fontSize: '0.8rem' }}>
                    <div style={{ textAlign: 'center', color: getStatusColor('excellent') }}>
                      <div style={{ fontWeight: 'bold' }}>{classData.statusCounts.excellent}</div>
                      <div>Excellent</div>
                    </div>
                    <div style={{ textAlign: 'center', color: getStatusColor('good') }}>
                      <div style={{ fontWeight: 'bold' }}>{classData.statusCounts.good}</div>
                      <div>Good</div>
                    </div>
                    <div style={{ textAlign: 'center', color: getStatusColor('average') }}>
                      <div style={{ fontWeight: 'bold' }}>{classData.statusCounts.average}</div>
                      <div>Average</div>
                    </div>
                    <div style={{ textAlign: 'center', color: getStatusColor('needs_attention') }}>
                      <div style={{ fontWeight: 'bold' }}>{classData.statusCounts.needs_attention}</div>
                      <div>At Risk</div>
                    </div>
                  </div>
                </div>

                {/* Subjects Needing Attention */}
                {classData.subjectsNeedingAttention && classData.subjectsNeedingAttention.length > 0 && (
                  <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#fef2f2', borderRadius: '6px', border: '1px solid #fecaca' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#dc2626', marginBottom: '0.5rem' }}>⚠️ Subjects Needing Attention:</div>
                    <div style={{ fontSize: '0.75rem' }}>
                      {classData.subjectsNeedingAttention.slice(0, 3).map((subj, idx) => (
                        <div key={idx} style={{ color: '#991b1b' }}>
                          {subj.subject}: {subj.weakStudents}/{subj.totalStudents} students ({subj.percentage}%)
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ textAlign: 'center', color: '#3b82f6', fontSize: '0.9rem', fontWeight: '600' }}>
                  Click for detailed analysis →
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        // Detailed Class View
        <div>
          <button 
            onClick={() => {setSelectedClass(null); setClassDetails(null);}}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              marginBottom: '2rem'
            }}
          >
            ← Back to All Classes
          </button>

          {classDetails && (
            <>
              {/* Class Header */}
              <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#20205c', margin: '0 0 1rem 0' }}>
                  {classDetails.classInfo.name} - {classDetails.classInfo.subject}
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>{classDetails.classInfo.totalStudents}</div>
                    <div style={{ color: '#666' }}>Total Students</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>{classDetails.classSummary.classAverage}%</div>
                    <div style={{ color: '#666' }}>Class Average</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>{classDetails.classSummary.trendCounts.improving}</div>
                    <div style={{ color: '#666' }}>Improving</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>{classDetails.classSummary.trendCounts.declining}</div>
                    <div style={{ color: '#666' }}>Declining</div>
                  </div>
                </div>
              </div>

              {/* Student Performance Table */}
              <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <h4 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#20205c', marginBottom: '1.5rem' }}>Individual Student Performance</h4>
                
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc' }}>
                        <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Student</th>
                        <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #e5e7eb' }}>Average</th>
                        <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #e5e7eb' }}>Exams</th>
                        <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #e5e7eb' }}>Assignments</th>
                        <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #e5e7eb' }}>Trend</th>
                        <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #e5e7eb' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classDetails.studentAnalytics.map((student, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ fontWeight: '600', color: '#20205c' }}>{student.name}</div>
                            <div style={{ fontSize: '0.8rem', color: '#666' }}>{student.className}</div>
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 'bold', color: getStatusColor(student.status) }}>
                            {student.avgScore}%
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'center' }}>{student.totalExams}</td>
                          <td style={{ padding: '1rem', textAlign: 'center' }}>{student.totalAssignments}</td>
                          <td style={{ padding: '1rem', textAlign: 'center' }}>
                            <span style={{ fontSize: '1.2rem' }}>{getTrendIcon(student.trend)}</span>
                            <div style={{ fontSize: '0.8rem', color: '#666', textTransform: 'capitalize' }}>{student.trend}</div>
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'center' }}>
                            <span style={{
                              padding: '0.25rem 0.75rem',
                              borderRadius: '12px',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              backgroundColor: getStatusColor(student.status),
                              color: 'white',
                              textTransform: 'capitalize'
                            }}>
                              {student.status.replace('_', ' ')}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TutorPerformanceAnalytics;