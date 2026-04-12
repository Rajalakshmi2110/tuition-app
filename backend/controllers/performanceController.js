const StudentPerformance = require('../models/StudentPerformance');
const User = require('../models/User');
const mongoose = require('mongoose');
const { syncToSheet } = require('../services/googleSheetsService');

// Add student performance record
const addPerformance = async (req, res) => {
  try {
    const { subject, examType, totalMarks, obtainedMarks, examDate, academicYear, term } = req.body;
    
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

    try {
      const student = await User.findById(req.user._id).select('name email className');
      syncToSheet(performance, student);
    } catch (e) {}

    res.status(201).json({ message: 'Performance record added successfully', performance });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get student's performance records
const getStudentPerformance = async (req, res) => {
  try {
    const studentId = req.params.studentId || req.user._id;
    
    const performances = await StudentPerformance.find({ studentId })
      .sort({ examDate: -1 })
      .populate('studentId', 'name email');

    res.json(performances);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get performance analytics
const getPerformanceAnalytics = async (req, res) => {
  try {
    const studentId = req.params.studentId || req.user._id;
    
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
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all students' performance for a tutor
const getTutorStudentsPerformance = async (req, res) => {
  try {
    const Class = require('../models/Class');
    const StudentClass = require('../models/StudentClass');
    const tutorClasses = await Class.find({ tutor: req.user._id });
    
    // Get student IDs from StudentClass join table
    const classIds = tutorClasses.map(cls => cls._id);
    const enrollments = await StudentClass.find({ classId: { $in: classIds } });
    const studentIds = [...new Set(enrollments.map(e => e.studentId.toString()))].map(id => new mongoose.Types.ObjectId(id));
    
    // Get performance records for all these students
    const performances = await StudentPerformance.find({ 
      studentId: { $in: studentIds } 
    })
    .sort({ examDate: -1 })
    .populate('studentId', 'name email');
    
    res.json(performances);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const exportPerformanceCSV = async (req, res) => {
  try {
    const records = await StudentPerformance.find()
      .populate('studentId', 'name email className')
      .sort({ examDate: -1 });

    const header = 'Student Name,Email,Class,Subject,Exam Type,Total Marks,Obtained Marks,Percentage,Grade,Exam Date,Term,Academic Year\n';
    const rows = records.map(r => [
      r.studentId?.name || '', r.studentId?.email || '', r.studentId?.className || '',
      r.subject, r.examType, r.totalMarks, r.obtainedMarks,
      r.percentage?.toFixed(1), r.grade,
      new Date(r.examDate).toLocaleDateString('en-IN'),
      r.term, r.academicYear
    ].map(v => `"${v}"`).join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=student_marks.csv');
    res.send(header + rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to export' });
  }
};

module.exports = {
  addPerformance,
  getStudentPerformance,
  getPerformanceAnalytics,
  updatePerformance,
  deletePerformance,
  getTutorStudentsPerformance,
  exportPerformanceCSV
};