const mongoose = require('mongoose');

const examScheduleSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  examDate: { type: Date, required: true },
  examTime: { type: String, required: true },
  examType: { type: String, enum: ['Unit Test', 'Mid Term', 'Quarterly', 'Half Yearly', 'Annual', 'Other'], required: true },
  notes: { type: String, default: '' },
  reminded: { type: Boolean, default: false }
}, { timestamps: true });

examScheduleSchema.index({ studentId: 1, examDate: 1 });

module.exports = mongoose.model('ExamSchedule', examScheduleSchema);
