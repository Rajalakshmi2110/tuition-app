const express = require('express');
const Feedback = require('../models/Feedback');

const { protect, adminOnly } = require('../Middleware/authMiddleware');
const { notifyByRole } = require('../services/notificationService');

const router = express.Router();

// Submit feedback (public)
router.post('/', async (req, res) => {
  try {
    const { name, role, rating, message } = req.body;
    
    const feedback = new Feedback({
      name,
      role,
      rating,
      message
    });
    
    const savedFeedback = await feedback.save();

    try {
      await notifyByRole('admin', 'feedback_submitted', 'New Feedback', `${name} (${role}) submitted feedback. Rating: ${rating}/5`, '/admin');
    } catch (e) {}

    res.status(201).json({ message: 'Feedback submitted successfully!' });
  } catch (err) {
    console.error('Feedback POST error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get approved feedback (public)
router.get('/approved', async (req, res) => {
  try {
    const feedback = await Feedback.find({ approved: true })
      .sort({ createdAt: -1 })
      .limit(6);
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;