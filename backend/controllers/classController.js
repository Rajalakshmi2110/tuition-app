const Class = require("../models/Class");

const createClass = async (req, res) => {
  const { name, subject, schedule, tutorId } = req.body;

  try {
    const newClass = new Class({
      name,
      subject,
      schedule,
      tutor: tutorId
    });

    await newClass.save();
    res.status(201).json({ message: "Class created", class: newClass });

  } catch (err) {
    console.error("Class create error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate('tutor', 'name email role');
    res.status(200).json(classes);
  } catch (err) {
    console.error("Get all classes error:", err);
    res.status(500).json({ message: "Error fetching classes" });
  }
};

const getClassById = async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id).populate("tutor", "name email");
    if (!classItem) return res.status(404).json({ message: "Class not found" });
    res.status(200).json(classItem);
  } catch (err) {
    console.error("Get class by ID error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { createClass, getAllClasses, getClassById };
