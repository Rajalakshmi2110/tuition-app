import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const StudentGamification = () => {
  const [stats, setStats] = useState(null);
  const [badges, setBadges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [allBadges, setAllBadges] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  const fetchGamificationData = useCallback(async () => {
    try {
      const decoded = jwtDecode(token);
      const userId = decoded.id || decoded._id;

      const [statsRes, leaderboardRes, badgesRes] = await Promise.all([
        axios.get(`https://tuitionapp-yq06.onrender.com/api/gamification/stats/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('https://tuitionapp-yq06.onrender.com/api/gamification/leaderboard', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('https://tuitionapp-yq06.onrender.com/api/gamification/badges', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setStats(statsRes.data.stats);
      setBadges(statsRes.data.badges);
      setLeaderboard(leaderboardRes.data);
      setAllBadges(badgesRes.data);
    } catch (error) {
      console.error('Error fetching gamification data:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchGamificationData();
  }, [fetchGamificationData]);

  const getRarityColor = (rarity) => {
    const colors = {
      common: '#6b7280',
      rare: '#3b82f6',
      epic: '#8b5cf6',
      legendary: '#f59e0b'
    };
    return colors[rarity] || '#6b7280';
  };

  const getProgressPercentage = () => {
    if (!stats) return 0;
    return (stats.level.xp / stats.level.xpToNext) * 100;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '1.2rem', color: '#666' }}>Loading achievements...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#20205c', marginBottom: '2rem', textAlign: 'center' }}>
        🏆 Achievements & Progress
      </h2>

      {/* Stats Overview */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
            <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6', margin: '0' }}>{stats.points.total}</h3>
            <p style={{ color: '#666', margin: '0.25rem 0 0 0' }}>Total Points</p>
          </div>
          
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔥</div>
            <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef4444', margin: '0' }}>{stats.streaks.current}</h3>
            <p style={{ color: '#666', margin: '0.25rem 0 0 0' }}>Current Streak</p>
          </div>
          
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏅</div>
            <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', margin: '0' }}>{badges.length}</h3>
            <p style={{ color: '#666', margin: '0.25rem 0 0 0' }}>Badges Earned</p>
          </div>
          
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⭐</div>
            <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b', margin: '0' }}>Level {stats.level.current}</h3>
            <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '10px', height: '8px', marginTop: '0.5rem' }}>
              <div style={{ 
                width: `${getProgressPercentage()}%`, 
                backgroundColor: '#f59e0b', 
                height: '100%', 
                borderRadius: '10px',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
            <p style={{ color: '#666', margin: '0.25rem 0 0 0', fontSize: '0.8rem' }}>{stats.level.xp}/{stats.level.xpToNext} XP</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', marginBottom: '2rem', gap: '1rem', justifyContent: 'center' }}>
        {['overview', 'badges', 'leaderboard'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '12px 24px',
              backgroundColor: activeTab === tab ? '#3b82f6' : 'white',
              color: activeTab === tab ? 'white' : '#374151',
              border: '2px solid #3b82f6',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              textTransform: 'capitalize',
              transition: 'all 0.3s ease'
            }}
          >
            {tab === 'overview' ? '📊 Overview' : tab === 'badges' ? '🏅 Badges' : '🏆 Leaderboard'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'badges' && (
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginBottom: '1.5rem', color: '#20205c' }}>🏅 Your Badges ({badges.length}/{allBadges.length})</h3>
          
          {badges.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏅</div>
              <p style={{ fontSize: '1.2rem' }}>No badges earned yet!</p>
              <p>Complete assignments and maintain streaks to earn your first badge.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              {badges.map((badge) => (
                <div key={badge._id} style={{
                  padding: '1.5rem',
                  border: `2px solid ${getRarityColor(badge.rarity)}`,
                  borderRadius: '12px',
                  backgroundColor: '#f8fafc',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{badge.icon}</div>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: getRarityColor(badge.rarity) }}>{badge.name}</h4>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#666' }}>{badge.description}</p>
                  <div style={{ 
                    display: 'inline-block', 
                    padding: '0.25rem 0.75rem', 
                    backgroundColor: getRarityColor(badge.rarity), 
                    color: 'white', 
                    borderRadius: '20px', 
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    fontWeight: 'bold'
                  }}>
                    {badge.rarity}
                  </div>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#666' }}>
                    Earned: {new Date(badge.earnedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginBottom: '1.5rem', color: '#20205c' }}>🏆 Leaderboard</h3>
          
          {leaderboard.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
              <p style={{ fontSize: '1.2rem' }}>No rankings available yet!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {leaderboard.map((entry, index) => (
                <div key={entry.user._id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem',
                  backgroundColor: index < 3 ? '#f8fafc' : 'white',
                  border: index < 3 ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    backgroundColor: index === 0 ? '#f59e0b' : index === 1 ? '#6b7280' : index === 2 ? '#cd7c2f' : '#3b82f6',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    marginRight: '1rem'
                  }}>
                    {index < 3 ? ['🥇', '🥈', '🥉'][index] : entry.rank}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 0.25rem 0', color: '#374151' }}>{entry.user.name}</h4>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: '#666' }}>
                      <span>🎯 {entry.points.total} pts</span>
                      <span>🔥 {entry.streaks.current} streak</span>
                      <span>🏅 {entry.badgesCount} badges</span>
                      <span>⭐ Level {entry.level.current}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
          {/* Recent Badges */}
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#20205c' }}>🏅 Recent Badges</h3>
            {badges.slice(0, 3).map((badge) => (
              <div key={badge._id} style={{ display: 'flex', alignItems: 'center', padding: '0.75rem', marginBottom: '0.5rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                <span style={{ fontSize: '2rem', marginRight: '1rem' }}>{badge.icon}</span>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', color: '#374151' }}>{badge.name}</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>{badge.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Summary */}
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#20205c' }}>📈 Progress Summary</h3>
            {stats && (
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>📚 Assignments Completed</span>
                  <strong>{stats.achievements.assignmentsCompleted}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>📊 Average Score</span>
                  <strong>{stats.achievements.averageScore}%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>📅 Login Days</span>
                  <strong>{stats.achievements.loginDays}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>🔥 Longest Streak</span>
                  <strong>{stats.streaks.longest} days</strong>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentGamification;