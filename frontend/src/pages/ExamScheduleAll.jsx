import React, { useState, useEffect } from 'react';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';

const ExamScheduleAllContent = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await api.get('/exam-schedule/all');
        setExams(res.data);
      } catch (err) {}
      setLoading(false);
    };
    fetchExams();
  }, []);

  const filteredExams = filter === 'all' ? exams : exams.filter(e => e.examType === filter);
  const examTypes = ['all', ...new Set(exams.map(e => e.examType))];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Student Exam Schedules
        </h2>
        <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
          Upcoming exams submitted by students
        </p>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {examTypes.map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            style={{
              padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
              background: filter === type ? '#10b981' : 'var(--bg-secondary)',
              color: filter === type ? 'white' : 'var(--text-secondary)',
              fontWeight: 600, fontSize: '0.85rem', textTransform: 'capitalize'
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem' }}>Loading...</p>
      ) : filteredExams.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-primary)', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}></div>
          <h3 style={{ color: 'var(--text-primary)', fontWeight: 700 }}>No Upcoming Exams</h3>
          <p style={{ color: 'var(--text-muted)' }}>Students haven't added any upcoming exams yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {filteredExams.map(exam => (
            <div key={exam._id} style={{
              padding: '1.25rem 1.5rem', background: 'var(--bg-primary)', borderRadius: '12px',
              border: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', flexWrap: 'wrap', gap: '1rem'
            }}>
              <div>
                <h4 style={{ margin: 0, color: 'var(--text-primary)', fontWeight: 700 }}>
                  {exam.subject}
                </h4>
                <p style={{ margin: '0.25rem 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {exam.studentId?.name} — Class {exam.studentId?.className}
                </p>
                {exam.notes && <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{exam.notes}</p>}
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{
                  padding: '0.3rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600,
                  background: 'var(--bg-secondary)', color: 'var(--text-secondary)'
                }}>
                  {exam.examType}
                </span>
                <p style={{ margin: '0.5rem 0 0', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem' }}>
                  {new Date(exam.examDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
                <p style={{ margin: '0.15rem 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {exam.examTime}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Wrapper that uses AdminLayout when accessed from admin route
const ExamScheduleAll = ({ useAdmin }) => {
  if (useAdmin) {
    return <AdminLayout><ExamScheduleAllContent /></AdminLayout>;
  }
  return <ExamScheduleAllContent />;
};

export default ExamScheduleAll;
