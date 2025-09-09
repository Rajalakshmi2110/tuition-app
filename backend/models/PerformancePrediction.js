const mongoose = require('mongoose');

const performancePredictionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  predictions: {
    nextAssignmentScore: {
      type: Number,
      min: 0,
      max: 100
    },
    trend: {
      type: String,
      enum: ['improving', 'declining', 'stable'],
      default: 'stable'
    },
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low'
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.5
    }
  },
  historicalData: {
    recentScores: [Number],
    averageScore: Number,
    totalAssignments: Number,
    improvementRate: Number
  },
  recommendations: [String],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PerformancePrediction', performancePredictionSchema);