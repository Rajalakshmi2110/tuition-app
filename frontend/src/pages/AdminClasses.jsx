import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';

const AdminClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5000/api/classes', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClasses(res.data);
      } catch (err) {
        console.error('Error fetching sessions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  if (loading) return (
    <AdminLayout>
      <div style={{ textAlign: 'center', padding: '2rem' }}>Loading sessions...</div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#20205c', marginBottom: '2rem' }}>
          All Tuition Sessions
        </h1>

        {classes.length === 0 ? (
          <div style={{ 
            backgroundColor: 'white', 
            padding: '3rem', 
            borderRadius: '16px', 
            textAlign: 'center',
            boxShadow: '0 6px 20px rgba(0,0,0,0.1)'
          }}>
            <p style={{ color: '#666', fontSize: '1.2rem' }}>No sessions created yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {classes.map((cls) => (
              <div key={cls._id} style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '16px',
                boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#20205c', fontSize: '1.5rem' }}>{cls.name}</h3>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                      <span style={{ 
                        backgroundColor: '#dbeafe', 
                        color: '#1e40af', 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '20px', 
                        fontSize: '0.9rem',
                        fontWeight: '500'
                      }}>
                        📚 {cls.subject}
                      </span>
                      <span style={{ 
                        backgroundColor: '#dcfce7', 
                        color: '#166534', 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '20px', 
                        fontSize: '0.9rem',
                        fontWeight: '500'
                      }}>
                        🎓 Grade {cls.classLevel}
                      </span>
                      <span style={{ 
                        backgroundColor: '#fef3c7', 
                        color: '#92400e', 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '20px', 
                        fontSize: '0.9rem',
                        fontWeight: '500'
                      }}>
                        📅 {cls.schedule}
                      </span>
                    </div>
                  </div>
                  <div style={{ 
                    backgroundColor: cls.status === 'completed' ? '#fee2e2' : '#fef3c7',
                    color: cls.status === 'completed' ? '#dc2626' : '#92400e',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}>
                    {cls.status === 'completed' ? '✅ Completed' : '📋 Scheduled'}
                  </div>
                </div>

                <div style={{ 
                  backgroundColor: '#f8fafc', 
                  padding: '1rem', 
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151', fontSize: '1.1rem' }}>👨🏫 Assigned Tutor</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: '#10b981',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold'
                    }}>
                      {cls.tutor?.name?.charAt(0) || 'N'}
                    </div>
                    <div>
                      <p style={{ margin: '0', fontWeight: '600', color: '#111827' }}>
                        {cls.tutor?.name || 'No tutor assigned'}
                      </p>
                      <p style={{ margin: '0', fontSize: '0.9rem', color: '#6b7280' }}>
                        {cls.tutor?.email || 'No email available'}
                      </p>
                    </div>
                  </div>
                </div>

                {cls.scheduledDate && (
                  <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#6b7280' }}>
                    📅 Scheduled for: {new Date(cls.scheduledDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminClasses;