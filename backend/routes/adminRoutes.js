const express = require("express");
const router = express.Router();
const User = require('../models/User');
const Class = require('../models/Class');
const File = require('../models/File');

const { protect, adminOnly } = require("../Middleware/authMiddleware");
const { getUsersByRole, approveTutor, declineTutor } = require("../controllers/adminController");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

router.get("/tutors", protect, adminOnly, (req, res) =>
  getUsersByRole(req, res, "tutor")
);

router.get("/tutors/pending", protect, adminOnly, (req, res) =>
  getUsersByRole(req, res, "tutor", "pending")
);

router.patch("/tutors/:id/approve", protect, adminOnly, approveTutor);

router.patch("/tutors/:id/decline", protect, adminOnly, declineTutor);

router.get("/students", protect, adminOnly, (req, res) =>
  getUsersByRole(req, res, "student")
);

// Get all feedback for admin
router.get("/feedback", protect, adminOnly, async (req, res) => {
  try {
    const Feedback = require('../models/Feedback');
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedback);
  } catch (err) {
    console.error('Admin feedback fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve feedback
router.patch("/feedback/:id/approve", protect, adminOnly, async (req, res) => {
  try {
    const Feedback = require('../models/Feedback');
    await Feedback.findByIdAndUpdate(req.params.id, { approved: true });
    res.json({ message: 'Feedback approved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete feedback
router.delete("/feedback/:id", protect, adminOnly, async (req, res) => {
  try {
    const Feedback = require('../models/Feedback');
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: 'Feedback deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get dashboard statistics
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    
    const activeStudents = await User.countDocuments({ role: 'student' });
    
    const expertTutors = await User.countDocuments({ role: 'tutor', status: 'approved' });
    
    const completedClasses = await Class.countDocuments({ status: 'completed' });
    
    const studyMaterials = await File.countDocuments();
    
    const stats = {
      activeStudents,
      expertTutors,
      completedClasses,
      studyMaterials
    };
    
    res.json(stats);
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
