import React, { useEffect, useState, useCallback } from "react";
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';
import { useToast } from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("student");
  const [students, setStudents] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const [announcementType, setAnnouncementType] = useState('general');
  const [announcements, setAnnouncements] = useState([]);
  const [selectedClass, setSelectedClass] = useState('all');
  const [stats, setStats] = useState({
    activeStudents: 0,
    expertTutors: 0,
    completedClasses: 0,
    studyMaterials: 0
  });

  const [viewUser, setViewUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const toast = useToast();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [studentsRes, tutorsRes] = await Promise.all([
        api.get(`/admin/students`),
        api.get(`/admin/tutors`),
      ]);
      setStudents(studentsRes.data);
      setTutors(tutorsRes.data);
    } catch (err) {
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAnnouncements = useCallback(async () => {
    try {
      const res = await api.get(`/announcements`);
      setAnnouncements(res.data);
    } catch (err) {
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get(`/admin/stats`);
      setStats(res.data);
    } catch (err) {
    }
  }, []);

  const deleteAnnouncement = async (id) => {
    try {
      await api.delete(`/announcements/${id}`);
      toast.success('Announcement deleted successfully');
      fetchAnnouncements();
    } catch (err) {
      toast.error('Failed to delete announcement');
    }
  };

  useEffect(() => {
    fetchData();
    fetchAnnouncements();
    fetchStats();
  }, [fetchData, fetchAnnouncements, fetchStats]);

  const approveTutor = async (id) => {
    try {
      await api.patch(
        `/admin/tutors/${id}/approve`,
        {}
      );
      toast.success('Tutor approved successfully');
      fetchData();
    } catch (err) {
      toast.error('Failed to approve tutor');
    }
  };

  const declineTutor = async (id) => {
    try {
      await api.patch(
        `/admin/tutors/${id}/decline`,
        {}
      );
      toast.warning('Tutor declined');
      fetchData();
    } catch (err) {
      toast.error('Failed to decline tutor');
    }
  };

  const approveStudent = async (id) => {
    try {
      await api.patch(`/admin/students/${id}/approve`, {});
      toast.success('Student approved successfully');
      fetchData();
    } catch (err) {
      toast.error('Failed to approve student');
    }
  };

  const declineStudent = async (id) => {
    try {
      await api.patch(`/admin/students/${id}/decline`, {});
      toast.warning('Student declined');
      fetchData();
    } catch (err) {
      toast.error('Failed to decline student');
    }
  };

  const confirmDeleteUser = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/admin/${deleteTarget.role}s/${deleteTarget.id}`);
      toast.success(`${deleteTarget.role.charAt(0).toUpperCase() + deleteTarget.role.slice(1)} deleted`);
      fetchData();
      fetchStats();
    } catch {
      toast.error('Failed to delete user');
    } finally {
      setDeleteTarget(null);
    }
  };

  // Filter students by class
  const filteredStudents = selectedClass === 'all' 
    ? students 
    : students.filter(s => s.className === selectedClass);
  
  const data = activeTab === "student" ? filteredStudents : tutors;
  const type = activeTab;

  // Get class counts for badges
  const classCounts = {
    all: students.length,
    '4': students.filter(s => s.className === '4').length,
    '5': students.filter(s => s.className === '5').length,
    '6': students.filter(s => s.className === '6').length,
    '7': students.filter(s => s.className === '7').length,
    '8': students.filter(s => s.className === '8').length,
    '9': students.filter(s => s.className === '9').length,
    '10': students.filter(s => s.className === '10').length,
    '11': students.filter(s => s.className === '11').length,
    '12': students.filter(s => s.className === '12').length,
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/announcements`, {
        title: announcementTitle,
        message: announcementMessage,
        type: announcementType
      });
      toast.success('Announcement posted successfully!');
      setShowAnnouncementForm(false);
      setAnnouncementTitle('');
      setAnnouncementMessage('');
      setAnnouncementType('general');
      fetchAnnouncements();
    } catch (err) {
      toast.error('Failed to post announcement');
    }
  };

  const statCards = [
    { 
      value: stats.activeStudents, 
      label: 'Active Students', 
      color: '#10b981',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    },
    { 
      value: stats.expertTutors, 
      label: 'Expert Tutors', 
      color: '#fbbf24',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
          <path d="M12 14l-1.5 6 1.5-2 1.5 2-1.5-6z" fill="#fbbf24"></path>
        </svg>
      )
    },
    { 
      value: stats.completedClasses, 
      label: 'Classes Conducted', 
      color: '#3b82f6',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
      )
    },
    { 
      value: stats.studyMaterials, 
      label: 'Study Materials', 
      color: '#8b5cf6',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      )
    }
  ];

  const LoadingState = () => (
    <LoadingSpinner message={`Loading ${type} data...`} fullPage />
  );

  return (
    <AdminLayout showAnnouncementForm={showAnnouncementForm} setShowAnnouncementForm={setShowAnnouncementForm}>
      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {statCards.map((stat, index) => (
          <div
            key={index}
            style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '16px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
              border: '1px solid #e2e8f0',
              transition: 'all 0.3s ease',
              cursor: 'default'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.borderColor = stat.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.05)';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 0.5rem 0', fontWeight: 500 }}>
                  {stat.label}
                </p>
                <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {stat.value}
                </h3>
              </div>
              <div style={{
                width: '50px',
                height: '50px',
                background: `${stat.color}15`,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        background: '#f1f5f9',
        padding: '0.5rem',
        borderRadius: '12px',
        width: 'fit-content'
      }}>
        <button
          onClick={() => setActiveTab("student")}
          style={{
            padding: '0.75rem 1.5rem',
            background: activeTab === "student" ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'transparent',
            color: activeTab === "student" ? 'white' : '#64748b',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: activeTab === "student" ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none'
          }}
        >
          Students
        </button>
        <button
          onClick={() => setActiveTab("tutor")}
          style={{
            padding: '0.75rem 1.5rem',
            background: activeTab === "tutor" ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' : 'transparent',
            color: activeTab === "tutor" ? '#0f172a' : '#64748b',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: activeTab === "tutor" ? '0 4px 12px rgba(251, 191, 36, 0.3)' : 'none'
          }}
        >
          Tutors
        </button>
      </div>

      {/* Class Filter - Only show for Students */}
      {activeTab === "student" && !loading && !error && (
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1.5rem',
          alignItems: 'center'
        }}>
          <span style={{ color: '#64748b', fontWeight: 500 }}>Filter by Class:</span>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            style={{
              padding: '0.75rem 1rem',
              paddingRight: '2.5rem',
              background: 'white',
              border: '2px solid #e2e8f0',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '0.95rem',
              color: '#0f172a',
              cursor: 'pointer',
              outline: 'none',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 1rem center',
              minWidth: '180px'
            }}
          >
            <option value="all">All Students · {classCounts.all}</option>
            {['4', '5', '6', '7', '8', '9', '10', '11', '12'].map((cls) => (
              <option key={cls} value={cls}>
                Class {cls} · {classCounts[cls]}
              </option>
            ))}
          </select>
          {selectedClass !== 'all' && (
            <button
              onClick={() => setSelectedClass('all')}
              style={{
                padding: '0.5rem 1rem',
                background: '#f1f5f9',
                color: '#64748b',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 500,
                cursor: 'pointer',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              ✕ Clear
            </button>
          )}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <LoadingState />
      ) : error ? (
        <div style={{
          padding: '2rem',
          background: '#fef2f2',
          borderRadius: '12px',
          border: '2px solid #fecaca',
          textAlign: 'center'
        }}>
          <p style={{ color: '#dc2626', fontWeight: 600 }}>{error}</p>
        </div>
      ) : (
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}>
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0' }}>Name</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0' }}>{type === "student" ? "Class" : "Specialization"}</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                    No {type}s found.
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr
                    key={item._id}
                    style={{
                      background: index % 2 === 0 ? 'white' : '#f8fafc',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f0fdf4'}
                    onMouseLeave={(e) => e.currentTarget.style.background = index % 2 === 0 ? 'white' : '#f8fafc'}
                  >
                    <td style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          background: type === 'student' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '0.85rem'
                        }}>
                          {item.name?.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>{item.name}</span>
                      </div>
                    </td>
                    {type === "student" ? (
                      <>
                        <td style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', color: '#475569' }}>
                          {item.className || "—"}
                          {item.subjects && item.subjects.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.35rem' }}>
                              {item.subjects.map(s => (
                                <span key={s} style={{ background: '#f0fdf4', color: '#059669', padding: '0.15rem 0.5rem', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 600 }}>{s}</span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            background: item.status?.toLowerCase() === 'approved' ? '#dcfce7' : item.status?.toLowerCase() === 'pending' ? '#fef3c7' : '#fee2e2',
                            color: item.status?.toLowerCase() === 'approved' ? '#166534' : item.status?.toLowerCase() === 'pending' ? '#92400e' : '#991b1b'
                          }}>
                            {item.status}
                          </span>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', color: '#475569' }}>{item.specialization || "—"}</td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            background: item.status?.toLowerCase() === 'approved' ? '#dcfce7' : item.status?.toLowerCase() === 'pending' ? '#fef3c7' : '#fee2e2',
                            color: item.status?.toLowerCase() === 'approved' ? '#166534' : item.status?.toLowerCase() === 'pending' ? '#92400e' : '#991b1b'
                          }}>
                            {item.status}
                          </span>
                        </td>
                      </>
                    )}
                    <td style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <button
                          onClick={() => setViewUser(item)}
                          style={{
                            padding: '0.5rem 1rem',
                            background: '#f1f5f9',
                            color: '#475569',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 500,
                            fontSize: '0.85rem',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          View
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ id: item._id, name: item.name, role: item.role })}
                          style={{
                            padding: '0.5rem 1rem',
                            background: 'transparent',
                            color: '#94a3b8',
                            border: '2px solid #e2e8f0',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 500,
                            fontSize: '0.85rem',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.borderColor = '#fecaca'; e.currentTarget.style.color = '#dc2626'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#94a3b8'; }}
                        >
                          Delete
                        </button>
                        {type === "tutor" && item.status?.trim().toLowerCase() === "pending" && (
                          <>
                            <button
                              onClick={() => approveTutor(item._id)}
                              style={{
                                padding: '0.5rem 1rem',
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 500,
                                fontSize: '0.85rem',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => declineTutor(item._id)}
                              style={{
                                padding: '0.5rem 1rem',
                                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 500,
                                fontSize: '0.85rem',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              Decline
                            </button>
                          </>
                        )}
                        {type === "student" && item.status?.trim().toLowerCase() === "pending" && (
                          <>
                            <button
                              onClick={() => approveStudent(item._id)}
                              style={{
                                padding: '0.5rem 1rem',
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 500,
                                fontSize: '0.85rem',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => declineStudent(item._id)}
                              style={{
                                padding: '0.5rem 1rem',
                                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 500,
                                fontSize: '0.85rem',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              Decline
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {/* Current Announcements */}
      {announcements.length > 0 && (
        <div style={{
          marginTop: '2rem',
          background: 'white',
          padding: '1.5rem',
          borderRadius: '16px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ marginBottom: '1rem', color: '#0f172a', fontWeight: 700 }}>
            Current Announcements
          </h3>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {announcements.map((announcement) => {
              const typeStyles = {
                urgent: { bg: '#fef2f2', border: '#ef4444' },
                holiday: { bg: '#f0fdf4', border: '#22c55e' },
                general: { bg: '#f8fafc', border: '#10b981' }
              };
              const style = typeStyles[announcement.type] || typeStyles.general;

              return (
                <div
                  key={announcement._id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    background: style.bg,
                    border: `2px solid ${style.border}`,
                    borderRadius: '10px'
                  }}
                >
                  <div>
                    <strong style={{ color: '#0f172a' }}>{announcement.title}</strong>
                    <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.9rem' }}>{announcement.message}</p>
                  </div>
                  <button
                    onClick={() => deleteAnnouncement(announcement._id)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 500,
                      fontSize: '0.8rem'
                    }}
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Announcement Form Modal */}
      {showAnnouncementForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '20px',
            width: '500px',
            maxWidth: '90%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            animation: 'slideUp 0.3s ease'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: '#0f172a', fontWeight: 700 }}>Post Global Announcement</h3>
              <button
                onClick={() => setShowAnnouncementForm(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#f1f5f9',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  color: '#64748b'
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateAnnouncement}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>Title</label>
                <input
                  type="text"
                  placeholder="Announcement Title"
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    borderRadius: '10px',
                    border: '2px solid #e2e8f0',
                    fontSize: '1rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#10b981';
                    e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>Type</label>
                <select
                  value={announcementType}
                  onChange={(e) => setAnnouncementType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    borderRadius: '10px',
                    border: '2px solid #e2e8f0',
                    fontSize: '1rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    background: 'white'
                  }}
                >
                  <option value="general">General</option>
                  <option value="holiday">Holiday</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>Message</label>
                <textarea
                  placeholder="Announcement Message"
                  value={announcementMessage}
                  onChange={(e) => setAnnouncementMessage(e.target.value)}
                  required
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    borderRadius: '10px',
                    border: '2px solid #e2e8f0',
                    fontSize: '1rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '0.875rem',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  Post Announcement
                </button>
                <button
                  type="button"
                  onClick={() => setShowAnnouncementForm(false)}
                  style={{
                    flex: 1,
                    padding: '0.875rem',
                    background: '#f1f5f9',
                    color: '#64748b',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.95rem'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {viewUser && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'white', padding: '2rem', borderRadius: '20px',
            width: '450px', maxWidth: '90%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            animation: 'slideUp 0.3s ease'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: '#0f172a', fontWeight: 700 }}>
                {viewUser.role === 'tutor' ? 'Tutor' : 'Student'} Details
              </h3>
              <button
                onClick={() => setViewUser(null)}
                style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f1f5f9', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#64748b' }}
              >
                ×
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <div style={{
                  width: '48px', height: '48px',
                  background: viewUser.role === 'student'
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 700, fontSize: '1.2rem'
                }}>
                  {viewUser.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, color: '#0f172a', fontSize: '1.1rem' }}>{viewUser.name}</p>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>{viewUser.email}</p>
                </div>
              </div>
              {[{ label: 'Role', value: viewUser.role?.charAt(0).toUpperCase() + viewUser.role?.slice(1) },
                ...(viewUser.role === 'student' ? [{ label: 'Class', value: viewUser.className ? `Class ${viewUser.className}` : '—' }] : []),
                ...(viewUser.role === 'student' && viewUser.subjects?.length ? [{ label: 'Subjects', value: viewUser.subjects.join(', ') }] : []),
                ...(viewUser.role === 'tutor' ? [{ label: 'Specialization', value: viewUser.specialization || '—' }] : []),
                { label: 'Status', value: viewUser.status },
                { label: 'Registered', value: viewUser.createdAt ? new Date(viewUser.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—' }
              ].map((field, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f8fafc', borderRadius: '10px' }}>
                  <span style={{ color: '#64748b', fontWeight: 500, fontSize: '0.9rem' }}>{field.label}</span>
                  {field.label === 'Status' ? (
                    <span style={{
                      padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600,
                      background: field.value === 'approved' ? '#dcfce7' : field.value === 'pending' ? '#fef3c7' : '#fee2e2',
                      color: field.value === 'approved' ? '#166534' : field.value === 'pending' ? '#92400e' : '#991b1b'
                    }}>{field.value}</span>
                  ) : (
                    <span style={{ color: '#0f172a', fontWeight: 600, fontSize: '0.9rem' }}>{field.value}</span>
                  )}
                </div>
              ))}
            </div>
            {viewUser.status === 'pending' && (
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  onClick={() => { (viewUser.role === 'tutor' ? approveTutor : approveStudent)(viewUser._id); setViewUser(null); }}
                  style={{ flex: 1, padding: '0.75rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}
                >
                  Approve
                </button>
                <button
                  onClick={() => { (viewUser.role === 'tutor' ? declineTutor : declineStudent)(viewUser._id); setViewUser(null); }}
                  style={{ flex: 1, padding: '0.75rem', background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}
                >
                  Decline
                </button>
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: viewUser.status === 'pending' ? '0.5rem' : '1.5rem' }}>
              <button
                onClick={() => { setDeleteTarget({ id: viewUser._id, name: viewUser.name, role: viewUser.role }); setViewUser(null); }}
                style={{ flex: 1, padding: '0.75rem', background: '#fef2f2', color: '#dc2626', border: '2px solid #fecaca', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'white', padding: '2rem', borderRadius: '20px',
            maxWidth: '400px', width: '100%', textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%', background: '#fef2f2',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem', fontSize: '1.5rem'
            }}>⚠️</div>
            <h3 style={{ margin: '0 0 0.5rem', color: '#0f172a', fontWeight: 700, fontSize: '1.15rem' }}>Delete {deleteTarget.role === 'tutor' ? 'Tutor' : 'Student'}?</h3>
            <p style={{ margin: '0 0 1.5rem', color: '#64748b', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Are you sure you want to delete <strong style={{ color: '#0f172a' }}>{deleteTarget.name}</strong>? This will remove all their data and cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setDeleteTarget(null)}
                style={{ flex: 1, padding: '0.75rem', borderRadius: '10px', border: '2px solid #e2e8f0', background: 'white', color: '#64748b', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}
              >Cancel</button>
              <button
                onClick={confirmDeleteUser}
                style={{ flex: 1, padding: '0.75rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}
              >Delete</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminDashboard;
