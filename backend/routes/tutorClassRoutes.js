// routes/tutorClassRoutes.js
const express = require("express");
const router = express.Router();
const TutorClass = require("../models/TutorClass");

// Admin/manual endpoint to create tutor-class link
router.post("/", async (req, res) => {
  try {
    const { tutorId, classId } = req.body;
    const newTutorClass = await TutorClass.create({ tutorId, classId });
    res.status(201).json(newTutorClass);
  } catch (err) {
    console.error("Error creating tutor-class link:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all classes assigned to a tutor with enrolled students
router.get("/:tutorId", async (req, res) => {
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
    console.error("Error fetching tutor classes:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
