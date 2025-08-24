// models/Assignment.js
const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  fileUrl: String, // Tutor uploaded file (PDF, doc, etc.)
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  deadline: Date,
  submissions: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      fileUrl: String,
      submittedAt: { type: Date, default: Date.now },
      grade: { type: String, default: "Not Graded" },
      feedback: String,
    },
  ],
});

module.exports = mongoose.model("Assignment", assignmentSchema);
