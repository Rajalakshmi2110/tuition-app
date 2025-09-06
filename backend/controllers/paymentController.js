const Payment = require('../models/Payment');
const FeeStructure = require('../models/FeeStructure');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

// Get GPay QR Code (Admin uploads this)
const getPaymentQR = async (req, res) => {
  try {
    // For now, return a static QR code URL - Admin can update this
    const qrCodeUrl = process.env.GPAY_QR_URL || 'https://via.placeholder.com/300x300?text=GPay+QR+Code';
    res.json({ qrCodeUrl, instructions: 'Scan this QR code to pay your fees, then upload payment screenshot' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Submit payment (Student)
const submitPayment = async (req, res) => {
  try {
    const { amount, month, transactionId, notes } = req.body;
    const studentId = req.user._id;

    // Check if payment already exists for this month
    const existingPayment = await Payment.findOne({ studentId, month });
    if (existingPayment) {
      return res.status(400).json({ message: 'Payment already submitted for this month' });
    }

    // Handle screenshot upload
    if (!req.file) {
      return res.status(400).json({ message: 'Payment screenshot is required' });
    }

    // Create payments directory if it doesn't exist
    const paymentsDir = path.join(__dirname, '../uploads/payments');
    if (!fs.existsSync(paymentsDir)) {
      fs.mkdirSync(paymentsDir, { recursive: true });
    }

    // Move file to payments directory
    const fileName = `payment_${Date.now()}_${req.file.originalname}`;
    const filePath = path.join(paymentsDir, fileName);
    fs.renameSync(req.file.path, filePath);
    
    const fileUrl = `/uploads/payments/${fileName}`;

    // Create payment record
    const payment = new Payment({
      studentId,
      amount,
      month,
      paymentScreenshot: fileUrl,
      transactionId,
      notes,
      status: 'pending'
    });

    await payment.save();

    // Send confirmation email to student
    await sendPaymentSubmissionEmail(req.user.email, req.user.name, month, amount);

    res.status(201).json({
      message: 'Payment submitted successfully. Awaiting admin verification.',
      payment: {
        id: payment._id,
        amount: payment.amount,
        month: payment.month,
        status: payment.status,
        submittedAt: payment.submittedAt
      }
    });
  } catch (error) {
    console.error('Submit payment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get student's payment history
const getStudentPayments = async (req, res) => {
  try {
    const studentId = req.user._id;
    const payments = await Payment.find({ studentId })
      .populate('verifiedBy', 'name')
      .sort({ month: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all pending payments (Admin)
const getPendingPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ status: 'pending' })
      .populate('studentId', 'name email className')
      .sort({ submittedAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Verify payment (Admin)
const verifyPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { status, rejectionReason } = req.body;
    const adminId = req.user._id;

    const payment = await Payment.findById(paymentId).populate('studentId', 'name email');
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    payment.status = status;
    payment.verifiedAt = new Date();
    payment.verifiedBy = adminId;
    
    if (status === 'rejected' && rejectionReason) {
      payment.rejectionReason = rejectionReason;
    }

    await payment.save();

    // Send email notification to student
    if (status === 'verified') {
      await sendPaymentVerificationEmail(payment.studentId.email, payment.studentId.name, payment.month, 'approved');
    } else if (status === 'rejected') {
      await sendPaymentVerificationEmail(payment.studentId.email, payment.studentId.name, payment.month, 'rejected', rejectionReason);
    }

    res.json({ message: `Payment ${status} successfully`, payment });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get payment statistics (Admin)
const getPaymentStats = async (req, res) => {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7); // "2024-01"
    
    const stats = await Payment.aggregate([
      {
        $match: { month: currentMonth }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    const totalStudents = await User.countDocuments({ role: 'student' });
    const paidStudents = stats.find(s => s._id === 'verified')?.count || 0;
    const pendingStudents = stats.find(s => s._id === 'pending')?.count || 0;
    const unpaidStudents = totalStudents - paidStudents - pendingStudents;

    res.json({
      currentMonth,
      totalStudents,
      paidStudents,
      pendingStudents,
      unpaidStudents,
      totalRevenue: stats.find(s => s._id === 'verified')?.totalAmount || 0,
      stats
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Send payment reminders (Admin)
const sendPaymentReminders = async (req, res) => {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7);
    
    // Get students who haven't paid for current month
    const paidStudentIds = await Payment.find({ 
      month: currentMonth, 
      status: { $in: ['verified', 'pending'] } 
    }).distinct('studentId');

    const unpaidStudents = await User.find({
      role: 'student',
      _id: { $nin: paidStudentIds }
    });

    let remindersSent = 0;
    for (const student of unpaidStudents) {
      try {
        await sendPaymentReminderEmail(student.email, student.name, currentMonth);
        remindersSent++;
      } catch (emailError) {
        console.error(`Failed to send reminder to ${student.email}:`, emailError);
      }
    }

    res.json({ 
      message: `Payment reminders sent to ${remindersSent} students`,
      totalUnpaid: unpaidStudents.length,
      remindersSent
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Email functions
const sendPaymentSubmissionEmail = async (email, name, month, amount) => {
  if (!process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'your-16-digit-app-password') {
    console.log(`Payment submission email for ${email}: Payment of ₹${amount} for ${month} submitted`);
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Payment Submitted - Tuitix',
    html: `
      <h2>Payment Submitted Successfully</h2>
      <p>Dear ${name},</p>
      <p>Your payment of <strong>₹${amount}</strong> for <strong>${month}</strong> has been submitted successfully.</p>
      <p>Your payment is now under review by our admin team. You will receive a confirmation email once verified.</p>
      <p>Thank you!</p>
    `
  });
};

const sendPaymentVerificationEmail = async (email, name, month, status, reason = '') => {
  if (!process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'your-16-digit-app-password') {
    console.log(`Payment verification email for ${email}: Payment for ${month} ${status}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const subject = status === 'approved' ? 'Payment Verified - Tuitix' : 'Payment Rejected - Tuitix';
  const message = status === 'approved' 
    ? `Your payment for ${month} has been verified and approved.`
    : `Your payment for ${month} has been rejected. Reason: ${reason}. Please resubmit with correct details.`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    html: `
      <h2>Payment ${status === 'approved' ? 'Verified' : 'Rejected'}</h2>
      <p>Dear ${name},</p>
      <p>${message}</p>
      <p>Thank you!</p>
    `
  });
};

const sendPaymentReminderEmail = async (email, name, month) => {
  if (!process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'your-16-digit-app-password') {
    console.log(`Payment reminder email for ${email}: Reminder for ${month} payment`);
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Payment Reminder - Tuitix',
    html: `
      <h2>Payment Reminder</h2>
      <p>Dear ${name},</p>
      <p>This is a friendly reminder that your payment for <strong>${month}</strong> is still pending.</p>
      <p>Please log in to your student portal and complete your payment to avoid any interruption in your classes.</p>
      <p>Thank you!</p>
    `
  });
};

module.exports = {
  getPaymentQR,
  submitPayment,
  getStudentPayments,
  getPendingPayments,
  verifyPayment,
  getPaymentStats,
  sendPaymentReminders
};