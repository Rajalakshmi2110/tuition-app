const express = require('express');
const router = express.Router();
const { protect } = require('../Middleware/authMiddleware');
const {
  getClassAnalytics,
  getAllClassesAnalytics
} = require('../controllers/tutorAnalyticsController');

// Tutor analytics routes
router.get('/classes', protect, getAllClassesAnalytics);
router.get('/class/:classId', protect, getClassAnalytics);

module.exports = router;