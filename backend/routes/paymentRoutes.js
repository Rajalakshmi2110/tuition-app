const express = require('express');
const router = express.Router();
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { protect, adminOnly } = require('../Middleware/authMiddleware');
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

// Configure Cloudinary storage for payment screenshots
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'tuition_app_payments',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Student routes
router.get('/qr-code', protect, getPaymentQR);
router.post('/submit', protect, upload.single('paymentScreenshot'), submitPayment);
router.get('/my-payments', protect, getStudentPayments);
router.delete('/cancel/:paymentId', protect, cancelPayment);
router.patch('/resubmit/:paymentId', protect, upload.single('paymentScreenshot'), resubmitPayment);

// Admin routes
router.get('/pending', protect, adminOnly, getPendingPayments);
router.patch('/verify/:paymentId', protect, adminOnly, verifyPayment);
router.get('/stats', protect, adminOnly, getPaymentStats);
router.post('/send-reminders', protect, adminOnly, sendPaymentReminders);

module.exports = router;