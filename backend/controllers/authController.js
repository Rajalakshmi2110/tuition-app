const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { sendStudentPendingEmail, sendTutorPendingEmail, sendAdminNewRegistrationEmail } = require('../services/emailService');
const { createNotification, notifyByRole } = require('../services/notificationService');
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
      await sendAdminNewRegistrationEmail(user.name, role, user.email);
    } catch (emailError) {
    }

    // Notify admins about new registration
    try {
      await notifyByRole('admin', 'new_registration', 'New Registration', `${name} registered as ${role}. Pending approval.`, '/admin');
    } catch (e) {}

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
        const { sendEmail } = require('../services/emailService');
        const emailWrapper = (content) => `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, #064e3b 0%, #0f172a 100%); padding: 2rem; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 1.5rem; font-weight: 700;"><span style="color: #10b981;">Kalvi</span><span style="color: #fbbf24;">yagam</span></h1>
            </div>
            <div style="padding: 2rem;">${content}</div>
            <div style="background: #f8fafc; padding: 1.5rem; text-align: center; border-top: 1px solid #e2e8f0;"><p style="margin: 0; color: #94a3b8; font-size: 0.8rem;">© ${new Date().getFullYear()} Kalviyagam</p></div>
          </div>`;

        const html = emailWrapper(`
          <h2 style="color: #0f172a; margin-top: 0;">Password Reset Request 🔐</h2>
          <p>Dear <strong>${user.name}</strong>,</p>
          <p>You requested a password reset. Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 1.5rem 0;">
            <a href="${resetUrl}" style="display: inline-block; background: #10b981; color: white; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">Reset Password →</a>
          </div>
          <p style="color: #ef4444; font-size: 0.9rem;">⏰ This link expires in 10 minutes.</p>
          <p style="color: #64748b; font-size: 0.85rem;">If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br><strong>Kalviyagam Team</strong></p>
        `);

        await sendEmail(user.email, 'Password Reset - Kalviyagam', html);
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
      await sendAdminNewRegistrationEmail(user.name, role, user.email);
    } catch (emailError) {
    }

    // Notify admins about Google OAuth registration
    try {
      await notifyByRole('admin', 'new_registration', 'New Registration', `${name} registered as ${role} via Google. Pending approval.`, '/admin');
    } catch (e) {}

    res.status(201).json({
      message: 'Registration completed successfully',
      note: 'Your account is pending admin approval. You will be notified once verified.'
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser, forgotPassword, resetPassword, googleAuthSuccess, completeGoogleRegistration };
