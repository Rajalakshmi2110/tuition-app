const TutorClass = require("../models/TutorClass");
const StudentClass = require("../models/StudentClass");

exports.assignTutorToClass = async (req, res) => {
  try {
    const { tutorId, classId } = req.body;
    const exists = await TutorClass.findOne({ tutorId, classId });
    if (exists) return res.status(400).json({ message: "Tutor already assigned to this class" });

    const tutorClass = new TutorClass({ tutorId, classId });
    await tutorClass.save();
    res.status(201).json(tutorClass);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.enrollStudentInClass = async (req, res) => {
  try {
    const { studentId, classId } = req.body;
    const exists = await StudentClass.findOne({ studentId, classId });
    if (exists) return res.status(400).json({ message: "Student already enrolled in this class" });

    const studentClass = new StudentClass({ studentId, classId });
    await studentClass.save();
    res.status(201).json(studentClass);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTutorsOfClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const tutors = await TutorClass.find({ classId }).populate("tutorId", "name email");
    res.json(tutors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStudentsOfClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const students = await StudentClass.find({ classId }).populate("studentId", "name email");
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
