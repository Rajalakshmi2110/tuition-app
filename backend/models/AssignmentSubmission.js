const mongoose = require('mongoose');

const assignmentSubmissionSchema = new mongoose.Schema({
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  attachments: [{
    filename: String,
    url: String,
    uploadDate: { type: Date, default: Date.now }
  }],
  submittedAt: {
    type: Date,
    default: Date.now
  },
  isLate: {
    type: Boolean,
    default: false
  },
  // Grading fields
  pointsEarned: {
    type: Number,
    default: null
  },
  feedback: {
    type: String,
    default: ''
  },
  gradedAt: {
    type: Date,
    default: null
  },
  gradedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  status: {
    type: String,
    enum: ['Submitted', 'Graded', 'Returned'],
    default: 'Submitted'
  }
}, { timestamps: true });

// Calculate if submission is late
assignmentSubmissionSchema.pre('save', async function(next) {
  if (this.isNew) {
    const assignment = await mongoose.model('Assignment').findById(this.assignmentId);
    if (assignment && this.submittedAt > assignment.dueDate) {
      this.isLate = true;
    }
  }
  next();
});

module.exports = mongoose.model('AssignmentSubmission', assignmentSubmissionSchema);