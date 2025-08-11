const User = require('../models/User');
const ClassModel = require('../models/Class'); // Make sure path matches your project
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  console.log("Received data:", req.body);
  const { name, email, password, role, specialization, classId } = req.body;

  try {
    // 🚫 Block public admin signup
    if (role === 'admin') {
      return res.status(403).json({ message: 'Admin accounts cannot be self-registered' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // 📚 Validate class for students
    if (role === 'student') {
      if (!classId) {
        return res.status(400).json({ message: 'Class ID is required for students' });
      }
      const classExists = await ClassModel.findById(classId);
      if (!classExists) {
        return res.status(400).json({ message: 'Invalid Class ID' });
      }
    }

    // 🔑 Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 🆕 Create new user with status rules
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      specialization: role === 'tutor' ? specialization : undefined,
      enrolledClasses: role === 'student' ? [classId] : [],
      status: role === 'tutor' ? 'pending' : 'approved'
    });

    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      note: role === 'tutor'
        ? 'Your account is pending admin approval.'
        : undefined
    });
  } catch (err) {
    console.error('Register User Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    // Check tutor status
    if (user.role === 'tutor') {
      if (user.status === 'pending') {
        return res.status(403).json({ message: 'Your account is pending approval.' });
      }
      if (user.status === 'declined') {
        return res.status(403).json({ message: 'Your tutor application was declined.' });
      }
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'mysecretkey',
      { expiresIn: '1h' }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (err) {
    console.log('login error', err);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { registerUser, loginUser };
