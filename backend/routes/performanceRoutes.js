const express = require('express');
const router = express.Router();
const { protect } = require('../Middleware/authMiddleware');
const {
  addPerformance,
  getStudentPerformance,
  getPerformanceAnalytics,
  updatePerformance,
  deletePerformance,
  getTutorStudentsPerformance,
  exportPerformanceCSV
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
router.get('/tutor/students', protect, getTutorStudentsPerformance);
router.get('/export/csv', protect, exportPerformanceCSV);

module.exports = router;