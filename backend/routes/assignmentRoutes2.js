const express = require('express');
const router = express.Router();
const { protect, tutorOnly } = require('../middleware/authMiddleware');
const {
  createAssignment,
  getAssignmentsForStudent,
  getTutorAssignments,
  submitAssignment,
  getAssignmentSubmissions,
  gradeAssignment,
  getStudentSubmissions
} = require('../controllers/assignmentController');

// Tutor routes
router.post('/', protect, tutorOnly, createAssignment);
router.get('/tutor', protect, tutorOnly, getTutorAssignments);
router.get('/:assignmentId/submissions', protect, tutorOnly, getAssignmentSubmissions);
router.put('/submissions/:submissionId/grade', protect, tutorOnly, gradeAssignment);

// Student routes
router.get('/student', protect, getAssignmentsForStudent);
router.post('/:assignmentId/submit', protect, submitAssignment);
router.get('/submissions', protect, getStudentSubmissions);

module.exports = router;