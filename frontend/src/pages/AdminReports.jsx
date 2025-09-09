import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';

const AdminReports = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [revenueTrends, setRevenueTrends] = useState([]);
  const [performanceByClass, setPerformanceByClass] = useState([]);
  const [subjectPerformance, setSubjectPerformance] = useState([]);
  const [paymentDistribution, setPaymentDistribution] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAllReports();
  }, []);

  const fetchAllReports = async () => {
    try {
      console.log('Fetching all reports...');
      const [dashboard, revenue, performance, subjects, payments] = await Promise.all([
        axios.get('http://localhost:5000/api/reports/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/reports/revenue-trends', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/reports/performance-by-class', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/reports/subject-performance', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/reports/payment-distribution', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      console.log('Dashboard data:', dashboard.data);
      console.log('Revenue trends:', revenue.data);
      console.log('Performance data:', performance.data);
      
      setDashboardData(dashboard.data.overview);
      setRevenueTrends(revenue.data.trends || []);
      setPerformanceByClass(performance.data.performanceByClass || []);
      setSubjectPerformance(subjects.data.subjectPerformance || []);
      setPaymentDistribution(payments.data.paymentDistribution || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      verified: '#10b981',
      pending: '#f59e0b',
      rejected: '#ef4444',
      unpaid: '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatMonth = (monthStr) => {
    const date = new Date(monthStr + '-01');
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '1.2rem', color: '#666' }}>Loading reports...</div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#20205c', marginBottom: '2rem', textAlign: 'center' }}>
        📊 Advanced Reports & Analytics
      </h2>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #e5e7eb' }}>
        {[
          { id: 'dashboard', label: '📈 Dashboard', icon: '📈' },
          { id: 'revenue', label: '💰 Revenue', icon: '💰' },
          { id: 'performance', label: '🎯 Performance', icon: '🎯' },
          { id: 'payments', label: '💳 Payments', icon: '💳' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '1rem 1.5rem',
              backgroundColor: activeTab === tab.id ? '#3b82f6' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#666',
              border: 'none',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && dashboardData && (
        <div>
          {/* Debug Info */}
          <div style={{ backgroundColor: '#f0f9ff', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>
            <strong>Debug Info:</strong> Students: {dashboardData?.totalStudents || 0}, Tutors: {dashboardData?.totalTutors || 0}, 
            Performance Records: {performanceByClass?.length || 0}, Revenue Records: {revenueTrends?.length || 0}
          </div>

          {/* Key Metrics Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</div>
              <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6', margin: '0' }}>{dashboardData.totalStudents}</h3>
              <p style={{ color: '#666', margin: '0.25rem 0 0 0' }}>Total Students</p>
            </div>

            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👨‍🏫</div>
              <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', margin: '0' }}>{dashboardData.totalTutors}</h3>
              <p style={{ color: '#666', margin: '0.25rem 0 0 0' }}>Total Tutors</p>
            </div>

            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b', margin: '0' }}>{formatCurrency(dashboardData.currentRevenue)}</h3>
              <p style={{ color: '#666', margin: '0.25rem 0 0 0' }}>This Month Revenue</p>
              <div style={{ fontSize: '0.8rem', color: dashboardData.revenueGrowth >= 0 ? '#10b981' : '#ef4444' }}>
                {dashboardData.revenueGrowth >= 0 ? '↗️' : '↘️'} {Math.abs(dashboardData.revenueGrowth)}%
              </div>
            </div>

            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
              <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6', margin: '0' }}>{dashboardData.avgPerformance}%</h3>
              <p style={{ color: '#666', margin: '0.25rem 0 0 0' }}>Avg Performance</p>
            </div>

            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💳</div>
              <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#06b6d4', margin: '0' }}>{dashboardData.collectionRate}%</h3>
              <p style={{ color: '#666', margin: '0.25rem 0 0 0' }}>Collection Rate</p>
            </div>

            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚠️</div>
              <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef4444', margin: '0' }}>{dashboardData.studentsAtRisk}</h3>
              <p style={{ color: '#666', margin: '0.25rem 0 0 0' }}>Students at Risk</p>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Tab */}
      {activeTab === 'revenue' && (
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#20205c', marginBottom: '1.5rem' }}>📈 Revenue Trends (Last 6 Months)</h3>
          
          {/* Simple Bar Chart */}
          <div style={{ display: 'flex', alignItems: 'end', gap: '1rem', height: '300px', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
            {revenueTrends.map((trend, index) => (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <div style={{
                  height: `${Math.max(20, (trend.revenue / Math.max(...revenueTrends.map(t => t.revenue))) * 250)}px`,
                  backgroundColor: '#3b82f6',
                  width: '100%',
                  borderRadius: '4px 4px 0 0',
                  display: 'flex',
                  alignItems: 'end',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  paddingBottom: '0.5rem'
                }}>
                  {formatCurrency(trend.revenue)}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem', textAlign: 'center' }}>
                  {formatMonth(trend.month)}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#999' }}>
                  {trend.payments} payments
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
          {/* Performance by Class */}
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#20205c', marginBottom: '1.5rem' }}>🎯 Performance by Class</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {performanceByClass.map((classData, index) => (
                <div key={index} style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h4 style={{ margin: 0, color: '#20205c' }}>Class {classData._id || 'Unassigned'}</h4>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#3b82f6' }}>
                      {Math.round(classData.avgScore)}%
                    </span>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    {classData.count} exams • Range: {Math.round(classData.minScore)}% - {Math.round(classData.maxScore)}%
                  </div>
                  
                  {/* Progress Bar */}
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px', marginTop: '0.5rem' }}>
                    <div style={{
                      width: `${classData.avgScore}%`,
                      height: '100%',
                      backgroundColor: classData.avgScore >= 75 ? '#10b981' : classData.avgScore >= 60 ? '#f59e0b' : '#ef4444',
                      borderRadius: '4px',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subject Performance */}
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#20205c', marginBottom: '1.5rem' }}>📚 Subject Performance</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {subjectPerformance.map((subject, index) => (
                <div key={index} style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h4 style={{ margin: 0, color: '#20205c' }}>{subject._id}</h4>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#3b82f6' }}>
                      {Math.round(subject.avgScore)}%
                    </span>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    {subject.count} exams • {subject.studentsBelow50} students below 50%
                  </div>
                  
                  {subject.studentsBelow50 > 0 && (
                    <div style={{ fontSize: '0.8rem', color: '#ef4444', marginTop: '0.25rem' }}>
                      ⚠️ {Math.round((subject.studentsBelow50 / subject.count) * 100)}% need attention
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#20205c', marginBottom: '1.5rem' }}>💳 Payment Distribution</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {paymentDistribution.map((payment, index) => (
              <div key={index} style={{
                padding: '1.5rem',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: `2px solid ${getStatusColor(payment.status)}`,
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                  {payment.status === 'verified' ? '✅' : 
                   payment.status === 'pending' ? '⏳' : 
                   payment.status === 'rejected' ? '❌' : '💸'}
                </div>
                <h4 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: getStatusColor(payment.status), margin: '0' }}>
                  {payment.count}
                </h4>
                <p style={{ color: '#666', margin: '0.25rem 0', textTransform: 'capitalize' }}>
                  {payment.status} Students
                </p>
                {payment.amount > 0 && (
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    {formatCurrency(payment.amount)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </AdminLayout>
  );
};

export default AdminReports;