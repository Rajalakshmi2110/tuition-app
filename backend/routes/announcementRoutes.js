const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const { protect, adminOnly } = require('../Middleware/authMiddleware');

// Get all announcements
router.get('/', protect, async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate('postedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create announcement (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, message, type } = req.body;
    const announcement = await Announcement.create({
      title,
      message,
      type,
      postedBy: req.user._id
    });

    const populatedAnnouncement = await Announcement.findById(announcement._id)
      .populate('postedBy', 'name');

    res.status(201).json(populatedAnnouncement);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete announcement (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Announcement deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;