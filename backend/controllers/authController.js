const User = require('../models/User');
const ClassModel = require('../models/Class');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, specialization, className } = req.body;

    // Prevent self-registration of admins
    if (role === 'admin') {
      return res.status(403).json({ message: 'Admin accounts cannot be self-registered' });
    }

    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Handle student class validation
    if (role === 'student') {
      if (!className) {
        return res.status(400).json({ message: 'Class name is required for students' });
      }
      if (!["8", "9", "10", "11", "12"].includes(className)) {
        return res.status(400).json({ message: 'Students can only register for class 8-12' });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      specialization: role === 'tutor' ? specialization : undefined,
      className: role === 'student' ? className : undefined,
      status: role === 'tutor' ? 'pending' : 'approved'
    });

    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      note: role === 'tutor' ? 'Your account is pending admin approval.' : undefined
    });

  } catch (err) {
    console.error('Register User Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// LOGIN
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    if (user.role === 'tutor') {
      if (user.status === 'pending') return res.status(403).json({ message: 'Your account is pending approval.' });
      if (user.status === 'declined') return res.status(403).json({ message: 'Your tutor application was declined.' });
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
    console.error('Login User Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser };
