const Assignment = require('../models/AssignmentSubmission');
const PerformancePrediction = require('../models/PerformancePrediction');
const StudentPerformance = require('../models/StudentPerformance');
const UserStats = require('../models/UserStats');
const UserBadge = require('../models/UserBadge');
const Badge = require('../models/Badge');
const User = require('../models/User');

// Calculate achievement score based on badges and stats
const calculateAchievementScore = (userStats, userBadges) => {
  let score = 0;
  
  // Points from user stats
  if (userStats) {
    score += (userStats.totalPoints || 0) * 0.1; // 10% of total points
    score += (userStats.achievements?.loginDays || 0) * 2; // 2 points per login day
    score += (userStats.achievements?.assignmentsCompleted || 0) * 5; // 5 points per assignment
  }
  
  // Points from badges (weighted by rarity)
  userBadges.forEach(userBadge => {
    const badge = userBadge.badgeId;
    if (badge) {
      const rarityMultiplier = {
        'common': 1,
        'rare': 2,
        'epic': 3,
        'legendary': 5
      };
      score += (badge.points || 10) * (rarityMultiplier[badge.rarity] || 1);
    }
  });
  
  return Math.min(100, score); // Cap at 100
};

// Enhanced ML algorithm using multiple performance factors including achievements
const predictComprehensivePerformance = (data) => {
  const { scores, examAverage, assignmentAverage, attendanceRate, studyTime, resourcesUsed, achievementScore, badgeCount } = data;
  
  if (scores.length < 2) {
    return {
      nextScore: examAverage || assignmentAverage || 75,
      trend: 'stable',
      confidence: 0.4
    };
  }

  // Calculate trend using linear regression on scores
  const n = scores.length;
  const x = Array.from({length: n}, (_, i) => i + 1);
  const y = scores;
  
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  // Base prediction from linear regression
  let nextScore = Math.max(0, Math.min(100, slope * (n + 1) + intercept));
  
  // Apply attendance factor (attendance affects performance)
  const attendanceFactor = attendanceRate / 100;
  nextScore = nextScore * (0.7 + 0.3 * attendanceFactor);
  
  // Apply study engagement factor (including achievements)
  const engagementFactor = Math.min(1.3, 1 + (studyTime * 0.01) + (resourcesUsed * 0.005) + (achievementScore * 0.002));
  nextScore = nextScore * engagementFactor;
  
  // Apply achievement motivation factor
  const achievementFactor = Math.min(1.15, 1 + (badgeCount * 0.02) + (achievementScore * 0.001));
  nextScore = nextScore * achievementFactor;
  
  // Ensure score is within bounds
  nextScore = Math.max(0, Math.min(100, nextScore));
  
  // Determine trend with multiple factors
  let trend = 'stable';
  if (slope > 2 && attendanceRate > 80) trend = 'improving';
  else if (slope < -2 || attendanceRate < 60) trend = 'declining';
  
  // Calculate confidence based on data consistency and completeness
  const avgScore = sumY / n;
  const variance = y.reduce((sum, score) => sum + Math.pow(score - avgScore, 2), 0) / n;
  let confidence = Math.max(0.3, Math.min(0.9, 1 - (variance / 1000)));
  
  // Boost confidence with more data points and achievements
  if (examAverage > 0 && assignmentAverage > 0) confidence += 0.1;
  if (attendanceRate > 0) confidence += 0.1;
  if (achievementScore > 20) confidence += 0.05; // High achievers are more predictable
  if (badgeCount > 3) confidence += 0.05; // Badge earners show consistent patterns
  confidence = Math.min(0.95, confidence);
  
  return { nextScore, trend, confidence };
};

// Generate comprehensive recommendations
const generateComprehensiveRecommendations = (prediction, historicalData, subject) => {
  const recommendations = [];
  
  // Performance trend recommendations
  if (prediction.trend === 'declining') {
    recommendations.push('📉 Your scores are declining - immediate action needed');
    recommendations.push('👨🏫 Schedule extra tutoring sessions');
    recommendations.push('📚 Review fundamentals in ' + subject);
  } else if (prediction.trend === 'improving') {
    recommendations.push('📈 Excellent progress! Keep up the momentum');
    recommendations.push('🎯 Challenge yourself with harder problems');
  }
  
  // Attendance-based recommendations
  if (historicalData.attendanceRate < 70) {
    recommendations.push('⚠️ Low attendance detected - attend more classes');
    recommendations.push('📞 Contact tutor about missed sessions');
  } else if (historicalData.attendanceRate > 90) {
    recommendations.push('✅ Great attendance! This helps your performance');
  }
  
  // Score-based recommendations
  if (historicalData.overallAverage < 50) {
    recommendations.push('🚨 Critical: Focus on basic concepts immediately');
    recommendations.push('📖 Use more study resources and practice materials');
  } else if (historicalData.overallAverage < 70) {
    recommendations.push('📝 Practice more problems to improve understanding');
    recommendations.push('🔍 Identify and work on weak topics');
  } else if (historicalData.overallAverage > 85) {
    recommendations.push('🌟 Outstanding performance! Consider helping peers');
    recommendations.push('🎓 Explore advanced topics in ' + subject);
  }
  
  // Exam vs Assignment performance
  if (historicalData.examAverage > 0 && historicalData.assignmentAverage > 0) {
    if (historicalData.examAverage < historicalData.assignmentAverage - 10) {
      recommendations.push('📝 Exam performance lower than assignments - work on test-taking skills');
    } else if (historicalData.assignmentAverage < historicalData.examAverage - 10) {
      recommendations.push('📋 Assignment scores low - be more consistent with homework');
    }
  }
  
  // Study engagement recommendations
  if (historicalData.studyDays < 10) {
    recommendations.push('⏰ Increase study frequency - aim for daily practice');
  }
  
  if (historicalData.resourcesAccessed < 5) {
    recommendations.push('📚 Access more study materials and resources');
  }
  
  // Achievement-based recommendations
  if (historicalData.totalBadges < 3) {
    recommendations.push('🏆 Earn more badges by completing assignments and maintaining streaks');
  }
  
  if (historicalData.achievementScore < 20) {
    recommendations.push('⭐ Improve your achievement score through consistent study habits');
  } else if (historicalData.achievementScore > 50) {
    recommendations.push('🌟 Excellent achievement score! You\'re a dedicated learner');
  }
  
  return recommendations;
};

// Calculate comprehensive risk level
const calculateComprehensiveRisk = (prediction, historicalData) => {
  let riskScore = 0;
  
  // Score-based risk
  if (prediction.nextScore < 40) riskScore += 3;
  else if (prediction.nextScore < 60) riskScore += 2;
  else if (prediction.nextScore < 75) riskScore += 1;
  
  // Trend-based risk
  if (prediction.trend === 'declining') riskScore += 2;
  else if (prediction.trend === 'stable' && historicalData.overallAverage < 70) riskScore += 1;
  
  // Attendance-based risk
  if (historicalData.attendanceRate < 60) riskScore += 2;
  else if (historicalData.attendanceRate < 80) riskScore += 1;
  
  // Engagement-based risk
  if (historicalData.studyDays < 5) riskScore += 1;
  if (historicalData.resourcesAccessed < 3) riskScore += 1;
  
  // Achievement-based risk (low achievers are higher risk)
  if (historicalData.achievementScore < 10) riskScore += 1;
  if (historicalData.totalBadges === 0) riskScore += 1;
  
  // Determine risk level
  if (riskScore >= 5) return 'high';
  if (riskScore >= 3) return 'medium';
  return 'low';
};

// Identify weak areas
const identifyWeakAreas = (historicalData) => {
  const weakAreas = [];
  
  if (historicalData.attendanceRate < 75) weakAreas.push('Class Attendance');
  if (historicalData.examAverage > 0 && historicalData.examAverage < 60) weakAreas.push('Exam Performance');
  if (historicalData.assignmentAverage > 0 && historicalData.assignmentAverage < 70) weakAreas.push('Assignment Completion');
  if (historicalData.studyDays < 10) weakAreas.push('Study Consistency');
  if (historicalData.resourcesAccessed < 5) weakAreas.push('Resource Utilization');
  if (historicalData.totalBadges < 2) weakAreas.push('Achievement Motivation');
  if (historicalData.achievementScore < 15) weakAreas.push('Goal Achievement');
  
  return weakAreas;
};

// Identify strengths
const identifyStrengths = (historicalData) => {
  const strengths = [];
  
  if (historicalData.attendanceRate > 90) strengths.push('Excellent Attendance');
  if (historicalData.examAverage > 85) strengths.push('Strong Exam Performance');
  if (historicalData.assignmentAverage > 85) strengths.push('Consistent Assignment Quality');
  if (historicalData.studyDays > 20) strengths.push('Regular Study Habits');
  if (historicalData.resourcesAccessed > 15) strengths.push('Active Resource Usage');
  if (historicalData.totalBadges > 5) strengths.push('High Achievement Motivation');
  if (historicalData.achievementScore > 40) strengths.push('Excellent Goal Achievement');
  
  return strengths;
};

// Calculate motivation level based on achievements
const calculateMotivationLevel = (historicalData) => {
  let motivationScore = 0;
  
  // Badge-based motivation
  motivationScore += historicalData.totalBadges * 10;
  
  // Achievement score contribution
  motivationScore += historicalData.achievementScore * 0.5;
  
  // Study consistency contribution
  motivationScore += historicalData.studyDays * 2;
  
  // Resource usage contribution
  motivationScore += historicalData.resourcesAccessed * 3;
  
  // Determine motivation level
  if (motivationScore >= 80) return 'Very High';
  if (motivationScore >= 60) return 'High';
  if (motivationScore >= 40) return 'Medium';
  if (motivationScore >= 20) return 'Low';
  return 'Very Low';
};

// Get student performance prediction
const getStudentPrediction = async (req, res) => {
  try {
    const studentId = req.params.studentId || req.user._id;
    const { subject } = req.query;

    // Get comprehensive student data including achievements
    const [performanceData, assignments, userStats, userBadges] = await Promise.all([
      StudentPerformance.find({ studentId }).sort({ createdAt: 1 }),
      Assignment.find({ studentId, score: { $exists: true, $ne: null } }).sort({ submittedAt: 1 }),
      UserStats.findOne({ userId: studentId }),
      UserBadge.find({ userId: studentId }).populate('badgeId')
    ]);

    if (performanceData.length === 0 && assignments.length === 0) {
      return res.json({
        message: 'No performance data available for prediction',
        prediction: null
      });
    }

    // Group performance data by subject
    const subjectGroups = {};
    
    // Add exam/test scores from StudentPerformance
    performanceData.forEach(perf => {
      const subj = perf.subject || 'General';
      if (!subjectGroups[subj]) {
        subjectGroups[subj] = {
          examScores: [],
          assignmentScores: [],
          attendance: [],
          resourcesUsed: 0,
          studyTime: 0
        };
      }
      
      if (perf.examScore !== undefined) subjectGroups[subj].examScores.push(perf.examScore);
      if (perf.testScore !== undefined) subjectGroups[subj].examScores.push(perf.testScore);
      if (perf.attendance !== undefined) subjectGroups[subj].attendance.push(perf.attendance);
    });

    // Add assignment scores
    assignments.forEach(assignment => {
      const subj = assignment.subject || 'General';
      if (!subjectGroups[subj]) {
        subjectGroups[subj] = {
          examScores: [],
          assignmentScores: [],
          attendance: [],
          resourcesUsed: 0,
          studyTime: 0
        };
      }
      subjectGroups[subj].assignmentScores.push(assignment.score);
    });

    // Add user activity and achievement data
    const achievementScore = calculateAchievementScore(userStats, userBadges);
    
    if (userStats || userBadges.length > 0) {
      Object.keys(subjectGroups).forEach(subj => {
        subjectGroups[subj].studyTime = userStats?.achievements?.loginDays || 0;
        subjectGroups[subj].resourcesUsed = userStats?.achievements?.assignmentsCompleted || 0;
        subjectGroups[subj].achievementScore = achievementScore;
        subjectGroups[subj].badgeCount = userBadges.length;
      });
    }

    const predictions = {};

    for (const [subj, data] of Object.entries(subjectGroups)) {
      // Combine all scores for comprehensive analysis
      const allScores = [...data.examScores, ...data.assignmentScores];
      if (allScores.length === 0) continue;

      const recentScores = allScores.slice(-8); // Last 8 scores
      const examAverage = data.examScores.length > 0 ? 
        data.examScores.reduce((a, b) => a + b, 0) / data.examScores.length : 0;
      const assignmentAverage = data.assignmentScores.length > 0 ? 
        data.assignmentScores.reduce((a, b) => a + b, 0) / data.assignmentScores.length : 0;
      const overallAverage = allScores.reduce((a, b) => a + b, 0) / allScores.length;
      const attendanceRate = data.attendance.length > 0 ? 
        data.attendance.reduce((a, b) => a + b, 0) / data.attendance.length : 85;

      // Enhanced prediction with achievements and badges
      const prediction = predictComprehensivePerformance({
        scores: recentScores,
        examAverage,
        assignmentAverage,
        attendanceRate,
        studyTime: data.studyTime,
        resourcesUsed: data.resourcesUsed,
        achievementScore: data.achievementScore || 0,
        badgeCount: data.badgeCount || 0
      });

      const historicalData = {
        recentScores,
        overallAverage: Math.round(overallAverage * 100) / 100,
        examAverage: Math.round(examAverage * 100) / 100,
        assignmentAverage: Math.round(assignmentAverage * 100) / 100,
        attendanceRate: Math.round(attendanceRate * 100) / 100,
        totalExams: data.examScores.length,
        totalAssignments: data.assignmentScores.length,
        studyDays: data.studyTime,
        resourcesAccessed: data.resourcesUsed,
        achievementScore: data.achievementScore || 0,
        totalBadges: data.badgeCount || 0,
        improvementRate: recentScores.length > 1 ? 
          ((recentScores[recentScores.length - 1] - recentScores[0]) / recentScores.length) : 0
      };

      const riskLevel = calculateComprehensiveRisk(prediction, historicalData);
      const recommendations = generateComprehensiveRecommendations(prediction, historicalData, subj);

      predictions[subj] = {
        nextExamScore: Math.round(prediction.nextScore * 100) / 100,
        trend: prediction.trend,
        riskLevel,
        confidence: Math.round(prediction.confidence * 100) / 100,
        historicalData,
        recommendations,
        weakAreas: identifyWeakAreas(historicalData),
        strengths: identifyStrengths(historicalData),
        motivationLevel: calculateMotivationLevel(historicalData)
      };

      // Save/update prediction in database
      await PerformancePrediction.findOneAndUpdate(
        { studentId, subject: subj },
        {
          studentId,
          subject: subj,
          predictions: {
            nextAssignmentScore: predictions[subj].nextExamScore,
            trend: predictions[subj].trend,
            riskLevel: predictions[subj].riskLevel,
            confidence: predictions[subj].confidence
          },
          historicalData: predictions[subj].historicalData,
          recommendations: predictions[subj].recommendations,
          lastUpdated: new Date()
        },
        { upsert: true, new: true }
      );
    }

    res.json({
      studentId,
      predictions,
      generatedAt: new Date()
    });

  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ message: 'Error generating prediction', error: error.message });
  }
};

// Get all students' predictions (Admin/Tutor)
const getAllPredictions = async (req, res) => {
  try {
    const predictions = await PerformancePrediction.find()
      .populate('studentId', 'name email className')
      .sort({ 'predictions.riskLevel': -1, lastUpdated: -1 });

    // Group by risk level
    const riskGroups = {
      high: predictions.filter(p => p.predictions.riskLevel === 'high'),
      medium: predictions.filter(p => p.predictions.riskLevel === 'medium'),
      low: predictions.filter(p => p.predictions.riskLevel === 'low')
    };

    res.json({
      total: predictions.length,
      riskGroups,
      predictions
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching predictions', error: error.message });
  }
};

// Trigger prediction update for all students
const updateAllPredictions = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' });
    let updated = 0;

    for (const student of students) {
      try {
        // Trigger prediction for each student
        await axios.get(`http://localhost:5000/api/ml/predict/${student._id}`, {
          headers: { Authorization: req.headers.authorization }
        });
        updated++;
      } catch (error) {
        console.error(`Failed to update prediction for student ${student._id}:`, error.message);
      }
    }

    res.json({
      message: `Updated predictions for ${updated}/${students.length} students`,
      updated,
      total: students.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating predictions', error: error.message });
  }
};

module.exports = {
  getStudentPrediction,
  getAllPredictions,
  updateAllPredictions
};