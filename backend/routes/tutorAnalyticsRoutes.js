const express = require('express');
const router = express.Router();
const { protect } = require('../Middleware/authMiddleware');
const User = require('../models/User');
const Class = require('../models/Class');
const Announcement = require('../models/Announcement');
const {
  getClassAnalytics,
  getAllClassesAnalytics
} = require('../controllers/tutorAnalyticsController');

// Dashboard stats for tutor
router.get('/stats', protect, async (req, res) => {
  try {
    const [totalStudents, totalAnnouncements] = await Promise.all([
      Class.find({ tutor: req.user._id }).distinct('students').then(ids => ids.length),
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