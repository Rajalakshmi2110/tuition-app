const express = require("express");
const router = express.Router();
const { protect } = require("../Middleware/authMiddleware");
const authorizeRoles = require("../Middleware/authorizeRoles");

const Class = require("../models/Class");
const StudentClass = require("../models/StudentClass");
const Student = require("../models/User");

// ----- CLASS CRUD -----

router.post("/create", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const { name, subject, schedule, tutor, classLevel } = req.body;
    if (!name || !subject || !schedule || !tutor || !classLevel)
      return res.status(400).json({ message: "All fields are required" });

    const newClass = await Class.create({ name, subject, schedule, tutor, classLevel });
    res.status(201).json(newClass);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    const classes = await Class.find().populate("tutor", "name email");
    res.json(classes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", protect, async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id).populate("tutor", "name email");
    if (!classItem) return res.status(404).json({ message: "Class not found" });
    res.json(classItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedClass) return res.status(404).json({ message: "Class not found" });
    res.json(updatedClass);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ----- STUDENT CLASSES -----

router.get("/student/:studentId", protect, async (req, res) => {
  try {
    const studentLinks = await StudentClass.find({ studentId: req.params.studentId }).populate({
      path: "classId",
      populate: { path: "tutor", select: "name email" },
    });

    if (!studentLinks.length)
      return res.status(404).json({ message: "No classes found for this student" });

    const classes = studentLinks.map((link) => link.classId);
    res.json(classes);
  } catch (err) {
    console.error("Error fetching student classes:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/available-for-student/:studentId", protect, async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const availableClasses = await Class.find({ classLevel: student.classLevel });
    const enrolledLinks = await StudentClass.find({ studentId: student._id });
    const enrolledClassIds = enrolledLinks.map((link) => link.classId.toString());

    const filteredClasses = availableClasses.filter(
      (c) => !enrolledClassIds.includes(c._id.toString())
    );

    res.json(filteredClasses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/enroll", protect, async (req, res) => {
  const { studentId, classId } = req.body;
  try {
    const existing = await StudentClass.findOne({ studentId, classId });
    if (existing) return res.status(400).json({ message: "Already enrolled" });

    const enrollment = await StudentClass.create({ studentId, classId });
    res.status(201).json(enrollment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/tutor/:tutorId", protect, async (req, res) => {
  try {
    const tutorId = req.params.tutorId;

    const tutorLinks = await TutorClass.find({ tutorId }).populate({
      path: "classId",
      populate: { path: "students", select: "name email" }
    });

    const classes = tutorLinks.map(link => link.classId);

    res.json(classes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
