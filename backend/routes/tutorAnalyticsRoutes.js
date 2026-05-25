const express = require('express');
const router = express.Router();
const { protect } = require('../Middleware/authMiddleware');
const User = require('../models/User');
const Class = require('../models/Class');
const StudentClass = require('../models/StudentClass');
const Announcement = require('../models/Announcement');
const {
  getClassAnalytics,
  getAllClassesAnalytics
} = require('../controllers/tutorAnalyticsController');

// Dashboard stats for tutor
router.get('/stats', protect, async (req, res) => {
  try {
    const tutorClasses = await Class.find({ tutor: req.user._id }).select('_id');
    const classIds = tutorClasses.map(c => c._id);
    const [totalStudents, totalAnnouncements] = await Promise.all([
      StudentClass.distinct('studentId', { classId: { $in: classIds } }).then(ids => ids.length),
      Announcement.countDocuments()
    ]);
    res.json({ totalStudents, totalAnnouncements });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Tutor analytics routes
router.get('/classes', protect, getAllClassesAnalytics);
router.get('/class/:classId', protect, getClassAnalytics);

module.exports = router;