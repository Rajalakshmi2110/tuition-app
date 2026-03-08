// routes/tutorClassRoutes.js
const express = require("express");
const router = express.Router();
const TutorClass = require("../models/TutorClass");
const { protect, adminOnly } = require("../Middleware/authMiddleware");

// Admin endpoint to create tutor-class link
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { tutorId, classId } = req.body;
    const newTutorClass = await TutorClass.create({ tutorId, classId });
    res.status(201).json(newTutorClass);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all classes assigned to a tutor with enrolled students
router.get("/:tutorId", protect, async (req, res) => {
  try {
    const tutorLinks = await TutorClass.find({ tutorId: req.params.tutorId })
      .populate({
        path: "classId",
        populate: { path: "students", select: "name email" }
      });

    if (!tutorLinks.length) {
      return res.status(404).json({ message: "No classes found for this tutor" });
    }

    const classes = tutorLinks.map(link => link.classId);
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
