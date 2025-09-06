const Badge = require('../models/Badge');
const UserBadge = require('../models/UserBadge');
const UserStats = require('../models/UserStats');
const User = require('../models/User');

// Initialize default badges
const initializeBadges = async () => {
  const defaultBadges = [
    {
      name: 'First Steps',
      description: 'Complete your first assignment',
      icon: '🎯',
      category: 'assignment',
      criteria: { type: 'assignment_count', value: 1 },
      points: 10,
      rarity: 'common'
    },
    {
      name: 'Assignment Master',
      description: 'Complete 10 assignments',
      icon: '📚',
      category: 'assignment',
      criteria: { type: 'assignment_count', value: 10 },
      points: 50,
      rarity: 'rare'
    },
    {
      name: 'Streak Starter',
      description: 'Maintain a 3-day login streak',
      icon: '🔥',
      category: 'streak',
      criteria: { type: 'streak_days', value: 3 },
      points: 25,
      rarity: 'common'
    },
    {
      name: 'Dedication',
      description: 'Maintain a 7-day login streak',
      icon: '⚡',
      category: 'streak',
      criteria: { type: 'streak_days', value: 7 },
      points: 75,
      rarity: 'epic'
    },
    {
      name: 'Excellence',
      description: 'Achieve 90% average score',
      icon: '⭐',
      category: 'performance',
      criteria: { type: 'performance_avg', value: 90 },
      points: 100,
      rarity: 'legendary'
    },
    {
      name: 'Regular Student',
      description: 'Login for 30 days',
      icon: '📅',
      category: 'attendance',
      criteria: { type: 'login_days', value: 30 },
      points: 150,
      rarity: 'epic'
    }
  ];

  for (const badge of defaultBadges) {
    await Badge.findOneAndUpdate(
      { name: badge.name },
      badge,
      { upsert: true, new: true }
    );
  }
};

// Get user stats
const getUserStats = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    
    let stats = await UserStats.findOne({ userId }).populate('userId', 'name email');
    if (!stats) {
      stats = await UserStats.create({ userId });
    }

    const badges = await UserBadge.find({ userId })
      .populate('badgeId')
      .sort({ earnedAt: -1 });

    res.json({
      stats,
      badges: badges.map(ub => ({
        ...ub.badgeId.toObject(),
        earnedAt: ub.earnedAt,
        progress: ub.progress
      }))
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const { type = 'total', limit = 10 } = req.query;
    
    let sortField = 'points.total';
    if (type === 'weekly') sortField = 'points.weekly';
    if (type === 'monthly') sortField = 'points.monthly';
    if (type === 'streak') sortField = 'streaks.current';

    const leaderboard = await UserStats.find()
      .populate('userId', 'name email role')
      .sort({ [sortField]: -1 })
      .limit(parseInt(limit));

    const formattedLeaderboard = leaderboard.map((stat, index) => ({
      rank: index + 1,
      user: stat.userId,
      points: stat.points,
      streaks: stat.streaks,
      level: stat.level,
      badgesCount: stat.achievements.badgesEarned
    }));

    res.json(formattedLeaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Award points to user
const awardPoints = async (userId, points, reason = 'Activity') => {
  try {
    let stats = await UserStats.findOne({ userId });
    if (!stats) {
      stats = await UserStats.create({ userId });
    }

    stats.points.total += points;
    stats.points.weekly += points;
    stats.points.monthly += points;
    stats.level.xp += points;

    // Level up logic
    while (stats.level.xp >= stats.level.xpToNext) {
      stats.level.xp -= stats.level.xpToNext;
      stats.level.current += 1;
      stats.level.xpToNext = stats.level.current * 100; // Increase XP needed per level
    }

    await stats.save();
    return stats;
  } catch (error) {
    console.error('Error awarding points:', error);
  }
};

// Update user streak
const updateStreak = async (userId) => {
  try {
    let stats = await UserStats.findOne({ userId });
    if (!stats) {
      stats = await UserStats.create({ userId });
    }

    const now = new Date();
    const lastActivity = new Date(stats.streaks.lastActivity);
    const daysDiff = Math.floor((now - lastActivity) / (1000 * 60 * 60 * 24));

    if (daysDiff === 1) {
      // Continue streak
      stats.streaks.current += 1;
      if (stats.streaks.current > stats.streaks.longest) {
        stats.streaks.longest = stats.streaks.current;
      }
    } else if (daysDiff > 1) {
      // Reset streak
      stats.streaks.current = 1;
    }
    // If daysDiff === 0, same day activity, don't change streak

    stats.streaks.lastActivity = now;
    stats.achievements.loginDays += 1;
    
    await stats.save();
    await checkBadgeEligibility(userId);
    
    return stats;
  } catch (error) {
    console.error('Error updating streak:', error);
  }
};

// Check badge eligibility
const checkBadgeEligibility = async (userId) => {
  try {
    const stats = await UserStats.findOne({ userId });
    const badges = await Badge.find();
    
    for (const badge of badges) {
      const existingBadge = await UserBadge.findOne({ userId, badgeId: badge._id });
      if (existingBadge) continue;

      let eligible = false;
      
      switch (badge.criteria.type) {
        case 'assignment_count':
          eligible = stats.achievements.assignmentsCompleted >= badge.criteria.value;
          break;
        case 'performance_avg':
          eligible = stats.achievements.averageScore >= badge.criteria.value;
          break;
        case 'streak_days':
          eligible = stats.streaks.current >= badge.criteria.value;
          break;
        case 'login_days':
          eligible = stats.achievements.loginDays >= badge.criteria.value;
          break;
      }

      if (eligible) {
        await UserBadge.create({
          userId,
          badgeId: badge._id,
          progress: {
            current: badge.criteria.value,
            target: badge.criteria.value
          }
        });

        stats.achievements.badgesEarned += 1;
        await stats.save();
        await awardPoints(userId, badge.points, `Badge: ${badge.name}`);
      }
    }
  } catch (error) {
    console.error('Error checking badge eligibility:', error);
  }
};

// Get all badges
const getAllBadges = async (req, res) => {
  try {
    const badges = await Badge.find().sort({ rarity: 1, points: 1 });
    res.json(badges);
  } catch (error) {
    console.error('Error fetching badges:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  initializeBadges,
  getUserStats,
  getLeaderboard,
  awardPoints,
  updateStreak,
  checkBadgeEligibility,
  getAllBadges
};