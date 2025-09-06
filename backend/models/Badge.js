const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: '#3b82f6'
  },
  category: {
    type: String,
    enum: ['performance', 'attendance', 'assignment', 'streak', 'special'],
    required: true
  },
  criteria: {
    type: {
      type: String,
      enum: ['assignment_count', 'performance_avg', 'streak_days', 'login_days', 'special_event'],
      required: true
    },
    value: {
      type: Number,
      required: true
    }
  },
  points: {
    type: Number,
    default: 10
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Badge', badgeSchema);