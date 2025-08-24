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
      console.log(`Email would be sent to: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Content: ${html}`);
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
  const subject = 'Tutor Application Approved - Tuitix';
  const html = `
    <h2>Congratulations! Your Tutor Application is Approved</h2>
    <p>Dear ${tutorName},</p>
    <p>We're excited to inform you that your tutor application has been approved!</p>
    <p>You can now log in to your account and start managing classes.</p>
    <p><a href="http://localhost:3000/login" style="background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login Now</a></p>
    <p>Welcome to the Tuitix family!</p>
    <p>Best regards,<br>Tuitix Team</p>
  `;
  await sendEmail(tutorEmail, subject, html);
};

const sendTutorDeclineEmail = async (tutorEmail, tutorName) => {
  const subject = 'Tutor Application Update - Tuitix';
  const html = `
    <h2>Tutor Application Status Update</h2>
    <p>Dear ${tutorName},</p>
    <p>Thank you for your interest in joining Tuitix as a tutor.</p>
    <p>After careful review, we are unable to approve your application at this time.</p>
    <p>You may reapply in the future if you meet our updated requirements.</p>
    <p>Thank you for your understanding.</p>
    <p>Best regards,<br>Tuitix Team</p>
  `;
  await sendEmail(tutorEmail, subject, html);
};

const sendStudentRegistrationEmail = async (studentEmail, studentName) => {
  const subject = 'Welcome to Tuitix - Registration Successful';
  const html = `
    <h2>Welcome to Tuitix!</h2>
    <p>Dear ${studentName},</p>
    <p>Your registration has been completed successfully!</p>
    <p>You can now access your student dashboard and enroll in classes.</p>
    <p><a href="http://localhost:3000/login" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login to Dashboard</a></p>
    <p>Start your learning journey with us!</p>
    <p>Best regards,<br>Tuitix Team</p>
  `;
  await sendEmail(studentEmail, subject, html);
};

const sendTutorPendingEmail = async (tutorEmail, tutorName) => {
  const subject = 'Tutor Application Received - Tuitix';
  const html = `
    <h2>Application Received Successfully</h2>
    <p>Dear ${tutorName},</p>
    <p>Thank you for applying to become a tutor at Tuitix!</p>
    <p>Your application is currently under review by our admin team.</p>
    <p>You will receive an email notification once your application is processed.</p>
    <p>This usually takes 1-2 business days.</p>
    <p>Thank you for your patience!</p>
    <p>Best regards,<br>Tuitix Team</p>
  `;
  await sendEmail(tutorEmail, subject, html);
};

module.exports = {
  sendTutorApprovalEmail,
  sendTutorDeclineEmail,
  sendStudentRegistrationEmail,
  sendTutorPendingEmail
};