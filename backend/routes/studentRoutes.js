const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");  // fixed here
const { enrollInClass, getMyClasses, getAvailableClasses } = require("../controllers/studentController");
const StudentClass = require("../models/StudentClass");

router.post("/enroll", protect, enrollInClass);

router.get("/my-classes", protect, getMyClasses);

router.get('/available-classes', protect, getAvailableClasses);

router.post("/", async (req, res) => {
  try {
    const { studentId, classId } = req.body;

    if (!studentId || !classId) {
      return res.status(400).json({ message: "studentId and classId are required" });
    }

    const newLink = await StudentClass.create({ studentId, classId });
    res.status(201).json(newLink);
  } catch (err) {
    console.error("Error creating student-class link:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
