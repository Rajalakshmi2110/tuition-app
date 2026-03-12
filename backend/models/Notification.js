const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { 
    type: String, 
    required: true,
    enum: [
      'announcement', 'assignment_created', 'assignment_submitted', 'assignment_graded',
      'resource_uploaded', 'fee_reminder', 'payment_submitted', 'payment_verified', 'payment_rejected',
      'session_assigned', 'session_updated', 'account_approved', 'account_declined',
      'student_enrolled', 'student_removed', 'new_registration', 'feedback_submitted',
      'badge_earned', 'performance_added'
    ]
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  link: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
