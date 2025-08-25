const StudentPerformance = require('../models/StudentPerformance');
const User = require('../models/User');
const mongoose = require('mongoose');

// Add student performance record
const addPerformance = async (req, res) => {
  try {
    const { subject, examType, totalMarks, obtainedMarks, examDate, academicYear, term } = req.body;
    
    console.log('Adding performance for user:', req.user._id, req.user.name);
    
    const performance = new StudentPerformance({
      studentId: req.user._id,
      subject,
      examType,
      totalMarks,
      obtainedMarks,
      examDate,
      academicYear,
      term
    });

    await performance.save();
    console.log('Performance saved:', performance._id);
    res.status(201).json({ message: 'Performance record added successfully', performance });
  } catch (error) {
    console.error('Add Performance Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get student's performance records
const getStudentPerformance = async (req, res) => {
  try {
    const studentId = (req.user.role === 'student' || req.user.role === 'tutor') ? req.user._id : req.params.studentId;
    
    console.log('Fetching performances for user:', studentId, req.user.name);
    
    const performances = await StudentPerformance.find({ studentId })
      .sort({ examDate: -1 })
      .populate('studentId', 'name email');

    console.log('Found performances:', performances.length);
    res.json(performances);
  } catch (error) {
    console.error('Get Performance Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get performance analytics
const getPerformanceAnalytics = async (req, res) => {
  try {
    const studentId = (req.user.role === 'student' || req.user.role === 'tutor') ? req.user._id : req.params.studentId;
    
    // Subject-wise average
    const subjectAnalytics = await StudentPerformance.aggregate([
      { $match: { studentId: new mongoose.Types.ObjectId(studentId) } },
      {
        $group: {
          _id: '$subject',
          averagePercentage: { $avg: '$percentage' },
          totalExams: { $sum: 1 },
          bestScore: { $max: '$percentage' },
          worstScore: { $min: '$percentage' }
        }
      }
    ]);

    // Recent performance trend
    const recentPerformance = await StudentPerformance.find({ studentId })
      .sort({ examDate: -1 })
      .limit(10)
      .select('subject percentage examDate examType');

    res.json({
      subjectAnalytics,
      recentPerformance,
      totalRecords: await StudentPerformance.countDocuments({ studentId })
    });
  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update performance record
const updatePerformance = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const performance = await StudentPerformance.findOneAndUpdate(
      { _id: id, studentId: req.user._id },
      updates,
      { new: true }
    );

    if (!performance) {
      return res.status(404).json({ message: 'Performance record not found' });
    }

    res.json({ message: 'Performance updated successfully', performance });
  } catch (error) {
    console.error('Update Performance Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete performance record
const deletePerformance = async (req, res) => {
  try {
    const { id } = req.params;
    
    const performance = await StudentPerformance.findOneAndDelete({
      _id: id,
      studentId: req.user._id
    });

    if (!performance) {
      return res.status(404).json({ message: 'Performance record not found' });
    }

    res.json({ message: 'Performance record deleted successfully' });
  } catch (error) {
    console.error('Delete Performance Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addPerformance,
  getStudentPerformance,
  getPerformanceAnalytics,
  updatePerformance,
  deletePerformance
};