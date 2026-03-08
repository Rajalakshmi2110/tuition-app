const mongoose = require('mongoose');

// Middleware to validate MongoDB ObjectId route params
// Checks any param ending in 'Id' or named 'id'
const validateObjectIds = (req, res, next) => {
  for (const [key, value] of Object.entries(req.params)) {
    if ((key === 'id' || key.endsWith('Id')) && !mongoose.Types.ObjectId.isValid(value)) {
      return res.status(400).json({ message: `Invalid ${key}` });
    }
  }
  next();
};

module.exports = { validateObjectIds };
