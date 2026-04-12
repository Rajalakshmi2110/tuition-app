const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../Middleware/authMiddleware');
const { uploadPayment } = require('../config/cloudinary');
const {
  getPaymentQR,
  submitPayment,
  getStudentPayments,
  getPendingPayments,
  verifyPayment,
  getPaymentStats,
  sendPaymentReminders,
  cancelPayment,
  resubmitPayment
} = require('../controllers/paymentController');

// Student routes
router.get('/qr-code', protect, getPaymentQR);
router.post('/submit', protect, uploadPayment.single('paymentScreenshot'), submitPayment);
router.get('/my-payments', protect, getStudentPayments);
router.delete('/cancel/:paymentId', protect, cancelPayment);
router.patch('/resubmit/:paymentId', protect, uploadPayment.single('paymentScreenshot'), resubmitPayment);

// Admin routes
router.get('/pending', protect, adminOnly, getPendingPayments);
router.patch('/verify/:paymentId', protect, adminOnly, verifyPayment);
router.get('/stats', protect, adminOnly, getPaymentStats);
router.post('/send-reminders', protect, adminOnly, sendPaymentReminders);

module.exports = router;
