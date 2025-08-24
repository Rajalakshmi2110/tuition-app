const Class = require("../models/Class");

// Get all classes for the logged-in tutor
const getTutorClasses = async (req, res) => {
  try {
    if (!req.user || !req.user.id)
      return res.status(401).json({ message: "Unauthorized" });

    const classes = await Class.find({ tutor: req.user.id });
    res.json({ tutorClasses: classes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getTutorClasses };
