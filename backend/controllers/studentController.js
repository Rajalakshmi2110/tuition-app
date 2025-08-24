const User = require("../models/User");
const Class = require("../models/Class");

const enrollInClass = async (req, res) => {
  if (req.user.role !== "student") return res.status(403).json({ message: "Only students can enroll." });

  const { classId } = req.body;

  try {
    const student = await User.findById(req.user.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    if (student.enrolledClasses.includes(classId)) {
      return res.status(400).json({ message: "Already enrolled in this class" });
    }

    student.enrolledClasses.push(classId);
    await student.save();

    res.status(200).json({ message: "Enrolled successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getMyClasses = async (req, res) => {
  if (req.user.role !== "student") return res.status(403).json({ message: "Only students can view their classes" });

  try {
    const student = await User.findById(req.user.id).populate("enrolledClasses");
    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json({ enrolledClasses: student.enrolledClasses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getAvailableClasses = async (req, res) => {
  try {
    const student = await User.findById(req.user.id).lean();
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const enrolledClassIds = student.enrolledClasses || [];

    const availableClasses = await Class.find({
      _id: { $nin: enrolledClassIds }
    }).populate('tutor', 'name email');

    res.json({ availableClasses });
  } catch (err) {
    console.error('Error getting available classes:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getTutorsForStudent = async (req, res) => {
  try {
    const student = await User.findById(req.user.id);
    if (!student || student.role !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Find all tutors teaching the same className
    const tutors = await User.find({
      role: 'tutor',
      className: student.className
    });

    res.json(tutors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { enrollInClass, getMyClasses, getAvailableClasses, getTutorsForStudent  };
