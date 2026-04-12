import React, { useEffect, useState } from "react";
import api from '../services/api';
import fileUrl from '../config/fileUrl';
import AdminLayout from '../components/AdminLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../components/Toast';

const CLASS_LEVELS = ['6', '7', '8', '9', '10', '11', '12'];

const AdminResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const toast = useToast();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/resources/all');
        setResources(res.data);
      } catch {
        setError('Failed to load resources');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/resources/${id}`);
      setResources(resources.filter(r => r._id !== id));
      toast.success('Resource deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const subjects = [...new Set(resources.map(r => r.subject))].sort();
  const filtered = resources.filter(r => {
    if (filterLevel !== 'all' && r.classLevel !== filterLevel) return false;
    if (filterSubject !== 'all' && r.subject !== filterSubject) return false;
    return true;
  });

  const categoryIcon = (cat) => {
    const icons = {
      'Textbook / Study Material': '📚', 'Guides': '📖', 'Class Notes': '📝',
      'Question Papers': '📄', 'Other': '📎'
    };
    return icons[cat] || '📎';
  };

  return (
    <AdminLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📖 Study Materials
            </h2>
            <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
              All study materials uploaded by tutors
            </p>
          </div>
          {!loading && !error && resources.length > 0 && (
            <div style={{ padding: '0.5rem 1rem', background: '#f0fdf4', color: '#059669', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600 }}>
              {resources.length} resource{resources.length !== 1 ? 's' : ''} total
            </div>
          )}
        </div>

        {/* Filters */}
        {!loading && !error && resources.length > 0 && (
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)} style={{
              padding: '0.6rem 1rem', border: '2px solid var(--border-light)', borderRadius: '8px',
              fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', cursor: 'pointer', outline: 'none'
            }}>
              <option value="all">All Classes</option>
              {CLASS_LEVELS.map(l => <option key={l} value={l}>Class {l}</option>)}
            </select>
            <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} style={{
              padding: '0.6rem 1rem', border: '2px solid var(--border-light)', borderRadius: '8px',
              fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', cursor: 'pointer', outline: 'none'
            }}>
              <option value="all">All Subjects</option>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>
              {filtered.length} shown
            </span>
          </div>
        )}

        {loading ? (
          <LoadingSpinner message="Loading resources..." fullPage />
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#fef2f2', borderRadius: '16px', border: '2px solid #fecaca' }}>
            <p style={{ color: '#dc2626', fontWeight: 600 }}>{error}</p>
          </div>
        ) : resources.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-primary)', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📖</div>
            <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: '0.5rem' }}>No Resources Yet</h3>
            <p style={{ color: 'var(--text-muted)' }}>Resources uploaded by tutors will appear here</p>
          </div>
        ) : (
          <div style={{ background: 'var(--bg-primary)', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-secondary)' }}>
                    {['Title', 'Class', 'Subject', 'Category', 'Uploaded By', 'Date', 'Actions'].map(h => (
                      <th key={h} style={{
                        padding: '1rem', textAlign: h === 'Actions' ? 'center' : 'left',
                        fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)',
                        textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border-light)'
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr key={r._id} style={{ background: i % 2 === 0 ? 'white' : '#f8fafc' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f0fdf4'}
                      onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'white' : '#f8fafc'}
                    >
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-light)', fontWeight: 600, color: 'var(--text-primary)' }}>{r.title}</td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-light)', color: 'var(--text-secondary)' }}>Class {r.classLevel}</td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-light)', color: 'var(--text-secondary)' }}>{r.subject}</td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-light)', color: 'var(--text-secondary)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          {categoryIcon(r.category)} {r.category}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-light)', color: 'var(--text-secondary)' }}>{r.uploadedBy?.name || 'N/A'}</td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        {new Date(r.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-light)', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          <a href={fileUrl(r.url)} target="_blank" rel="noopener noreferrer" style={{
                            padding: '0.5rem 1rem', background: '#f0fdf4', color: '#059669',
                            border: '2px solid #bbf7d0', borderRadius: '8px', textDecoration: 'none',
                            fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s ease'
                          }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#dcfce7'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#f0fdf4'; }}
                          >View</a>
                          <button onClick={() => handleDelete(r._id)} style={{
                            padding: '0.5rem 1rem', background: 'transparent', color: 'var(--text-light)',
                            border: '2px solid var(--border-light)', borderRadius: '8px', cursor: 'pointer',
                            fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s ease'
                          }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.borderColor = '#fecaca'; e.currentTarget.style.color = '#dc2626'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.color = 'var(--text-light)'; }}
                          >Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminResources;
