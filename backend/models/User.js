const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ['student', 'tutor', 'admin'],
    default: 'student',
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'declined'],
    default: function () {
      return this.role === 'tutor' ? 'pending' : 'approved';
    }
  },
  specialization: {
    type: String,
    default: function () {
      return this.role === 'tutor' ? '' : null;
    }
  },
  className: {
    type: String,
    required: function () {
      return this.role === 'student';
    }
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
