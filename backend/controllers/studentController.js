const User = require("../models/User");
const Class = require("../models/Class");
const StudentClass = require("../models/StudentClass");

const enrollInClass = async (req, res) => {
  if (req.user.role !== "student") return res.status(403).json({ message: "Only students can enroll." });

  const { classId } = req.body;

  try {
    const student = await User.findById(req.user.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const existing = await StudentClass.findOne({ studentId: req.user.id, classId });
    if (existing) {
      return res.status(400).json({ message: "Already enrolled in this class" });
    }

    await StudentClass.create({ studentId: req.user.id, classId });

    res.status(200).json({ message: "Enrolled successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getMyClasses = async (req, res) => {
  if (req.user.role !== "student") return res.status(403).json({ message: "Only students can view their classes" });

  try {
    const enrollments = await StudentClass.find({ studentId: req.user.id }).populate({
      path: "classId",
      populate: { path: "tutor", select: "name email" }
    });

    const enrolledClasses = enrollments.map(e => e.classId).filter(Boolean);
    res.json({ enrolledClasses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getAvailableClasses = async (req, res) => {
  try {
    const student = await User.findById(req.user.id).lean();
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const enrollments = await StudentClass.find({ studentId: req.user.id }).lean();
    const enrolledClassIds = enrollments.map(e => e.classId);

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

module.exports = { enrollInClass, getMyClasses, getAvailableClasses, getTutorsForStudent };
