const express = require("express");
const router = express.Router();
const { createClass, getAllClasses, getClassById, updateClass   } = require("../controllers/classController");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");
const Class = require('../models/Class');

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

module.exports = router;
