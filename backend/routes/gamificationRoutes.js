const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getUserStats,
  getLeaderboard,
  getAllBadges,
  initializeBadges
} = require('../controllers/gamificationController');

// Initialize badges (admin only)
router.post('/init-badges', protect, async (req, res) => {
  try {
    await initializeBadges();
    res.json({ message: 'Badges initialized successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error initializing badges' });
  }
});

// Get user stats and badges
router.get('/stats/:userId?', protect, getUserStats);

// Get leaderboard
router.get('/leaderboard', protect, getLeaderboard);

// Get all available badges
router.get('/badges', protect, getAllBadges);

module.exports = router;