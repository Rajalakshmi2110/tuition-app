const mongoose = require("mongoose");

const studentClassSchema = new mongoose.Schema({
  studentId: {
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

module.exports = mongoose.model("StudentClass", studentClassSchema);
