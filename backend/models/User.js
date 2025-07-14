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
  enrolledClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }]
}, { timestamps: true });


const User = mongoose.model('User', userSchema);

module.exports = User;