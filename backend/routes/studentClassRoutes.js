// routes/studentClassRoutes.js
const express = require("express");
const router = express.Router();
const StudentClass = require("../models/StudentClass");

// Admin/manual endpoint to create student-class link
router.post("/", async (req, res) => {
  try {
    const { studentId, classId } = req.body;
    if (!studentId || !classId) {
      return res.status(400).json({ message: "studentId and classId are required" });
    }

    const existing = await StudentClass.findOne({ studentId, classId });
    if (existing) {
      return res.status(400).json({ message: "This student is already enrolled in the class" });
    }

    const studentClass = await StudentClass.create({ studentId, classId });
    res.status(201).json(studentClass);
  } catch (err) {
    console.error("Error creating student-class link:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
