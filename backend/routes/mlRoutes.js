const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  getStudentPrediction,
  getAllPredictions,
  updateAllPredictions
} = require('../controllers/mlController');

// Student routes
router.get('/predict/:studentId?', protect, getStudentPrediction);

// Admin/Tutor routes
router.get('/predictions/all', protect, getAllPredictions);
router.post('/predictions/update-all', protect, adminOnly, updateAllPredictions);

module.exports = router;