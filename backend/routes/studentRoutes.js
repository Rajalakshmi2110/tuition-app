// routes/studentRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { enrollInClass, getMyClasses, getAvailableClasses } = require("../controllers/studentController");

// Enroll student in a class
router.post("/enroll", protect, enrollInClass);

// Get all classes the student is enrolled in
router.get("/my-classes", protect, getMyClasses);

// Get available classes for the student
router.get("/available-classes", protect, getAvailableClasses);

module.exports = router;
