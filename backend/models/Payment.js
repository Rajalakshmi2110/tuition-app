const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  month: {
    type: String,
    required: true // Format: "2024-01" for January 2024
  },
  paymentMethod: {
    type: String,
    default: 'GPay QR Code'
  },
  paymentScreenshot: {
    type: String, // Cloudinary URL
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  verifiedAt: {
    type: Date
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectionReason: {
    type: String
  },
  transactionId: {
    type: String // From payment screenshot
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate payments for same month
paymentSchema.index({ studentId: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Payment', paymentSchema);