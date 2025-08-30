const User = require('../models/User');
const ClassModel = require('../models/Class');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { sendStudentRegistrationEmail, sendTutorPendingEmail } = require('../services/emailService');
const passport = require('passport');

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

    // Send email notifications
    if (role === 'student') {
      await sendStudentRegistrationEmail(user.email, user.name);
    } else if (role === 'tutor') {
      await sendTutorPendingEmail(user.email, user.name);
    }

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
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    if (!user.password) {
      return res.status(400).json({ message: 'Account created via Google OAuth. Please use Google Sign-In.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    if (user.role === 'tutor') {
      if (user.status === 'pending') return res.status(403).json({ message: 'Your account is pending approval.' });
      if (user.status === 'declined') return res.status(403).json({ message: 'Your tutor application was declined.' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, className: user.className },
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
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

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
        console.log('Email failed, using development mode');
        console.log('Password Reset URL:', resetUrl);
      }
    } else {
      console.log('Development mode - Password Reset URL:', resetUrl);
    }
    
    res.status(200).json({ 
      message: process.env.EMAIL_PASS && process.env.EMAIL_PASS !== 'your-16-digit-app-password' 
        ? 'Password reset email sent. Check your inbox.' 
        : 'Password reset link generated. Check server console for URL.',
      resetUrl: process.env.EMAIL_PASS === 'your-16-digit-app-password' ? resetUrl : undefined
    });
  } catch (err) {
    console.error('Forgot Password Error:', err.message);
    console.error('Full Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    console.log('Reset token received:', token);
    console.log('Password provided:', password ? 'Yes' : 'No');

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      console.log('No user found with token:', token);
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    
    console.log('User found for reset:', user.email);

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();
    
    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset Password Error:', err.message);
    console.error('Full Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GOOGLE OAUTH SUCCESS
const googleAuthSuccess = async (req, res) => {
  try {
    // Check if user needs role selection
    if (req.user.needsRoleSelection) {
      // Store user data in session and redirect to role selection
      const userData = encodeURIComponent(JSON.stringify({
        googleId: req.user.googleId,
        name: req.user.name,
        email: req.user.email
      }));
      return res.redirect(`http://localhost:3000/google-role-selection?userData=${userData}`);
    }

    const token = jwt.sign(
      { id: req.user._id, role: req.user.role, className: req.user.className },
      process.env.JWT_SECRET || 'mysecretkey',
      { expiresIn: '1h' }
    );

    // Redirect to frontend with token
    res.redirect(`http://localhost:3000/auth/success?token=${token}&role=${req.user.role}`);
  } catch (err) {
    console.error('Google Auth Success Error:', err);
    res.redirect('http://localhost:3000/login?error=auth_failed');
  }
};

// COMPLETE GOOGLE OAUTH REGISTRATION
const completeGoogleRegistration = async (req, res) => {
  try {
    const { googleId, name, email, role, specialization, className } = req.body;

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
      if (!className || !["8", "9", "10", "11", "12"].includes(className)) {
        return res.status(400).json({ message: 'Valid class (8-12) is required for students' });
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
      status: role === 'tutor' ? 'pending' : 'approved'
    });

    await user.save();

    // Send email notifications
    if (role === 'student') {
      await sendStudentRegistrationEmail(user.email, user.name);
    } else if (role === 'tutor') {
      await sendTutorPendingEmail(user.email, user.name);
    }

    // Generate token for immediate login (except pending tutors)
    if (role === 'student' || (role === 'tutor' && user.status === 'approved')) {
      const token = jwt.sign(
        { id: user._id, role: user.role, className: user.className },
        process.env.JWT_SECRET || 'mysecretkey',
        { expiresIn: '1h' }
      );

      return res.status(201).json({
        message: 'Registration completed successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status
        }
      });
    }

    res.status(201).json({
      message: 'Registration completed successfully',
      note: 'Your tutor account is pending admin approval.'
    });

  } catch (err) {
    console.error('Complete Google Registration Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { registerUser, loginUser, forgotPassword, resetPassword, googleAuthSuccess, completeGoogleRegistration };
