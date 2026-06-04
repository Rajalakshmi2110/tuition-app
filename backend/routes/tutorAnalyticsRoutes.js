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
    const User = require('../models/User');
    const [totalStudents, totalAnnouncements, totalSessions] = await Promise.all([
      User.countDocuments({ role: 'student', status: 'approved' }),
      Announcement.countDocuments(),
      Class.countDocuments({ tutor: req.user._id })
    ]);
    res.json({ totalStudents, totalAnnouncements, totalSessions });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Tutor analytics routes
router.get('/classes', protect, getAllClassesAnalytics);
router.get('/class/:classId', protect, getClassAnalytics);

module.exports = router;