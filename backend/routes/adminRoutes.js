const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middleware/authMiddleware");
const { getUsersByRole, approveTutor, declineTutor } = require("../controllers/adminController");

// Get all tutors
router.get("/tutors", protect, adminOnly, (req, res) =>
  getUsersByRole(req, res, "tutor")
);

// Get all pending tutors
router.get("/tutors/pending", protect, adminOnly, (req, res) =>
  getUsersByRole(req, res, "tutor", "pending")
);

// Approve tutor
router.patch("/tutors/:id/approve", protect, adminOnly, approveTutor);

// Decline tutor
router.patch("/tutors/:id/decline", protect, adminOnly, declineTutor);

// Get all students
router.get("/students", protect, adminOnly, (req, res) =>
  getUsersByRole(req, res, "student")
);

module.exports = router;
