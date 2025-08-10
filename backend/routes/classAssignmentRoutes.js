const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  assignTutorToClass,
  enrollStudentInClass,
  getTutorsOfClass,
  getStudentsOfClass,
} = require("../controllers/classAssignmentController");

router.post("/assign-tutor", protect, adminOnly, assignTutorToClass);
router.post("/enroll-student", protect, adminOnly, enrollStudentInClass);

router.get("/:classId/tutors", protect, adminOnly, getTutorsOfClass);
router.get("/:classId/students", protect, adminOnly, getStudentsOfClass);

module.exports = router;
