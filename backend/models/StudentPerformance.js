const mongoose = require('mongoose');

const studentPerformanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true,
    enum: ['Mathematics', 'Science', 'English', 'Social Studies', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Tamil', 'Hindi', 'Sanskrit', 'French', 'German']
  },
  examType: {
    type: String,
    required: true,
    enum: ['Unit Test', 'Mid Term', 'Final Exam', 'Monthly Test', 'Quarterly', 'Half Yearly']
  },
  totalMarks: {
    type: Number,
    required: true
  },
  obtainedMarks: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    default: function() {
      return (this.obtainedMarks / this.totalMarks) * 100;
    }
  },
  grade: {
    type: String,
    default: function() {
      const percentage = (this.obtainedMarks / this.totalMarks) * 100;
      if (percentage >= 90) return 'A+';
      if (percentage >= 80) return 'A';
      if (percentage >= 70) return 'B+';
      if (percentage >= 60) return 'B';
      if (percentage >= 50) return 'C';
      return 'F';
    }
  },
  examDate: {
    type: Date,
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  term: {
    type: String,
    required: true,
    enum: ['Term 1', 'Term 2', 'Term 3']
  }
}, { timestamps: true });

module.exports = mongoose.model('StudentPerformance', studentPerformanceSchema);