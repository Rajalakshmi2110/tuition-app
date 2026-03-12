const nodemailer = require('nodemailer');
const User = require('../models/User');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const isEmailConfigured = () => {
  return process.env.EMAIL_USER && 
    process.env.EMAIL_PASS && 
    process.env.EMAIL_PASS !== 'your-16-char-app-password' &&
    process.env.EMAIL_PASS !== 'your-16-digit-app-password';
};

const sendEmail = async (to, subject, html) => {
  try {
    if (!isEmailConfigured()) {
      console.warn('Email not configured - skipping send to:', to);
      return;
    }
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Kalviyagam" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log(`Email sent to ${to}: ${subject}`);
  } catch (error) {
    console.error('Email sending failed to', to, ':', error.message);
  }
};

const emailWrapper = (content) => `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #064e3b 0%, #0f172a 100%); padding: 2rem; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 1.5rem; font-weight: 700;">
        <span style="color: #10b981;">Kalvi</span><span style="color: #fbbf24;">yagam</span>
      </h1>
      <p style="color: #94a3b8; margin: 0.5rem 0 0; font-size: 0.85rem;">Tuition Management Platform</p>
    </div>
    <div style="padding: 2rem;">
      ${content}
    </div>
    <div style="background: #f8fafc; padding: 1.5rem; text-align: center; border-top: 1px solid #e2e8f0;">
      <p style="margin: 0; color: #94a3b8; font-size: 0.8rem;">© ${new Date().getFullYear()} Kalviyagam. All rights reserved.</p>
    </div>
  </div>
`;

const btnStyle = (color = '#10b981') => `display: inline-block; background: ${color}; color: white; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 0.95rem; margin: 0.5rem 0.25rem;`;

// ===== STUDENT EMAILS =====

const sendStudentPendingEmail = async (studentEmail, studentName) => {
  const html = emailWrapper(`
    <h2 style="color: #0f172a; margin-top: 0;">Registration Received! 🎉</h2>
    <p>Dear <strong>${studentName}</strong>,</p>
    <p>Thank you for registering at Kalviyagam! Your account is currently under review by our admin team.</p>
    <p>You will receive an email notification once your account is approved. This usually takes 1-2 business days.</p>
    <p style="color: #64748b; font-size: 0.9rem;">Thank you for your patience!</p>
    <p>Best regards,<br><strong>Kalviyagam Team</strong></p>
  `);
  await sendEmail(studentEmail, 'Registration Received - Kalviyagam', html);
};

const sendStudentApprovalEmail = async (studentEmail, studentName) => {
  const loginUrl = process.env.FRONTEND_URL + '/login';
  const html = emailWrapper(`
    <h2 style="color: #0f172a; margin-top: 0;">Account Approved! ✅</h2>
    <p>Dear <strong>${studentName}</strong>,</p>
    <p>We're happy to inform you that your student account has been <span style="color: #10b981; font-weight: 700;">approved</span>!</p>
    <p>You can now log in and start your learning journey.</p>
    <div style="text-align: center; margin: 1.5rem 0;">
      <a href="${loginUrl}" style="${btnStyle()}">Login to Dashboard →</a>
    </div>
    <p>Welcome to the Kalviyagam family!</p>
    <p>Best regards,<br><strong>Kalviyagam Team</strong></p>
  `);
  await sendEmail(studentEmail, 'Account Approved - Kalviyagam', html);
};

const sendStudentDeclineEmail = async (studentEmail, studentName) => {
  const html = emailWrapper(`
    <h2 style="color: #0f172a; margin-top: 0;">Registration Update</h2>
    <p>Dear <strong>${studentName}</strong>,</p>
    <p>Thank you for your interest in joining Kalviyagam.</p>
    <p>After review, we are unable to approve your registration at this time.</p>
    <p>Please contact support if you have any questions.</p>
    <p>Best regards,<br><strong>Kalviyagam Team</strong></p>
  `);
  await sendEmail(studentEmail, 'Registration Update - Kalviyagam', html);
};

const sendStudentRegistrationEmail = async (studentEmail, studentName) => {
  const loginUrl = process.env.FRONTEND_URL + '/login';
  const html = emailWrapper(`
    <h2 style="color: #0f172a; margin-top: 0;">Welcome to Kalviyagam! 🎓</h2>
    <p>Dear <strong>${studentName}</strong>,</p>
    <p>Your registration has been completed successfully!</p>
    <p>You can now access your student dashboard and enroll in classes.</p>
    <div style="text-align: center; margin: 1.5rem 0;">
      <a href="${loginUrl}" style="${btnStyle()}">Login to Dashboard →</a>
    </div>
    <p>Start your learning journey with us!</p>
    <p>Best regards,<br><strong>Kalviyagam Team</strong></p>
  `);
  await sendEmail(studentEmail, 'Welcome to Kalviyagam', html);
};

// ===== TUTOR EMAILS =====

const sendTutorPendingEmail = async (tutorEmail, tutorName) => {
  const html = emailWrapper(`
    <h2 style="color: #0f172a; margin-top: 0;">Application Received! 🎉</h2>
    <p>Dear <strong>${tutorName}</strong>,</p>
    <p>Thank you for applying to become a tutor at Kalviyagam!</p>
    <p>Your application is currently under review by our admin team. You will receive an email notification once your application is processed.</p>
    <p>This usually takes 1-2 business days.</p>
    <p>Best regards,<br><strong>Kalviyagam Team</strong></p>
  `);
  await sendEmail(tutorEmail, 'Tutor Application Received - Kalviyagam', html);
};

const sendTutorApprovalEmail = async (tutorEmail, tutorName) => {
  const loginUrl = process.env.FRONTEND_URL + '/login';
  const html = emailWrapper(`
    <h2 style="color: #0f172a; margin-top: 0;">Application Approved! ✅</h2>
    <p>Dear <strong>${tutorName}</strong>,</p>
    <p>We're excited to inform you that your tutor application has been <span style="color: #10b981; font-weight: 700;">approved</span>!</p>
    <p>You can now log in to your account and start managing classes.</p>
    <div style="text-align: center; margin: 1.5rem 0;">
      <a href="${loginUrl}" style="${btnStyle()}">Login to Dashboard →</a>
    </div>
    <p>Welcome to the Kalviyagam family!</p>
    <p>Best regards,<br><strong>Kalviyagam Team</strong></p>
  `);
  await sendEmail(tutorEmail, 'Tutor Application Approved - Kalviyagam', html);
};

const sendTutorDeclineEmail = async (tutorEmail, tutorName) => {
  const html = emailWrapper(`
    <h2 style="color: #0f172a; margin-top: 0;">Application Update</h2>
    <p>Dear <strong>${tutorName}</strong>,</p>
    <p>Thank you for your interest in joining Kalviyagam as a tutor.</p>
    <p>After careful review, we are unable to approve your application at this time.</p>
    <p>You may reapply in the future if you meet our updated requirements.</p>
    <p>Best regards,<br><strong>Kalviyagam Team</strong></p>
  `);
  await sendEmail(tutorEmail, 'Tutor Application Update - Kalviyagam', html);
};

// ===== ADMIN NOTIFICATION EMAIL =====

const sendAdminNewRegistrationEmail = async (userName, userRole, userEmail) => {
  try {
    const admins = await User.find({ role: 'admin', status: 'approved' }).select('email');
    if (!admins.length) return;

    const adminUrl = process.env.FRONTEND_URL + '/login';
    const html = emailWrapper(`
      <h2 style="color: #0f172a; margin-top: 0;">New ${userRole === 'tutor' ? 'Tutor' : 'Student'} Registration 🆕</h2>
      <p>A new user has registered and is waiting for your approval:</p>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.25rem; margin: 1rem 0;">
        <p style="margin: 0.25rem 0;"><strong>Name:</strong> ${userName}</p>
        <p style="margin: 0.25rem 0;"><strong>Email:</strong> ${userEmail}</p>
        <p style="margin: 0.25rem 0;"><strong>Role:</strong> ${userRole.charAt(0).toUpperCase() + userRole.slice(1)}</p>
      </div>
      <p>Please log in to the admin dashboard to approve or decline this registration.</p>
      <div style="text-align: center; margin: 1.5rem 0;">
        <a href="${adminUrl}" style="${btnStyle('#10b981')}">Approve / Decline →</a>
      </div>
      <p style="color: #64748b; font-size: 0.85rem;">You're receiving this because you're an admin at Kalviyagam.</p>
    `);

    for (const admin of admins) {
      await sendEmail(admin.email, `New ${userRole} registration: ${userName} - Kalviyagam`, html);
    }
  } catch (error) {
    console.error('Admin notification email failed:', error.message);
  }
};

module.exports = {
  sendEmail,
  sendTutorApprovalEmail,
  sendTutorDeclineEmail,
  sendStudentRegistrationEmail,
  sendStudentPendingEmail,
  sendStudentApprovalEmail,
  sendStudentDeclineEmail,
  sendTutorPendingEmail,
  sendAdminNewRegistrationEmail
};
