const StudentPerformance = require('../models/StudentPerformance');
const Class = require('../models/Class');
const User = require('../models/User');
const Assignment = require('../models/AssignmentSubmission');

// Get class performance analytics by class level
const getClassAnalytics = async (req, res) => {
  try {
    const tutorId = req.user._id;
    const { classId } = req.params; // This will be className like '10', '11', '12'

    // Get all students in this class level
    const students = await User.find({ role: 'student', className: classId });
    
    if (students.length === 0) {
      return res.status(404).json({ message: 'No students found in this class level' });
    }

    const studentIds = students.map(s => s._id);

    // Get performance data for all students in class
    const [performanceData, assignments] = await Promise.all([
      StudentPerformance.find({ studentId: { $in: studentIds } })
        .populate('studentId', 'name className')
        .sort({ createdAt: -1 }),
      Assignment.find({ studentId: { $in: studentIds }, score: { $exists: true } })
        .populate('studentId', 'name')
        .sort({ submittedAt: -1 })
    ]);

    // Analyze student performance
    const studentAnalytics = {};
    
    students.forEach(student => {
      const studentPerf = performanceData.filter(p => p.studentId._id.toString() === student._id.toString());
      const studentAssignments = assignments.filter(a => a.studentId._id.toString() === student._id.toString());
      
      const examScores = studentPerf.map(p => p.examScore || p.testScore).filter(s => s !== undefined);
      const assignmentScores = studentAssignments.map(a => a.score);
      const allScores = [...examScores, ...assignmentScores];
      
      const avgScore = allScores.length > 0 ? allScores.reduce((a, b) => a + b, 0) / allScores.length : 0;
      const recentScores = allScores.slice(-5);
      const improvement = recentScores.length > 1 ? 
        recentScores[recentScores.length - 1] - recentScores[0] : 0;
      
      let status = 'average';
      if (avgScore >= 85) status = 'excellent';
      else if (avgScore >= 70) status = 'good';
      else if (avgScore >= 50) status = 'average';
      else status = 'needs_attention';
      
      let trend = 'stable';
      if (improvement > 10) trend = 'improving';
      else if (improvement < -10) trend = 'declining';
      
      studentAnalytics[student._id] = {
        name: student.name,
        className: student.className,
        avgScore: Math.round(avgScore * 100) / 100,
        totalExams: examScores.length,
        totalAssignments: assignmentScores.length,
        recentScores,
        improvement: Math.round(improvement * 100) / 100,
        status,
        trend,
        lastActivity: studentPerf[0]?.createdAt || studentAssignments[0]?.submittedAt
      };
    });

    // Class summary statistics
    const allAvgScores = Object.values(studentAnalytics).map(s => s.avgScore).filter(s => s > 0);
    const classAverage = allAvgScores.length > 0 ? 
      allAvgScores.reduce((a, b) => a + b, 0) / allAvgScores.length : 0;
    
    const statusCounts = {
      excellent: Object.values(studentAnalytics).filter(s => s.status === 'excellent').length,
      good: Object.values(studentAnalytics).filter(s => s.status === 'good').length,
      average: Object.values(studentAnalytics).filter(s => s.status === 'average').length,
      needs_attention: Object.values(studentAnalytics).filter(s => s.status === 'needs_attention').length
    };

    const trendCounts = {
      improving: Object.values(studentAnalytics).filter(s => s.trend === 'improving').length,
      stable: Object.values(studentAnalytics).filter(s => s.trend === 'stable').length,
      declining: Object.values(studentAnalytics).filter(s => s.trend === 'declining').length
    };

    res.json({
      classInfo: {
        name: `Class ${classId}`,
        subject: 'All Subjects',
        totalStudents: students.length
      },
      classSummary: {
        classAverage: Math.round(classAverage * 100) / 100,
        statusCounts,
        trendCounts
      },
      studentAnalytics: Object.values(studentAnalytics)
    });

  } catch (error) {
    console.error('Class analytics error:', error);
    res.status(500).json({ message: 'Error fetching class analytics', error: error.message });
  }
};

// Get all students analytics grouped by class level
const getAllClassesAnalytics = async (req, res) => {
  try {
    const tutorId = req.user._id;
    console.log('Fetching analytics for tutor:', tutorId);

    // Get all students grouped by className (10, 11, 12, etc.)
    const students = await User.find({ role: 'student' });
    console.log('Found total students:', students.length);

    // Group students by className
    const classGroups = {};
    students.forEach(student => {
      const className = student.className || 'Unassigned';
      if (!classGroups[className]) {
        classGroups[className] = [];
      }
      classGroups[className].push(student);
    });

    const classAnalytics = [];

    for (const [className, classStudents] of Object.entries(classGroups)) {
      const studentIds = classStudents.map(s => s._id);
      
      const [performanceData, assignments] = await Promise.all([
        StudentPerformance.find({ studentId: { $in: studentIds } }),
        Assignment.find({ studentId: { $in: studentIds }, score: { $exists: true } })
      ]);

      // Calculate class metrics
      const studentScores = [];
      const statusCounts = { excellent: 0, good: 0, average: 0, needs_attention: 0 };

      const subjectAnalysis = {};
      
      classStudents.forEach(student => {
        const studentPerf = performanceData.filter(p => p.studentId.toString() === student._id.toString());
        const studentAssignments = assignments.filter(a => a.studentId.toString() === student._id.toString());
        
        // Group by subject
        const subjectScores = {};
        
        studentPerf.forEach(perf => {
          const subject = perf.subject || 'General';
          if (!subjectScores[subject]) subjectScores[subject] = [];
          if (perf.examScore) subjectScores[subject].push(perf.examScore);
          if (perf.testScore) subjectScores[subject].push(perf.testScore);
        });
        
        studentAssignments.forEach(assignment => {
          const subject = assignment.subject || 'General';
          if (!subjectScores[subject]) subjectScores[subject] = [];
          subjectScores[subject].push(assignment.score);
        });
        
        // Calculate overall average and track subject performance
        const allScores = Object.values(subjectScores).flat();
        
        Object.entries(subjectScores).forEach(([subject, scores]) => {
          if (scores.length > 0) {
            const subjectAvg = scores.reduce((a, b) => a + b, 0) / scores.length;
            
            if (!subjectAnalysis[subject]) {
              subjectAnalysis[subject] = { total: 0, weak: 0 };
            }
            subjectAnalysis[subject].total++;
            if (subjectAvg < 60) subjectAnalysis[subject].weak++;
          }
        });
        
        if (allScores.length > 0) {
          const avgScore = allScores.reduce((a, b) => a + b, 0) / allScores.length;
          studentScores.push(avgScore);
          
          if (avgScore >= 85) statusCounts.excellent++;
          else if (avgScore >= 70) statusCounts.good++;
          else if (avgScore >= 50) statusCounts.average++;
          else statusCounts.needs_attention++;
        } else {
          statusCounts.needs_attention++;
        }
      });
      
      // Identify subjects needing most attention
      const subjectsNeedingAttention = Object.entries(subjectAnalysis)
        .filter(([subject, data]) => data.total > 0 && (data.weak / data.total) > 0.3)
        .map(([subject, data]) => ({
          subject,
          weakStudents: data.weak,
          totalStudents: data.total,
          percentage: Math.round((data.weak / data.total) * 100)
        }))
        .sort((a, b) => b.percentage - a.percentage);

      const classAverage = studentScores.length > 0 ? 
        studentScores.reduce((a, b) => a + b, 0) / studentScores.length : 0;

      classAnalytics.push({
        classId: className,
        className: `Class ${className}`,
        subject: 'All Subjects',
        totalStudents: classStudents.length,
        classAverage: Math.round(classAverage * 100) / 100,
        statusCounts,
        subjectsNeedingAttention
      });
    }

    console.log('Returning analytics for class levels:', Object.keys(classGroups));
    res.json({ 
      classAnalytics,
      totalClasses: classAnalytics.length,
      tutorId 
    });

  } catch (error) {
    console.error('All classes analytics error:', error);
    res.status(500).json({ message: 'Error fetching analytics', error: error.message });
  }
};

module.exports = {
  getClassAnalytics,
  getAllClassesAnalytics
};