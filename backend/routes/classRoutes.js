const express = require("express");
const router = express.Router();
const { createClass, getAllClasses, getClassById, updateClass   } = require("../controllers/classController");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");
const Class = require('../models/Class');
const StudentClass = require('../models/StudentClass');

// router.post("/create", protect, authorizeRoles('admin'), createClass);

// router.get("/", protect, authorizeRoles('admin', 'tutor'), getAllClasses);

router.post("/create", createClass);

router.get("/", getAllClasses);

router.get("/:id", getClassById);
router.put("/:id", updateClass);

router.get('/:id/announcements', async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id).populate('announcements');
    if (!classItem) return res.status(404).json({ message: 'Class not found' });

    res.status(200).json(classItem.announcements);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/tutor/:tutorId', async (req, res) => {
  try {
    const tutorId = req.params.tutorId;
    const classes = await Class.find({ tutor: tutorId });
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/student/:studentId", async (req, res) => {
  try {
    const studentLinks = await StudentClass.find({ studentId: req.params.studentId })
      .populate({
        path: "classId",
        populate: { path: "tutor", select: "name email" }
      });

    if (!studentLinks.length) {
      return res.status(404).json({ message: "No classes found for this student" });
    }

    const classes = studentLinks.map(link => link.classId);
    res.json(classes);
  } catch (err) {
    console.error("Error fetching student classes:", err);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
