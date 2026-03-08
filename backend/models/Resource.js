const mongoose = require('mongoose');

const CATEGORIES = ['Textbook / Study Material', 'Guides', 'Class Notes', 'Question Papers', 'Other'];

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: '' },
  url: { type: String, required: true },
  classLevel: { type: String, required: true },
  subject: { type: String, required: true, trim: true },
  category: { type: String, required: true, enum: CATEGORIES },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

resourceSchema.index({ classLevel: 1, subject: 1 });

module.exports = mongoose.model('Resource', resourceSchema);
module.exports.CATEGORIES = CATEGORIES;
