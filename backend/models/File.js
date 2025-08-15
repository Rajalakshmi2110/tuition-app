const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  className: { type: String, required: true }, // link to class
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, enum: ["tutor", "admin"], required: true },
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  fileType: { type: String },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("File", fileSchema);
