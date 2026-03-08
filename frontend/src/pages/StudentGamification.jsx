import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';
import LoadingSpinner from '../components/LoadingSpinner';

const StudentGamification = () => {
  const [stats, setStats] = useState(null);
  const [badges, setBadges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [allBadges, setAllBadges] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  const fetchGamificationData = useCallback(async () => {
    try {
      const decoded = jwtDecode(localStorage.getItem('token'));
      const userId = decoded.id || decoded._id;

      const [statsRes, leaderboardRes, badgesRes] = await Promise.all([
        api.get(`/gamification/stats/${userId}`),
        api.get(`/gamification/leaderboard`),
        api.get(`/gamification/badges`)
      ]);

      setStats(statsRes.data.stats);
      setBadges(statsRes.data.badges);
      setLeaderboard(leaderboardRes.data);
      setAllBadges(badgesRes.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGamificationData();
  }, [fetchGamificationData]);

  const getRarityColor = (rarity) => {
    const colors = {
      common: { bg: '#f1f5f9', text: '#64748b', border: '#94a3b8', gradient: 'linear-gradient(135deg, #94a3b8, #64748b)' },
      rare: { bg: '#dbeafe', text: '#1e40af', border: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6, #1e40af)' },
      epic: { bg: '#f3e8ff', text: '#7c3aed', border: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
      legendary: { bg: '#fef3c7', text: '#b45309', border: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' }
    };
    return colors[rarity] || colors.common;
  };

  const getProgressPercentage = () => {
    if (!stats) return 0;
    return (stats.level.xp / stats.level.xpToNext) * 100;
  };

  // Icons
  const icons = {
    trophy: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
        <path d="M4 22h16"></path>
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
      </svg>
    ),
    flame: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
      </svg>
    ),
    star: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    ),
    zap: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
      </svg>
    ),
    award: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6"></circle>
        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>
      </svg>
    ),
    target: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <circle cx="12" cy="12" r="6"></circle>
        <circle cx="12" cy="12" r="2"></circle>
      </svg>
    ),
    users: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
    barChart: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"></line>
        <line x1="12" y1="20" x2="12" y2="4"></line>
        <line x1="6" y1="20" x2="6" y2="14"></line>
      </svg>
    ),
    checkCircle: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    ),
    calendar: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
    ),
    trendingUp: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
        <polyline points="17 6 23 6 23 12"></polyline>
      </svg>
    ),
    medal: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"></path>
        <path d="M11 12 5.12 2.2"></path>
        <path d="m13 12 5.88-9.8"></path>
        <path d="M8 7h8"></path>
        <circle cx="12" cy="17" r="5"></circle>
        <path d="M12 18v-2h-.5"></path>
      </svg>
    )
  };

  if (loading) {
    return <LoadingSpinner message="Loading your achievements..." fullPage />;
  }

  const statCards = stats ? [
    { 
      value: stats.points.total, 
      label: 'Total Points', 
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
      icon: icons.trophy
    },
    { 
      value: stats.streaks.current, 
      label: 'Current Streak', 
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
      icon: icons.flame,
      suffix: ' days'
    },
    { 
      value: badges.length, 
      label: 'Badges Earned', 
      color: '#fbbf24',
      gradient: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
      icon: icons.award
    },
    { 
      value: stats.level.current, 
      label: `${stats.level.xp}/${stats.level.xpToNext} XP`, 
      color: '#8b5cf6', 
      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      icon: icons.zap,
      prefix: 'Level ',
      showProgress: true 
    }
  ] : [];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: icons.target },
    { id: 'badges', label: 'Badges', icon: icons.award },
    { id: 'leaderboard', label: 'Leaderboard', icon: icons.users }
  ];

  const progressItems = stats ? [
    { label: 'Assignments Completed', value: stats.achievements.assignmentsCompleted, icon: icons.checkCircle, color: '#10b981' },
    { label: 'Average Score', value: `${stats.achievements.averageScore}%`, icon: icons.barChart, color: '#3b82f6' },
    { label: 'Login Days', value: stats.achievements.loginDays, icon: icons.calendar, color: '#8b5cf6' },
    { label: 'Longest Streak', value: `${stats.streaks.longest} days`, icon: icons.trendingUp, color: '#f59e0b' }
  ] : [];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #ea580c 100%)',
        padding: '2rem',
        borderRadius: '20px',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 10px 40px rgba(251, 191, 36, 0.3)'
      }}>
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: '-30px',
          right: '-30px',
          width: '150px',
          height: '150px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-50px',
          left: '20%',
          width: '100px',
          height: '100px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '10%',
          width: '40px',
          height: '40px',
          background: 'rgba(255, 255, 255, 0.15)',
          borderRadius: '8px',
          transform: 'rotate(45deg)'
        }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              {icons.trophy}
            </div>
            <div>
              <h2 style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                color: 'white',
                margin: 0,
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
              }}>
                Achievements & Progress
              </h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)', margin: 0, fontSize: '1rem' }}>
                Track your learning journey and earn rewards! 🎮
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {statCards.map((stat, index) => (
            <div
              key={index}
              style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '20px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                border: '2px solid transparent',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                e.currentTarget.style.boxShadow = `0 20px 40px ${stat.color}30`;
                e.currentTarget.style.borderColor = stat.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.06)';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              {/* Background decoration */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '80px',
                height: '80px',
                background: `${stat.color}10`,
                borderRadius: '50%'
              }} />
              
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ 
                    color: '#64748b', 
                    fontSize: '0.9rem', 
                    margin: '0 0 0.75rem 0', 
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {stat.label}
                  </p>
                  <h3 style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: 800, 
                    color: '#0f172a', 
                    margin: 0,
                    lineHeight: 1
                  }}>
                    {stat.prefix}{stat.value}{stat.suffix}
                  </h3>
                  {stat.showProgress && (
                    <div style={{ marginTop: '1rem' }}>
                      <div style={{ 
                        width: '100%', 
                        backgroundColor: '#e2e8f0', 
                        borderRadius: '10px', 
                        height: '8px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${getProgressPercentage()}%`,
                          background: stat.gradient,
                          height: '100%',
                          borderRadius: '10px',
                          transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                          boxShadow: `0 0 10px ${stat.color}60`
                        }} />
                      </div>
                      <p style={{ 
                        fontSize: '0.8rem', 
                        color: '#94a3b8', 
                        margin: '0.5rem 0 0',
                        fontWeight: 500
                      }}>
                        {Math.round(getProgressPercentage())}% to next level
                      </p>
                    </div>
                  )}
                </div>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: stat.gradient,
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: `0 8px 20px ${stat.color}40`,
                  flexShrink: 0
                }}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '2rem',
        background: 'white',
        padding: '0.5rem',
        borderRadius: '16px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
        width: 'fit-content'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.875rem 1.5rem',
              background: activeTab === tab.id ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#64748b',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.95rem',
              transition: 'all 0.3s ease',
              boxShadow: activeTab === tab.id ? '0 4px 15px rgba(251, 191, 36, 0.4)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span style={{ display: 'flex', width: '20px', height: '20px' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'badges' && (
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{
            marginBottom: '1.5rem',
            color: '#0f172a',
            fontWeight: 700,
            fontSize: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <span style={{ color: '#fbbf24' }}>{icons.award}</span>
            Your Badges ({badges.length}/{allBadges.length})
          </h3>

          {badges.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '4rem 2rem',
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              borderRadius: '20px'
            }}>
              <div style={{
                width: '100px',
                height: '100px',
                background: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                boxShadow: '0 10px 30px rgba(251, 191, 36, 0.3)'
              }}>
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <h3 style={{ color: '#92400e', fontWeight: 700, marginBottom: '0.5rem', fontSize: '1.5rem' }}>
                No Badges Yet! 🌟
              </h3>
              <p style={{ color: '#b45309', maxWidth: '400px', margin: '0 auto', fontSize: '1rem' }}>
                Complete assignments, maintain streaks, and achieve high scores to unlock awesome badges!
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}>
              {badges.map((badge) => {
                const rarityStyle = getRarityColor(badge.rarity);
                return (
                  <div
                    key={badge._id}
                    style={{
                      padding: '2rem',
                      border: `3px solid ${rarityStyle.border}`,
                      borderRadius: '20px',
                      backgroundColor: rarityStyle.bg,
                      textAlign: 'center',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05) rotate(1deg)';
                      e.currentTarget.style.boxShadow = `0 15px 40px ${rarityStyle.border}40`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* Shine effect */}
                    <div style={{
                      position: 'absolute',
                      top: '-50%',
                      left: '-50%',
                      width: '200%',
                      height: '200%',
                      background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
                      transform: 'translateX(-100%)',
                      animation: 'shine 3s infinite'
                    }} />
                    
                    <div style={{ 
                      fontSize: '4rem', 
                      marginBottom: '1rem',
                      filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.2))'
                    }}>
                      {badge.icon}
                    </div>
                    <h4 style={{ 
                      margin: '0 0 0.5rem 0', 
                      color: rarityStyle.text, 
                      fontWeight: 700,
                      fontSize: '1.2rem'
                    }}>
                      {badge.name}
                    </h4>
                    <p style={{ 
                      margin: '0 0 1rem 0', 
                      fontSize: '0.9rem', 
                      color: '#64748b' 
                    }}>
                      {badge.description}
                    </p>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.375rem 1rem',
                      background: rarityStyle.gradient,
                      color: 'white',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      boxShadow: `0 4px 15px ${rarityStyle.border}40`
                    }}>
                      {badge.rarity}
                    </span>
                    <p style={{ 
                      margin: '1rem 0 0 0', 
                      fontSize: '0.8rem', 
                      color: '#94a3b8',
                      fontWeight: 500
                    }}>
                      🗓️ Earned: {new Date(badge.earnedAt).toLocaleDateString()}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{
            marginBottom: '1.5rem',
            color: '#0f172a',
            fontWeight: 700,
            fontSize: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <span style={{ color: '#fbbf24' }}>{icons.users}</span>
            Leaderboard Rankings
          </h3>

          {leaderboard.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '4rem 2rem',
              background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
              borderRadius: '20px'
            }}>
              <div style={{
                width: '100px',
                height: '100px',
                background: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)'
              }}>
                <span style={{ color: '#3b82f6' }}>{icons.users}</span>
              </div>
              <h3 style={{ color: '#1e40af', fontWeight: 700, marginBottom: '0.5rem', fontSize: '1.5rem' }}>
                No Rankings Yet! 🏆
              </h3>
              <p style={{ color: '#3b82f6' }}>Be the first to earn points and climb the leaderboard!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {leaderboard.map((entry, index) => {
                const isTopThree = index < 3;
                const podiumColors = [
                  { bg: 'linear-gradient(135deg, #fef3c7, #fde68a)', border: '#f59e0b', text: '#92400e' },
                  { bg: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)', border: '#94a3b8', text: '#475569' },
                  { bg: 'linear-gradient(135deg, #ffedd5, #fed7aa)', border: '#f97316', text: '#c2410c' }
                ];
                const style = isTopThree ? podiumColors[index] : { bg: 'white', border: '#e2e8f0', text: '#0f172a' };

                return (
                  <div
                    key={entry.user._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '1.25rem 1.5rem',
                      background: style.bg,
                      border: `2px solid ${style.border}`,
                      borderRadius: '16px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(8px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '14px',
                      background: isTopThree
                        ? ['linear-gradient(135deg, #f59e0b, #d97706)', 'linear-gradient(135deg, #94a3b8, #64748b)', 'linear-gradient(135deg, #f97316, #ea580c)'][index]
                        : 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      marginRight: '1.25rem',
                      fontSize: isTopThree ? '1.5rem' : '1rem',
                      boxShadow: isTopThree ? '0 6px 20px rgba(0,0,0,0.2)' : '0 4px 12px rgba(16, 185, 129, 0.3)'
                    }}>
                      {isTopThree ? ['🥇', '🥈', '🥉'][index] : entry.rank}
                    </div>

                    <div style={{ flex: 1 }}>
                      <h4 style={{ 
                        margin: '0 0 0.375rem 0', 
                        color: style.text, 
                        fontWeight: 700,
                        fontSize: '1.1rem'
                      }}>
                        {entry.user.name}
                      </h4>
                      <div style={{ 
                        display: 'flex', 
                        gap: '1.25rem', 
                        fontSize: '0.85rem', 
                        color: '#64748b', 
                        flexWrap: 'wrap' 
                      }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <span style={{ color: '#10b981', display: 'flex' }}>{icons.trophy}</span>
                          <strong>{entry.points.total}</strong> pts
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <span style={{ color: '#ef4444', display: 'flex' }}>{icons.flame}</span>
                          <strong>{entry.streaks.current}</strong> streak
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <span style={{ color: '#fbbf24', display: 'flex' }}>{icons.award}</span>
                          <strong>{entry.badgesCount}</strong> badges
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <span style={{ color: '#8b5cf6', display: 'flex' }}>{icons.zap}</span>
                          Lvl <strong>{entry.level.current}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'overview' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Recent Badges */}
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '20px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{
              marginBottom: '1.25rem',
              color: '#0f172a',
              fontWeight: 700,
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <span style={{ color: '#fbbf24' }}>{icons.star}</span>
              Recent Badges
            </h3>
            {badges.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '2rem',
                background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                borderRadius: '16px'
              }}>
                <div style={{ color: '#fbbf24', marginBottom: '0.75rem' }}>{icons.star}</div>
                <p style={{ color: '#64748b', margin: 0, fontWeight: 500 }}>No badges earned yet</p>
                <p style={{ color: '#94a3b8', margin: '0.25rem 0 0', fontSize: '0.85rem' }}>Keep learning to unlock badges!</p>
              </div>
            ) : (
              badges.slice(0, 3).map((badge) => {
                const rarityStyle = getRarityColor(badge.rarity);
                return (
                  <div
                    key={badge._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '1rem',
                      marginBottom: '0.75rem',
                      backgroundColor: rarityStyle.bg,
                      borderRadius: '14px',
                      border: `2px solid ${rarityStyle.border}`,
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                  >
                    <span style={{ 
                      fontSize: '2.5rem', 
                      marginRight: '1rem',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                    }}>
                      {badge.icon}
                    </span>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ 
                        margin: '0 0 0.25rem 0', 
                        color: rarityStyle.text, 
                        fontWeight: 700, 
                        fontSize: '1rem' 
                      }}>
                        {badge.name}
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>{badge.description}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Progress Summary */}
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '20px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{
              marginBottom: '1.25rem',
              color: '#0f172a',
              fontWeight: 700,
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <span style={{ color: '#10b981' }}>{icons.barChart}</span>
              Progress Summary
            </h3>
            {stats && (
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {progressItems.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '1rem 1.25rem',
                      background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                      borderRadius: '14px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(4px)';
                      e.currentTarget.style.background = `linear-gradient(135deg, ${item.color}10, ${item.color}05)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.background = 'linear-gradient(135deg, #f8fafc, #f1f5f9)';
                    }}
                  >
                    <span style={{ 
                      color: '#64748b', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.75rem',
                      fontWeight: 500
                    }}>
                      <span style={{ 
                        color: item.color, 
                        display: 'flex',
                        width: '36px',
                        height: '36px',
                        background: `${item.color}15`,
                        borderRadius: '10px',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {item.icon}
                      </span>
                      {item.label}
                    </span>
                    <strong style={{ 
                      color: '#0f172a', 
                      fontSize: '1.1rem',
                      fontWeight: 700
                    }}>
                      {item.value}
                    </strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Animation styles */}
      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default StudentGamification;
