import React, { useEffect, useState, useCallback } from "react";
import api from '../services/api';
import { useToast } from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';

const CATEGORIES = ['Textbook / Study Material', 'Guides', 'Class Notes', 'Question Papers', 'Other'];
const CLASS_LEVELS = ['6', '7', '8', '9', '10', '11', '12'];
const SUBJECTS_BY_CLASS = {
  '6': ['Tamil', 'English', 'Maths', 'Science', 'Social Science'],
  '7': ['Tamil', 'English', 'Maths', 'Science', 'Social Science'],
  '8': ['Tamil', 'English', 'Maths', 'Physics', 'Chemistry', 'Biology', 'Social Science'],
  '9': ['Tamil', 'English', 'Maths', 'Physics', 'Chemistry', 'Biology', 'Social Science'],
  '10': ['Tamil', 'English', 'Maths', 'Physics', 'Chemistry', 'Biology', 'Social Science'],
  '11': ['Tamil', 'English', 'Maths', 'Physics', 'Chemistry', 'Computer Science', 'Biology', 'Accountancy', 'Commerce', 'Economics', 'Business Maths'],
  '12': ['Tamil', 'English', 'Maths', 'Physics', 'Chemistry', 'Computer Science', 'Biology', 'Accountancy', 'Commerce', 'Economics', 'Business Maths'],
};

const TutorResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', classLevel: '', subject: '', category: '', file: null
  });
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const toast = useToast();

  const fetchResources = useCallback(async () => {
    try {
      const res = await api.get('/resources/my');
      setResources(res.data);
    } catch {
      toast.error('Failed to load resources');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchResources(); }, [fetchResources]);

  const resetForm = () => {
    setFormData({ title: '', description: '', classLevel: '', subject: '', category: '', file: null });
    setEditingResource(null);
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      if (editingResource) {
        const { title, description, classLevel, subject, category } = formData;
        await api.put(`/resources/${editingResource._id}`, { title, description, classLevel, subject, category });
        toast.success('Resource updated');
      } else {
        if (!formData.file) { toast.error('Please select a file'); setUploading(false); return; }
        const fd = new FormData();
        fd.append('file', formData.file);
        fd.append('title', formData.title);
        fd.append('description', formData.description);
        fd.append('classLevel', formData.classLevel);
        fd.append('subject', formData.subject);
        fd.append('category', formData.category);
        await api.post('/resources', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Resource uploaded');
      }
      resetForm();
      fetchResources();
    } catch {
      toast.error(editingResource ? 'Failed to update' : 'Failed to upload');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (r) => {
    setEditingResource(r);
    setFormData({ title: r.title, description: r.description || '', classLevel: r.classLevel, subject: r.subject, category: r.category, file: null });
    setShowModal(true);
  };

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

  // Group by classLevel > subject > category
  const grouped = {};
  filtered.forEach(r => {
    const key = `Class ${r.classLevel} — ${r.subject}`;
    if (!grouped[key]) grouped[key] = {};
    if (!grouped[key][r.category]) grouped[key][r.category] = [];
    grouped[key][r.category].push(r);
  });

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem', fontSize: '0.95rem',
    border: '2px solid #e2e8f0', borderRadius: '10px', outline: 'none',
    transition: 'all 0.2s ease', boxSizing: 'border-box'
  };

  const categoryIcon = (cat) => {
    const icons = {
      'Textbook / Study Material': '📚', 'Guides': '📖', 'Class Notes': '📝',
      'Question Papers': '📄', 'Other': '📎'
    };
    return icons[cat] || '📎';
  };

  if (loading) return <LoadingSpinner message="Loading resources..." />;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            📖 Resource Library
          </h2>
          <p style={{ color: '#64748b', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
            Upload study materials organized by class, subject & category
          </p>
        </div>
        <button onClick={() => { resetForm(); setShowModal(true); }} style={{
          padding: '0.875rem 1.5rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600,
          fontSize: '0.95rem', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
          display: 'flex', alignItems: 'center', gap: '0.5rem'
        }}>
          + Upload Resource
        </button>
      </div>

      {/* Filters */}
      {resources.length > 0 && (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)} style={{
            padding: '0.6rem 1rem', border: '2px solid #e2e8f0', borderRadius: '8px',
            fontWeight: 600, fontSize: '0.9rem', color: '#0f172a', cursor: 'pointer', outline: 'none'
          }}>
            <option value="all">All Classes</option>
            {CLASS_LEVELS.map(l => <option key={l} value={l}>Class {l}</option>)}
          </select>
          <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} style={{
            padding: '0.6rem 1rem', border: '2px solid #e2e8f0', borderRadius: '8px',
            fontWeight: 600, fontSize: '0.9rem', color: '#0f172a', cursor: 'pointer', outline: 'none'
          }}>
            <option value="all">All Subjects</option>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
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
          <h3 style={{ color: '#0f172a', fontWeight: 700, marginBottom: '0.5rem' }}>No Resources Yet</h3>
          <p style={{ color: '#64748b' }}>Upload your first study material to get started</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 2rem', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <p style={{ color: '#64748b' }}>No resources match the selected filters</p>
        </div>
      ) : (
        Object.entries(grouped).sort().map(([groupKey, categories]) => (
          <div key={groupKey} style={{ marginBottom: '2rem', background: 'white', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.5rem', background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', borderBottom: '1px solid #bbf7d0' }}>
              <h3 style={{ margin: 0, color: '#166534', fontSize: '1.1rem', fontWeight: 700 }}>{groupKey}</h3>
            </div>
            <div style={{ padding: '1.5rem' }}>
              {CATEGORIES.filter(cat => categories[cat]).map(cat => (
                <div key={cat} style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 0.75rem', color: '#374151', fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {categoryIcon(cat)} {cat} ({categories[cat].length})
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {categories[cat].map(r => (
                      <div key={r._id} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: '10px',
                        border: '1px solid #e2e8f0', gap: '1rem', flexWrap: 'wrap'
                      }}>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                          <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.95rem' }}>{r.title}</span>
                          {r.description && <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.85rem' }}>{r.description}</p>}
                          <p style={{ margin: '0.25rem 0 0', color: '#94a3b8', fontSize: '0.8rem' }}>
                            {new Date(r.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                          <button onClick={() => handleEdit(r)} style={{
                            padding: '0.4rem 0.75rem', background: '#f0f9ff', color: '#0284c7',
                            border: '1px solid #bae6fd', borderRadius: '6px', cursor: 'pointer',
                            fontWeight: 600, fontSize: '0.8rem'
                          }}>Edit</button>
                          <button onClick={() => handleDelete(r._id)} style={{
                            padding: '0.4rem 0.75rem', background: '#fef2f2', color: '#dc2626',
                            border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer',
                            fontWeight: 600, fontSize: '0.8rem'
                          }}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Upload/Edit Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'white', padding: '2rem', borderRadius: '20px',
            maxWidth: '500px', width: '100%', maxHeight: '85vh', overflow: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: '#0f172a', fontWeight: 700, fontSize: '1.25rem' }}>
                {editingResource ? '✏️ Edit Resource' : '📖 Upload Resource'}
              </h3>
              <button onClick={resetForm} style={{
                background: '#f1f5f9', border: 'none', width: '32px', height: '32px',
                borderRadius: '8px', cursor: 'pointer', fontSize: '1.2rem', color: '#64748b',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>×</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label htmlFor="res-class" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>Class Level *</label>
                <select id="res-class" value={formData.classLevel} onChange={e => setFormData({ ...formData, classLevel: e.target.value, subject: '' })} required style={{ ...inputStyle, background: 'white' }}>
                  <option value="">Select class...</option>
                  {CLASS_LEVELS.map(l => <option key={l} value={l}>Class {l}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="res-subject" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>Subject *</label>
                <select id="res-subject" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} required style={{ ...inputStyle, background: 'white' }} disabled={!formData.classLevel}>
                  <option value="">{formData.classLevel ? 'Select subject...' : 'Select class first'}</option>
                  {(SUBJECTS_BY_CLASS[formData.classLevel] || []).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="res-category" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>Category *</label>
                <select id="res-category" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required style={{ ...inputStyle, background: 'white' }}>
                  <option value="">Select category...</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="res-title" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>Title *</label>
                <input id="res-title" type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Chapter 5 - Light" required style={inputStyle} />
              </div>

              <div>
                <label htmlFor="res-desc" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>Description (Optional)</label>
                <input id="res-desc" type="text" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Brief description..." style={inputStyle} />
              </div>

              {!editingResource && (
                <div>
                  <label htmlFor="res-file" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>File *</label>
                  <input id="res-file" type="file" onChange={e => setFormData({ ...formData, file: e.target.files[0] })} required style={{ ...inputStyle, padding: '0.5rem', background: '#f8fafc' }} />
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={resetForm} style={{
                  flex: 1, padding: '0.875rem', borderRadius: '10px', border: '2px solid #e2e8f0',
                  background: 'white', color: '#64748b', cursor: 'pointer', fontWeight: 600
                }}>Cancel</button>
                <button type="submit" disabled={uploading} style={{
                  flex: 1, padding: '0.875rem', borderRadius: '10px', border: 'none',
                  background: uploading ? '#94a3b8' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white', cursor: uploading ? 'not-allowed' : 'pointer', fontWeight: 600,
                  boxShadow: uploading ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.3)'
                }}>
                  {uploading ? 'Saving...' : (editingResource ? 'Update' : 'Upload')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorResources;
