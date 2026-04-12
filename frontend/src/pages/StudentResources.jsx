import React, { useEffect, useState } from "react";
import api from '../services/api';
import fileUrl from '../config/fileUrl';
import LoadingSpinner from '../components/LoadingSpinner';

const CATEGORIES = ['Textbook / Study Material', 'Guides', 'Class Notes', 'Question Papers', 'Other'];

const StudentResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/resources/student');
        setResources(res.data);
      } catch {
        setError('Failed to load resources');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const subjects = [...new Set(resources.map(r => r.subject))].sort();
  const filtered = resources.filter(r => {
    if (filterSubject !== 'all' && r.subject !== filterSubject) return false;
    if (filterCategory !== 'all' && r.category !== filterCategory) return false;
    return true;
  });

  // Group by subject > category
  const grouped = {};
  filtered.forEach(r => {
    const subjectKey = `Class ${r.classLevel} — ${r.subject}`;
    if (!grouped[subjectKey]) grouped[subjectKey] = {};
    if (!grouped[subjectKey][r.category]) grouped[subjectKey][r.category] = [];
    grouped[subjectKey][r.category].push(r);
  });

  const categoryIcon = (cat) => {
    const icons = {
      'Textbook / Study Material': '📚', 'Guides': '📖', 'Class Notes': '📝',
      'Question Papers': '📄', 'Other': '📎'
    };
    return icons[cat] || '📎';
  };

  if (loading) return <LoadingSpinner message="Loading resources..." />;

  if (error) return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#fef2f2', borderRadius: '16px', border: '2px solid #fecaca' }}>
      <p style={{ color: '#dc2626', fontWeight: 600 }}>{error}</p>
      <button onClick={() => window.location.reload()} style={{
        marginTop: '1rem', padding: '0.5rem 1.5rem', background: '#ef4444', color: 'white',
        border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500
      }}>Try Again</button>
    </div>
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          📖 Study Materials
        </h2>
        <p style={{ color: '#64748b', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
          Study materials, guides, notes & question papers for your subjects
        </p>
      </div>

      {/* Filters */}
      {resources.length > 0 && (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} style={{
            padding: '0.6rem 1rem', border: '2px solid #e2e8f0', borderRadius: '8px',
            fontWeight: 600, fontSize: '0.9rem', color: '#0f172a', cursor: 'pointer', outline: 'none'
          }}>
            <option value="all">All Subjects</option>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{
            padding: '0.6rem 1rem', border: '2px solid #e2e8f0', borderRadius: '8px',
            fontWeight: 600, fontSize: '0.9rem', color: '#0f172a', cursor: 'pointer', outline: 'none'
          }}>
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>
            {filtered.length} resource{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Content */}
      {resources.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📖</div>
          <h3 style={{ color: '#0f172a', fontWeight: 700, marginBottom: '0.5rem' }}>No Resources Available</h3>
          <p style={{ color: '#64748b' }}>Resources will appear here once your tutors upload them for your enrolled subjects</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 2rem', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <p style={{ color: '#64748b' }}>No resources match the selected filters</p>
        </div>
      ) : (
        Object.entries(grouped).sort().map(([subjectKey, categories]) => (
          <div key={subjectKey} style={{ marginBottom: '2rem', background: 'white', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.5rem', background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', borderBottom: '1px solid #bfdbfe' }}>
              <h3 style={{ margin: 0, color: '#1e40af', fontSize: '1.1rem', fontWeight: 700 }}>{subjectKey}</h3>
            </div>
            <div style={{ padding: '1.5rem' }}>
              {CATEGORIES.filter(cat => categories[cat]).map(cat => (
                <div key={cat} style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 0.75rem', color: '#374151', fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {categoryIcon(cat)} {cat} <span style={{ background: '#dbeafe', color: '#1e40af', fontSize: '0.75rem', padding: '0.1rem 0.5rem', borderRadius: '10px', fontWeight: 600, marginLeft: '0.25rem' }}>{categories[cat].length}</span>
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {categories[cat].map(r => (
                      <a
                        key={r._id}
                        href={fileUrl(r.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: '10px',
                          border: '1px solid #e2e8f0', textDecoration: 'none', color: 'inherit',
                          transition: 'all 0.2s ease', gap: '1rem', flexWrap: 'wrap'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#f0fdf4'; e.currentTarget.style.borderColor = '#bbf7d0'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                      >
                        <div style={{ flex: 1, minWidth: '200px' }}>
                          <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.95rem' }}>{r.title}</span>
                          {r.description && <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.85rem' }}>{r.description}</p>}
                          <p style={{ margin: '0.25rem 0 0', color: '#94a3b8', fontSize: '0.8rem' }}>
                            Uploaded by {r.uploadedBy?.name || 'Tutor'} • {new Date(r.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span style={{
                          padding: '0.4rem 0.75rem', background: '#10b981', color: 'white',
                          borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, flexShrink: 0
                        }}>View</span>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default StudentResources;
