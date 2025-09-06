const mongoose = require('mongoose');

const userStatsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  points: {
    total: {
      type: Number,
      default: 0
    },
    weekly: {
      type: Number,
      default: 0
    },
    monthly: {
      type: Number,
      default: 0
    }
  },
  streaks: {
    current: {
      type: Number,
      default: 0
    },
    longest: {
      type: Number,
      default: 0
    },
    lastActivity: {
      type: Date,
      default: Date.now
    }
  },
  achievements: {
    badgesEarned: {
      type: Number,
      default: 0
    },
    assignmentsCompleted: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    loginDays: {
      type: Number,
      default: 0
    }
  },
  level: {
    current: {
      type: Number,
      default: 1
    },
    xp: {
      type: Number,
      default: 0
    },
    xpToNext: {
      type: Number,
      default: 100
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('UserStats', userStatsSchema);