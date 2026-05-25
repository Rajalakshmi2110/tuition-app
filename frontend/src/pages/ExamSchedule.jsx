import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ExamSchedule = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subject: '', examDate: '', examTime: '', examType: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchExams = async () => {
    try {
      const res = await api.get('/exam-schedule/my');
      setExams(res.data);
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => { fetchExams(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/exam-schedule', form);
      setForm({ subject: '', examDate: '', examTime: '', examType: '', notes: '' });
      setShowForm(false);
      fetchExams();
    } catch (err) {}
    setSubmitting(false);
  };

  const deleteExam = async (id) => {
    if (!window.confirm('Remove this exam?')) return;
    await api.delete(`/exam-schedule/${id}`);
    setExams(prev => prev.filter(e => e._id !== id));
  };

  const isUpcoming = (date) => new Date(date) >= new Date(new Date().setHours(0, 0, 0, 0));
  const upcoming = exams.filter(e => isUpcoming(e.examDate));
  const past = exams.filter(e => !isUpcoming(e.examDate));

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        padding: '1.5rem 2rem', borderRadius: '20px', color: 'white', marginBottom: '1.5rem',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-50%', right: '-10%', width: '250px', height: '250px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.25rem 0' }}>Exam Schedule</h1>
            <p style={{ fontSize: '0.9rem', opacity: 0.85, margin: 0 }}>Track your school exams — tutors & admin will be notified</p>
          </div>
          <button onClick={() => setShowForm(true)} style={{
            background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.4)',
            color: 'white', padding: '0.5rem 1.25rem', borderRadius: '10px',
            cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem'
          }}>+ Add Exam</button>
        </div>
      </div>

      {/* Upcoming Exams */}
      {upcoming.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 1rem 0' }}>
            Upcoming Exams ({upcoming.length})
          </h2>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {upcoming.map(exam => {
              const daysLeft = Math.ceil((new Date(exam.examDate) - new Date()) / (1000 * 60 * 60 * 24));
              return (
                <div key={exam._id} style={{
                  background: 'var(--bg-primary)', borderRadius: '12px', padding: '1.25rem',
                  border: daysLeft <= 1 ? '2px solid #ef4444' : '1px solid var(--border-light)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '12px',
                      background: daysLeft <= 1 ? 'var(--bg-urgent, #fef2f2)' : 'var(--bg-warning, #fef3c7)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 600, color: daysLeft <= 1 ? '#dc2626' : '#d97706' }}>
                        {new Date(exam.examDate).toLocaleDateString('en-IN', { month: 'short' })}
                      </span>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: daysLeft <= 1 ? '#dc2626' : '#d97706' }}>
                        {new Date(exam.examDate).getDate()}
                      </span>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-primary)' }}>{exam.subject} — {exam.examType}</p>
                      <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {exam.examTime} • {daysLeft === 0 ? 'Today!' : daysLeft === 1 ? 'Tomorrow!' : `${daysLeft} days left`}
                      </p>
                      {exam.notes && <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--text-light)' }}>{exam.notes}</p>}
                    </div>
                  </div>
                  <button onClick={() => deleteExam(exam._id)} style={{
                    background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', fontSize: '1.2rem'
                  }}>×</button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Past Exams */}
      {past.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-muted)', margin: '0 0 1rem 0' }}>
            Past Exams ({past.length})
          </h2>
          <div style={{ display: 'grid', gap: '0.5rem', opacity: 0.6 }}>
            {past.slice(0, 5).map(exam => (
              <div key={exam._id} style={{
                background: 'var(--bg-secondary)', borderRadius: '10px', padding: '0.75rem 1rem',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {exam.subject} — {exam.examType}
                </span>
                <span style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>
                  {new Date(exam.examDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && exams.length === 0 && !showForm && (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-primary)', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
          <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</p>
          <h3 style={{ color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>No Exams Scheduled</h3>
          <p style={{ color: 'var(--text-muted)', margin: '0 0 1rem 0', fontSize: '0.9rem' }}>Add your school exam dates so tutors can help you prepare</p>
          <button onClick={() => setShowForm(true)} style={{
            padding: '0.6rem 1.5rem', background: '#f59e0b', color: 'white', border: 'none',
            borderRadius: '10px', cursor: 'pointer', fontWeight: 600
          }}>+ Add Your First Exam</button>
        </div>
      )}

      {/* Add Exam Modal */}
      {showForm && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '1rem'
        }}>
          <div style={{
            background: 'var(--bg-primary)', padding: '2rem', borderRadius: '20px',
            width: '100%', maxWidth: '420px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: 'var(--text-primary)', fontWeight: 700 }}>Add Exam</h3>
              <button onClick={() => setShowForm(false)} style={{ background: 'var(--bg-secondary)', border: 'none', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1rem' }}>×</button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="text" placeholder="Subject (e.g., Maths)" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-light)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.95rem' }} />
              <select value={form.examType} onChange={e => setForm({ ...form, examType: e.target.value })} required style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-light)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                <option value="">Select Exam Type</option>
                <option value="Unit Test">Unit Test</option>
                <option value="Mid Term">Mid Term</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Half Yearly">Half Yearly</option>
                <option value="Annual">Annual</option>
                <option value="Other">Other</option>
              </select>
              <input type="date" value={form.examDate} onChange={e => setForm({ ...form, examDate: e.target.value })} required style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-light)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.95rem' }} />
              <input type="time" value={form.examTime} onChange={e => setForm({ ...form, examTime: e.target.value })} required style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-light)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.95rem' }} />
              <input type="text" placeholder="Notes (optional)" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-light)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.95rem' }} />
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="submit" disabled={submitting} style={{ flex: 1, padding: '0.75rem', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}>
                  {submitting ? 'Adding...' : 'Add Exam'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: '0.75rem', background: 'var(--bg-secondary)', color: 'var(--text-muted)', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamSchedule;
