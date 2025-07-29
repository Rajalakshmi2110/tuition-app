const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  schedule: {
    type: String,
    required: true
  },
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
//   announcements: [
//   {
//     text: String,
//     postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     postedAt: { type: Date, default: Date.now }
//   }
// ],
// announcements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Announcement' }]

}, { timestamps: true });

module.exports = mongoose.model("Class", classSchema);
