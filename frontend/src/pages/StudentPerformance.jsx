import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentPerformance = () => {
  const [performances, setPerformances] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    examType: '',
    totalMarks: '',
    obtainedMarks: '',
    examDate: '',
    academicYear: '2024-25',
    term: ''
  });

  const subjects = ['Mathematics', 'Science', 'English', 'Social Studies', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Tamil', 'Hindi', 'Sanskrit', 'French', 'German'];
  const examTypes = ['Unit Test', 'Mid Term', 'Final Exam', 'Monthly Test', 'Quarterly', 'Half Yearly'];
  const terms = ['Term 1', 'Term 2', 'Term 3'];

  useEffect(() => {
    fetchPerformances();
  }, []);

  const fetchPerformances = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching performances with token:', token ? 'Token exists' : 'No token');
      
      const response = await axios.get('https://tuitionapp-yq06.onrender.com/api/performance', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Performance response:', response.data);
      setPerformances(response.data);
    } catch (error) {
      console.error('Error fetching performances:', error);
      console.error('Error response:', error.response?.data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      console.log('Submitting performance data:', formData);
      
      const response = await axios.post('https://tuitionapp-yq06.onrender.com/api/performance', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Submit response:', response.data);
      alert('Performance record added successfully!');
      setFormData({
        subject: '', examType: '', totalMarks: '', obtainedMarks: '',
        examDate: '', academicYear: '2024-25', term: ''
      });
      setShowForm(false);
      fetchPerformances();
    } catch (error) {
      alert('Error adding performance record');
      console.error('Submit error:', error);
      console.error('Submit error response:', error.response?.data);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>My Performance Records</h2>
          <button 
            onClick={() => setShowForm(!showForm)}
            style={{
              background: '#007bff', color: 'white', padding: '10px 20px',
              border: 'none', borderRadius: '5px', cursor: 'pointer'
            }}
          >
            {showForm ? 'Cancel' : 'Add New Record'}
          </button>
        </div>

        {showForm && (
          <div style={{ 
            background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' 
          }}>
            <h3>Add Performance Record</h3>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <select name="subject" value={formData.subject} onChange={handleChange} required
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
                <option value="">Select Subject</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>

              <select name="examType" value={formData.examType} onChange={handleChange} required
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
                <option value="">Select Exam Type</option>
                {examTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <input name="totalMarks" type="number" placeholder="Total Marks" 
                value={formData.totalMarks} onChange={handleChange} required
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />

              <input name="obtainedMarks" type="number" placeholder="Obtained Marks"
                value={formData.obtainedMarks} onChange={handleChange} required
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />

              <input name="examDate" type="date" value={formData.examDate} onChange={handleChange} required
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />

              <select name="term" value={formData.term} onChange={handleChange} required
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
                <option value="">Select Term</option>
                {terms.map(term => (
                  <option key={term} value={term}>{term}</option>
                ))}
              </select>

              <button type="submit" style={{
                background: '#28a745', color: 'white', padding: '10px 20px',
                border: 'none', borderRadius: '5px', cursor: 'pointer'
              }}>
                Add Record
              </button>
            </form>
          </div>
        )}

        <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
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
          {performances.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
              No performance records found. Add your first record!
            </div>
          )}
        </div>
    </div>
  );
};

export default StudentPerformance;