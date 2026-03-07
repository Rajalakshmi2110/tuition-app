const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect, tutorOnly } = require('../Middleware/authMiddleware');
const {
  createAssignment,
  getAssignmentsForStudent,
  getTutorAssignments,
  submitAssignment,
  getAssignmentSubmissions,
  gradeAssignment,
  getStudentSubmissions
} = require('../controllers/assignmentController');

// Multer setup for assignment file uploads
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    cb(null, 'assignment-' + Date.now() + '.' + ext);
  }
});
const upload = multer({ storage });

// Tutor routes
router.post('/', protect, tutorOnly, createAssignment);
router.get('/tutor', protect, tutorOnly, getTutorAssignments);
router.get('/:assignmentId/submissions', protect, tutorOnly, getAssignmentSubmissions);
router.put('/submissions/:submissionId/grade', protect, tutorOnly, gradeAssignment);

// Student routes
router.get('/student', protect, getAssignmentsForStudent);
router.post('/:assignmentId/submit', protect, upload.single('file'), submitAssignment);
router.get('/submissions', protect, getStudentSubmissions);

module.exports = router;