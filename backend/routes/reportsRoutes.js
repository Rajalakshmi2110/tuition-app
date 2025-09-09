const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../Middleware/authMiddleware');
const {
  getDashboardAnalytics,
  getRevenueTrends,
  getPerformanceByClass,
  getSubjectPerformance,
  getPaymentDistribution,
  getTutorPerformance,
  generateCustomReport
} = require('../controllers/reportsController');

// Admin-only routes
router.get('/dashboard', protect, adminOnly, getDashboardAnalytics);
router.get('/revenue-trends', protect, adminOnly, getRevenueTrends);
router.get('/performance-by-class', protect, adminOnly, getPerformanceByClass);
router.get('/subject-performance', protect, adminOnly, getSubjectPerformance);
router.get('/payment-distribution', protect, adminOnly, getPaymentDistribution);
router.get('/tutor-performance', protect, adminOnly, getTutorPerformance);
router.post('/custom-report', protect, adminOnly, generateCustomReport);

module.exports = router;