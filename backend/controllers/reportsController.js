const User = require('../models/User');
const StudentPerformance = require('../models/StudentPerformance');
const Payment = require('../models/Payment');
const Assignment = require('../models/AssignmentSubmission');
const Class = require('../models/Class');
const UserStats = require('../models/UserStats');

// Get dashboard analytics
const getDashboardAnalytics = async (req, res) => {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 7);

    // Get basic counts
    const [totalStudents, totalTutors, totalClasses] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'tutor' }),
      Class.countDocuments()
    ]);

    // Revenue analytics
    const currentMonthRevenue = await Payment.aggregate([
      { $match: { month: currentMonth, status: 'verified' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const lastMonthRevenue = await Payment.aggregate([
      { $match: { month: lastMonth, status: 'verified' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const currentRevenue = currentMonthRevenue[0]?.total || 0;
    const lastRevenue = lastMonthRevenue[0]?.total || 0;
    const revenueGrowth = lastRevenue > 0 ? ((currentRevenue - lastRevenue) / lastRevenue * 100) : 0;

    // Performance analytics
    const performanceData = await StudentPerformance.aggregate([
      { $group: { _id: null, avgScore: { $avg: '$percentage' }, count: { $sum: 1 } } }
    ]);

    const avgPerformance = performanceData[0]?.avgScore || 0;

    // Payment collection rate
    const paymentStats = await Payment.aggregate([
      { $match: { month: currentMonth } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const totalPayments = paymentStats.reduce((sum, stat) => sum + stat.count, 0);
    const verifiedPayments = paymentStats.find(s => s._id === 'verified')?.count || 0;
    const collectionRate = totalPayments > 0 ? (verifiedPayments / totalPayments * 100) : 0;

    // Students at risk (performance < 50%)
    const studentsAtRisk = await StudentPerformance.aggregate([
      { $match: { percentage: { $lt: 50 } } },
      { $group: { _id: '$studentId' } },
      { $count: 'total' }
    ]);

    res.json({
      overview: {
        totalStudents,
        totalTutors,
        totalClasses,
        currentRevenue,
        revenueGrowth: Math.round(revenueGrowth * 100) / 100,
        avgPerformance: Math.round(avgPerformance * 100) / 100,
        collectionRate: Math.round(collectionRate * 100) / 100,
        studentsAtRisk: studentsAtRisk[0]?.total || 0
      }
    });

  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({ message: 'Error fetching dashboard analytics', error: error.message });
  }
};

// Get revenue trends (last 6 months)
const getRevenueTrends = async (req, res) => {
  try {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push(date.toISOString().slice(0, 7));
    }

    const revenueData = await Payment.aggregate([
      { $match: { month: { $in: months }, status: 'verified' } },
      { $group: { _id: '$month', revenue: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const trends = months.map(month => {
      const data = revenueData.find(r => r._id === month);
      return {
        month,
        revenue: data?.revenue || 0,
        payments: data?.count || 0
      };
    });

    res.json({ trends });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching revenue trends', error: error.message });
  }
};

// Get performance analytics by class
const getPerformanceByClass = async (req, res) => {
  try {
    const performanceData = await StudentPerformance.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'studentId',
          foreignField: '_id',
          as: 'student'
        }
      },
      { $unwind: '$student' },
      {
        $group: {
          _id: '$student.className',
          avgScore: { $avg: '$percentage' },
          count: { $sum: 1 },
          maxScore: { $max: '$percentage' },
          minScore: { $min: '$percentage' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({ performanceByClass: performanceData });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching performance by class', error: error.message });
  }
};

// Get subject-wise performance
const getSubjectPerformance = async (req, res) => {
  try {
    const subjectData = await StudentPerformance.aggregate([
      { $match: { subject: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: '$subject',
          avgScore: { $avg: '$percentage' },
          count: { $sum: 1 },
          studentsBelow50: {
            $sum: { $cond: [{ $lt: ['$percentage', 50] }, 1, 0] }
          }
        }
      },
      { $sort: { avgScore: -1 } }
    ]);

    res.json({ subjectPerformance: subjectData });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching subject performance', error: error.message });
  }
};

// Get payment status distribution
const getPaymentDistribution = async (req, res) => {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7);
    
    const paymentData = await Payment.aggregate([
      { $match: { month: currentMonth } },
      { $group: { _id: '$status', count: { $sum: 1 }, amount: { $sum: '$amount' } } }
    ]);

    const totalStudents = await User.countDocuments({ role: 'student' });
    const studentsWithPayments = paymentData.reduce((sum, p) => sum + p.count, 0);
    const unpaidStudents = totalStudents - studentsWithPayments;

    const distribution = [
      ...paymentData.map(p => ({
        status: p._id,
        count: p.count,
        amount: p.amount
      })),
      { status: 'unpaid', count: unpaidStudents, amount: 0 }
    ];

    res.json({ paymentDistribution: distribution });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching payment distribution', error: error.message });
  }
};

// Get tutor performance analytics
const getTutorPerformance = async (req, res) => {
  try {
    const tutorData = await Class.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'tutor',
          foreignField: '_id',
          as: 'tutorInfo'
        }
      },
      { $unwind: '$tutorInfo' },
      {
        $lookup: {
          from: 'studentperformances',
          localField: 'students',
          foreignField: 'studentId',
          as: 'performances'
        }
      },
      {
        $group: {
          _id: '$tutor',
          tutorName: { $first: '$tutorInfo.name' },
          totalClasses: { $sum: 1 },
          totalStudents: { $sum: { $size: '$students' } },
          avgPerformance: { $avg: '$performances.examScore' }
        }
      },
      { $sort: { avgPerformance: -1 } }
    ]);

    res.json({ tutorPerformance: tutorData });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching tutor performance', error: error.message });
  }
};

// Generate custom report
const generateCustomReport = async (req, res) => {
  try {
    const { reportType, dateRange, filters } = req.body;
    
    let reportData = {};

    switch (reportType) {
      case 'student_progress':
        reportData = await generateStudentProgressReport(dateRange, filters);
        break;
      case 'financial_summary':
        reportData = await generateFinancialReport(dateRange, filters);
        break;
      case 'class_performance':
        reportData = await generateClassPerformanceReport(dateRange, filters);
        break;
      default:
        return res.status(400).json({ message: 'Invalid report type' });
    }

    res.json({
      reportType,
      generatedAt: new Date(),
      dateRange,
      filters,
      data: reportData
    });

  } catch (error) {
    res.status(500).json({ message: 'Error generating report', error: error.message });
  }
};

// Helper functions for custom reports
const generateStudentProgressReport = async (dateRange, filters) => {
  const matchConditions = {};
  if (dateRange?.start && dateRange?.end) {
    matchConditions.createdAt = {
      $gte: new Date(dateRange.start),
      $lte: new Date(dateRange.end)
    };
  }

  return await StudentPerformance.aggregate([
    { $match: matchConditions },
    {
      $lookup: {
        from: 'users',
        localField: 'studentId',
        foreignField: '_id',
        as: 'student'
      }
    },
    { $unwind: '$student' },
    {
      $group: {
        _id: '$studentId',
        studentName: { $first: '$student.name' },
        className: { $first: '$student.className' },
        avgScore: { $avg: '$examScore' },
        totalExams: { $sum: 1 },
        improvement: {
          $avg: {
            $subtract: ['$examScore', { $avg: '$examScore' }]
          }
        }
      }
    },
    { $sort: { avgScore: -1 } }
  ]);
};

const generateFinancialReport = async (dateRange, filters) => {
  const matchConditions = { status: 'verified' };
  if (dateRange?.start && dateRange?.end) {
    matchConditions.verifiedAt = {
      $gte: new Date(dateRange.start),
      $lte: new Date(dateRange.end)
    };
  }

  return await Payment.aggregate([
    { $match: matchConditions },
    {
      $group: {
        _id: '$month',
        totalRevenue: { $sum: '$amount' },
        totalPayments: { $sum: 1 },
        avgPayment: { $avg: '$amount' }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

const generateClassPerformanceReport = async (dateRange, filters) => {
  return await StudentPerformance.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'studentId',
        foreignField: '_id',
        as: 'student'
      }
    },
    { $unwind: '$student' },
    {
      $group: {
        _id: {
          className: '$student.className',
          subject: '$subject'
        },
        avgScore: { $avg: '$examScore' },
        studentCount: { $addToSet: '$studentId' },
        totalExams: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: '$_id.className',
        subjects: {
          $push: {
            subject: '$_id.subject',
            avgScore: '$avgScore',
            studentCount: { $size: '$studentCount' },
            totalExams: '$totalExams'
          }
        },
        overallAvg: { $avg: '$avgScore' }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

module.exports = {
  getDashboardAnalytics,
  getRevenueTrends,
  getPerformanceByClass,
  getSubjectPerformance,
  getPaymentDistribution,
  getTutorPerformance,
  generateCustomReport
};