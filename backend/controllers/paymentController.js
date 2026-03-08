const Payment = require('../models/Payment');
const FeeStructure = require('../models/FeeStructure');
const User = require('../models/User');
const { sendEmail } = require('../services/emailService');
const path = require('path');
const fs = require('fs');

// Get GPay QR Code (Admin uploads this)
const getPaymentQR = async (req, res) => {
  try {
    // For now, return a static QR code URL - Admin can update this
    const qrCodeUrl = process.env.GPAY_QR_URL || 'https://via.placeholder.com/300x300?text=GPay+QR+Code';
    res.json({ qrCodeUrl, instructions: 'Scan this QR code to pay your fees, then upload payment screenshot' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
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
    res.status(500).json({ message: 'Server error' });
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
    res.status(500).json({ message: 'Server error' });
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
    res.status(500).json({ message: 'Server error' });
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
    res.status(500).json({ message: 'Server error' });
  }
};

// Cancel payment (Student)
const cancelPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const studentId = req.user._id;

    const payment = await Payment.findOne({ _id: paymentId, studentId, status: 'pending' });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found or cannot be cancelled' });
    }

    await Payment.findByIdAndDelete(paymentId);
    res.json({ message: 'Payment cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Resubmit payment (Student)
const resubmitPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { transactionId, notes } = req.body;
    const studentId = req.user._id;

    const payment = await Payment.findOne({ _id: paymentId, studentId, status: 'rejected' });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found or cannot be resubmitted' });
    }

    // Handle new screenshot if provided
    let paymentScreenshot = payment.paymentScreenshot;
    if (req.file) {
      const paymentsDir = path.join(__dirname, '../uploads/payments');
      const fileName = `payment_${Date.now()}_${req.file.originalname}`;
      const filePath = path.join(paymentsDir, fileName);
      fs.renameSync(req.file.path, filePath);
      paymentScreenshot = `/uploads/payments/${fileName}`;
    }

    payment.status = 'pending';
    payment.transactionId = transactionId || payment.transactionId;
    payment.notes = notes || payment.notes;
    payment.paymentScreenshot = paymentScreenshot;
    payment.submittedAt = new Date();
    payment.rejectionReason = undefined;
    payment.verifiedAt = undefined;
    payment.verifiedBy = undefined;

    await payment.save();
    res.json({ message: 'Payment resubmitted successfully', payment });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
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
    res.status(500).json({ message: 'Server error' });
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
      }
    }

    res.json({ 
      message: `Payment reminders sent to ${remindersSent} students`,
      totalUnpaid: unpaidStudents.length,
      remindersSent
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Email helper functions
const sendPaymentSubmissionEmail = async (email, name, month, amount) => {
  await sendEmail(email, 'Payment Submitted - Tuitix', `
    <h2>Payment Submitted Successfully</h2>
    <p>Dear ${name},</p>
    <p>Your payment of <strong>₹${amount}</strong> for <strong>${month}</strong> has been submitted successfully.</p>
    <p>Your payment is now under review by our admin team. You will receive a confirmation email once verified.</p>
    <p>Thank you!</p>
  `);
};

const sendPaymentVerificationEmail = async (email, name, month, status, reason = '') => {
  const subject = status === 'approved' ? 'Payment Verified - Tuitix' : 'Payment Rejected - Tuitix';
  const message = status === 'approved'
    ? `Your payment for ${month} has been verified and approved.`
    : `Your payment for ${month} has been rejected. Reason: ${reason}. Please resubmit with correct details.`;

  await sendEmail(email, subject, `
    <h2>Payment ${status === 'approved' ? 'Verified' : 'Rejected'}</h2>
    <p>Dear ${name},</p>
    <p>${message}</p>
    <p>Thank you!</p>
  `);
};

const sendPaymentReminderEmail = async (email, name, month) => {
  await sendEmail(email, 'Payment Reminder - Tuitix', `
    <h2>Payment Reminder</h2>
    <p>Dear ${name},</p>
    <p>This is a friendly reminder that your payment for <strong>${month}</strong> is still pending.</p>
    <p>Please log in to your student portal and complete your payment to avoid any interruption in your classes.</p>
    <p>Thank you!</p>
  `);
};

module.exports = {
  getPaymentQR,
  submitPayment,
  getStudentPayments,
  getPendingPayments,
  verifyPayment,
  getPaymentStats,
  sendPaymentReminders,
  cancelPayment,
  resubmitPayment
};