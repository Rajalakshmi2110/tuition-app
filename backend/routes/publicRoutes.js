const express = require('express');
const User = require('../models/User');
const Class = require('../models/Class');
const File = require('../models/File');

const router = express.Router();

// Get public statistics (no auth required)
router.get('/stats', async (req, res) => {
  try {
    const [activeStudents, expertTutors, completedClasses, studyMaterials] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'tutor', status: 'active' }),
      Class.countDocuments({ status: 'completed' }),
      File.countDocuments()
    ]);
    
    res.json({
      activeStudents,
      expertTutors,
      completedClasses,
      studyMaterials
    });
  } catch (err) {
    console.error('Public stats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;