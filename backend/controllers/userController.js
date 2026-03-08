const User = require('../models/User');

const getAllTutors = async (req, res) => {
  try {
    const tutors = await User.find({ 
      role: 'tutor', 
      status: 'approved' 
    }).select('-password');
    res.json({ tutors });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllTutors };
