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
  enrolledClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
