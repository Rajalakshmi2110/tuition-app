const User = require('../models/User');

const getAllTutors = async (req, res) => {
  try {
    const tutors = await User.find({ role: 'tutor' }).select('-password');
    res.json({ tutors });
  } catch (err) {
    console.error('Error fetching tutors:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllTutors };
