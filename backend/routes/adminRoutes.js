const express = require("express");
const router = express.Router();
const User = require('../models/User');
const Class = require('../models/Class');
const File = require('../models/File');

const { protect, adminOnly } = require("../Middleware/authMiddleware");
const { getUsersByRole, approveTutor, declineTutor } = require("../controllers/adminController");

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
    console.log('Found feedback count:', feedback.length);
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
    console.log('Fetching stats...');
    
    const activeStudents = await User.countDocuments({ role: 'student' });
    console.log('Active students:', activeStudents);
    
    // Check all tutors first
    const allTutors = await User.countDocuments({ role: 'tutor' });
    console.log('All tutors:', allTutors);
    
    const expertTutors = await User.countDocuments({ role: 'tutor', status: 'approved' });
    console.log('Expert tutors (approved):', expertTutors);
    
    const completedClasses = await Class.countDocuments({ status: 'completed' });
    console.log('Completed classes:', completedClasses);
    
    const studyMaterials = await File.countDocuments();
    console.log('Study materials:', studyMaterials);
    
    const stats = {
      activeStudents,
      expertTutors, // Use the count of approved tutors
      completedClasses,
      studyMaterials
    };
    
    console.log('Final stats:', stats);
    res.json(stats);
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
