const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../Middleware/authMiddleware");
const { getAllTutors } = require('../controllers/userController');

router.get("/", (req, res) => {
    res.json({message: "user route is working!"})
});

router.get('/dashboard', protect, authorize('admin', 'tutor'), (req, res) => {
  res.json({
    message: `Welcome ${req.user.role}!`,
    user: req.user
  });
});

router.get('/profile', protect, (req, res)=>{
    res.json({
        message: "you are logged in!", 
        user: req.user
    })
})

router.put('/profile', protect, async (req, res) => {
  try {
    const { name, email, className, subjects, specialization } = req.body;
    const user = await require('../models/User').findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (email && email !== user.email) {
      const exists = await require('../models/User').findOne({ email });
      if (exists) return res.status(400).json({ message: 'Email already in use' });
      user.email = email;
    }
    if (name) user.name = name;
    if (user.role === 'student') {
      if (className) user.className = className;
      if (subjects) user.subjects = subjects;
    }
    if (user.role === 'tutor' && specialization !== undefined) {
      user.specialization = specialization;
    }

    await user.save();
    const updated = await require('../models/User').findById(user._id).select('-password');
    res.json({ message: 'Profile updated', user: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/tutors', protect, getAllTutors);

module.exports = router;