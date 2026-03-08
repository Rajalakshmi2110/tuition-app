const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const sendEmail = async (to, subject, html) => {
  try {
    if (!process.env.EMAIL_USER || process.env.EMAIL_PASS === 'your-16-digit-app-password') {
      console.warn('Email not configured - skipping send to:', to);
      return;
    }

    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    });
  } catch (error) {
    console.error('Email sending failed:', error.message);
  }
};

const sendTutorApprovalEmail = async (tutorEmail, tutorName) => {
  const subject = 'Tutor Application Approved - Kalviyagam';
  const html = `
    <h2>Congratulations! Your Tutor Application is Approved</h2>
    <p>Dear ${tutorName},</p>
    <p>We're excited to inform you that your tutor application has been approved!</p>
    <p>You can now log in to your account and start managing classes.</p>
    <p><a href="${process.env.FRONTEND_URL}/login" style="background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login Now</a></p>
    <p>Welcome to the Kalviyagam family!</p>
    <p>Best regards,<br>Kalviyagam Team</p>
  `;
  await sendEmail(tutorEmail, subject, html);
};

const sendTutorDeclineEmail = async (tutorEmail, tutorName) => {
  const subject = 'Tutor Application Update - Kalviyagam';
  const html = `
    <h2>Tutor Application Status Update</h2>
    <p>Dear ${tutorName},</p>
    <p>Thank you for your interest in joining Kalviyagam as a tutor.</p>
    <p>After careful review, we are unable to approve your application at this time.</p>
    <p>You may reapply in the future if you meet our updated requirements.</p>
    <p>Thank you for your understanding.</p>
    <p>Best regards,<br>Kalviyagam Team</p>
  `;
  await sendEmail(tutorEmail, subject, html);
};

const sendStudentRegistrationEmail = async (studentEmail, studentName) => {
  const subject = 'Welcome to Kalviyagam - Registration Successful';
  const html = `
    <h2>Welcome to Kalviyagam!</h2>
    <p>Dear ${studentName},</p>
    <p>Your registration has been completed successfully!</p>
    <p>You can now access your student dashboard and enroll in classes.</p>
    <p><a href="${process.env.FRONTEND_URL}/login" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login to Dashboard</a></p>
    <p>Start your learning journey with us!</p>
    <p>Best regards,<br>Kalviyagam Team</p>
  `;
  await sendEmail(studentEmail, subject, html);
};

const sendStudentPendingEmail = async (studentEmail, studentName) => {
  const subject = 'Registration Received - Kalviyagam';
  const html = `
    <h2>Registration Received Successfully</h2>
    <p>Dear ${studentName},</p>
    <p>Thank you for registering at Kalviyagam!</p>
    <p>Your account is currently under review by our admin team.</p>
    <p>You will receive an email notification once your account is approved.</p>
    <p>This usually takes 1-2 business days.</p>
    <p>Thank you for your patience!</p>
    <p>Best regards,<br>Kalviyagam Team</p>
  `;
  await sendEmail(studentEmail, subject, html);
};

const sendStudentApprovalEmail = async (studentEmail, studentName) => {
  const subject = 'Account Approved - Kalviyagam';
  const html = `
    <h2>Your Account is Approved!</h2>
    <p>Dear ${studentName},</p>
    <p>We're happy to inform you that your student account has been approved!</p>
    <p>You can now log in and start your learning journey.</p>
    <p><a href="${process.env.FRONTEND_URL}/login" style="background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login Now</a></p>
    <p>Welcome to the Kalviyagam family!</p>
    <p>Best regards,<br>Kalviyagam Team</p>
  `;
  await sendEmail(studentEmail, subject, html);
};

const sendStudentDeclineEmail = async (studentEmail, studentName) => {
  const subject = 'Registration Update - Kalviyagam';
  const html = `
    <h2>Registration Status Update</h2>
    <p>Dear ${studentName},</p>
    <p>Thank you for your interest in joining Kalviyagam.</p>
    <p>After review, we are unable to approve your registration at this time.</p>
    <p>Please contact support if you have any questions.</p>
    <p>Best regards,<br>Kalviyagam Team</p>
  `;
  await sendEmail(studentEmail, subject, html);
};

const sendTutorPendingEmail = async (tutorEmail, tutorName) => {
  const subject = 'Tutor Application Received - Kalviyagam';
  const html = `
    <h2>Application Received Successfully</h2>
    <p>Dear ${tutorName},</p>
    <p>Thank you for applying to become a tutor at Kalviyagam!</p>
    <p>Your application is currently under review by our admin team.</p>
    <p>You will receive an email notification once your application is processed.</p>
    <p>This usually takes 1-2 business days.</p>
    <p>Thank you for your patience!</p>
    <p>Best regards,<br>Kalviyagam Team</p>
  `;
  await sendEmail(tutorEmail, subject, html);
};

module.exports = {
  sendEmail,
  sendTutorApprovalEmail,
  sendTutorDeclineEmail,
  sendStudentRegistrationEmail,
  sendStudentPendingEmail,
  sendStudentApprovalEmail,
  sendStudentDeclineEmail,
  sendTutorPendingEmail
};