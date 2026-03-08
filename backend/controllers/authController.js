const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { sendStudentPendingEmail, sendTutorPendingEmail } = require('../services/emailService');
const passport = require('passport');

// REGISTER
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, specialization, className, subjects } = req.body;

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
      if (!["6", "7", "8", "9", "10", "11", "12"].includes(className)) {
        return res.status(400).json({ message: 'Students can only register for class 6-12' });
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
      subjects: role === 'student' && subjects ? subjects : undefined,
      status: 'pending'
    });

    await user.save();

    // Send email notifications (don't let email failures break registration)
    try {
      if (role === 'tutor') {
        await sendTutorPendingEmail(user.email, user.name);
      } else if (role === 'student') {
        await sendStudentPendingEmail(user.email, user.name);
      }
    } catch (emailError) {
    }

    res.status(201).json({
      message: 'User registered successfully',
      note: 'Your account is pending admin approval.'
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// LOGIN
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    // Google OAuth users must use Google login, not password
    if (!user.password) {
      return res.status(400).json({ message: 'This account uses Google login. Please sign in with Google.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    if (user.status === 'pending') {
      return res.status(403).json({ message: 'Your account is pending admin approval. You will be notified once verified.' });
    }
    if (user.status === 'declined') {
      return res.status(403).json({ message: 'Your account application was declined. Please contact support for more details.' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, className: user.className },
      process.env.JWT_SECRET,
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
    res.status(500).json({ message: 'Server error' });
  }
};

// FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    
    await user.save();

    // Create reset URL pointing to frontend
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Try to send email, fallback to console if credentials invalid
    if (process.env.EMAIL_PASS && process.env.EMAIL_PASS !== 'your-16-digit-app-password') {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: 'Password Reset - Tuitix',
          html: `
            <h2>Password Reset Request</h2>
            <p>You requested a password reset. Click the link below to reset your password:</p>
            <a href="${resetUrl}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p>This link expires in 10 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
          `
        };

        await transporter.sendMail(mailOptions);
      } catch (emailError) {
      }
    }
    
    res.status(200).json({ 
      message: 'Password reset email sent if account exists.'
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();
    
    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GOOGLE OAUTH SUCCESS
const googleAuthSuccess = async (req, res) => {
  try {
    // Check if user needs role selection
    if (req.user.needsRoleSelection) {
      const userData = encodeURIComponent(JSON.stringify({
        googleId: req.user.googleId,
        name: req.user.name,
        email: req.user.email
      }));
      return res.redirect(`${process.env.FRONTEND_URL}/google-role-selection?userData=${userData}`);
    }

    // Block pending/declined users
    if (req.user.status === 'pending') {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=pending_approval`);
    }
    if (req.user.status === 'declined') {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=account_declined`);
    }

    const googleToken = jwt.sign(
      { id: req.user._id, role: req.user.role, className: req.user.className },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${googleToken}&role=${req.user.role}`);
  } catch (err) {
    res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
  }
};

// COMPLETE GOOGLE OAUTH REGISTRATION
const completeGoogleRegistration = async (req, res) => {
  try {
    const { googleId, name, email, role, specialization, className, subjects } = req.body;

    // Prevent admin registration via Google OAuth
    if (role === 'admin') {
      return res.status(403).json({ message: 'Admin accounts cannot be registered via Google OAuth' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Validate student class
    if (role === 'student') {
      if (!className || !["6", "7", "8", "9", "10", "11", "12"].includes(className)) {
        return res.status(400).json({ message: 'Valid class (6-12) is required for students' });
      }
    }

    // Create user
    const user = new User({
      googleId,
      name,
      email,
      role,
      specialization: role === 'tutor' ? specialization : undefined,
      className: role === 'student' ? className : undefined,
      subjects: role === 'student' && subjects ? subjects : undefined,
      status: 'pending'
    });

    await user.save();

    // Send email notifications
    try {
      if (role === 'tutor') {
        await sendTutorPendingEmail(user.email, user.name);
      } else if (role === 'student') {
        await sendStudentPendingEmail(user.email, user.name);
      }
    } catch (emailError) {
    }

    res.status(201).json({
      message: 'Registration completed successfully',
      note: 'Your account is pending admin approval. You will be notified once verified.'
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser, forgotPassword, resetPassword, googleAuthSuccess, completeGoogleRegistration };
