const User = require("../models/User");

const getUsersByRole = async (req, res, role) => {
  try {
    const users = await User.find({ role }).select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

module.exports = { getUsersByRole };
