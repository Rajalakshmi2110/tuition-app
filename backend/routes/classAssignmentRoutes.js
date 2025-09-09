const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../Middleware/authMiddleware");
const {
  assignTutorToClass,
  enrollStudentInClass,
  getTutorsOfClass,
  getStudentsOfClass,
} = require("../controllers/classAssignmentController");

// Assign tutor to a class
router.post("/assign-tutor", protect, adminOnly, assignTutorToClass);

// Enroll student in a class (admin can do manually)
router.post("/enroll-student", protect, adminOnly, enrollStudentInClass);

// Get all tutors of a class
router.get("/:classId/tutors", protect, adminOnly, getTutorsOfClass);

// Get all students of a class
router.get("/:classId/students", protect, adminOnly, getStudentsOfClass);

module.exports = router;
