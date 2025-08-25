const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  addPerformance,
  getStudentPerformance,
  getPerformanceAnalytics,
  updatePerformance,
  deletePerformance
} = require('../controllers/performanceController');

// Student routes
router.post('/', protect, addPerformance);
router.get('/', protect, getStudentPerformance);
router.get('/analytics', protect, getPerformanceAnalytics);
router.put('/:id', protect, updatePerformance);
router.delete('/:id', protect, deletePerformance);

// Tutor/Admin routes to view student performance
router.get('/student/:studentId', protect, getStudentPerformance);
router.get('/student/:studentId/analytics', protect, getPerformanceAnalytics);

module.exports = router;