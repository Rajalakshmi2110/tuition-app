const Class = require("../models/Class");
const TutorClass = require("../models/TutorClass");
const StudentClass = require("../models/StudentClass");
const User = require("../models/User");
const Class = require("../models/Class");
const TutorClass = require("../models/TutorClass");
const StudentClass = require("../models/StudentClass");

const createClass = async (req, res) => {
  try {
    const { name, subject, description, schedule, tutor, classLevel, students = [] } = req.body;

    if (!name || !subject || !schedule || !tutor || !classLevel) {
      return res.status(400).json({ message: "Name, subject, schedule, tutor, and classLevel are required" });
    }

    const newClass = new Class({ name, subject, description, schedule, tutor, classLevel });
    await newClass.save();

    await TutorClass.create({ tutorId: tutor, classId: newClass._id });

    const autoStudents = await User.find({ role: 'student', className: classLevel });

    const allStudentIds = [
      ...students,
      ...autoStudents.map(s => s._id)
    ];

    const uniqueStudentIds = [...new Set(allStudentIds.map(id => id.toString()))];

    if (uniqueStudentIds.length > 0) {
      const studentLinks = uniqueStudentIds.map(sId => ({ studentId: sId, classId: newClass._id }));
      await StudentClass.insertMany(studentLinks);
    }

    res.status(201).json({ message: "Class created and linked successfully", class: newClass });

  } catch (err) {
    console.error("Error creating class:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate("tutor", "name email");
    res.json(classes);
  } catch (err) {
    console.error("Get all classes error:", err);
    res.status(500).json({ message: "Server error" });
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

const updateClass = async (req, res) => {
  const { id } = req.params;
  const { tutorId } = req.body;

  try {
    const updated = await Class.findByIdAndUpdate(id, { tutor: tutorId }, { new: true });
    if (!updated) return res.status(404).json({ message: "Class not found" });
    res.json({ message: "Class updated", class: updated });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getTutorClasses = async (req, res) => {
  try {
    const tutorId = req.params.tutorId;
    console.log("Tutor ID:", tutorId);
    const classes = await Class.find({ tutor: tutorId }).populate('students', 'name email');
    console.log("Classes found:", classes);
    res.status(200).json(classes);
  } catch (err) {
    console.error(err);
    console.log("Classes found:", classes);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createClass, getAllClasses, getClassById, updateClass, getTutorClasses };
