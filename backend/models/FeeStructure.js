const mongoose = require('mongoose');

const feeStructureSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
    enum: ['8', '9', '10', '11', '12']
  },
  monthlyFee: {
    type: Number,
    required: true
  },
  subjects: [{
    name: String,
    fee: Number
  }],
  dueDate: {
    type: Number, // Day of month (e.g., 5 for 5th of every month)
    default: 5
  },
  lateFee: {
    type: Number,
    default: 50
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('FeeStructure', feeStructureSchema);