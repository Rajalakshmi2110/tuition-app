const mongoose = require('mongoose');

const doubtChatSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
}, { timestamps: true });

doubtChatSchema.index({ studentId: 1, createdAt: -1 });

module.exports = mongoose.model('DoubtChat', doubtChatSchema);
