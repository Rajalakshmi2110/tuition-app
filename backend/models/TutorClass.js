const mongoose = require("mongoose");

const tutorClassSchema = new mongoose.Schema({
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("TutorClass", tutorClassSchema);
