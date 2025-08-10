const Class = require("../models/Class");
const TutorClass = require("../models/TutorClass");
const StudentClass = require("../models/StudentClass");


// const createClass = async (req, res) => {
//   try {
//     const { name, subject, description, schedule, tutor } = req.body;

//     if (!name || !subject || !schedule || !tutor) {
//       return res.status(400).json({ message: "Name, subject, schedule, and tutor are required" });
//     }

//     const newClass = new Class({
//       name,
//       subject,
//       description,
//       schedule,
//       tutor
//     });

//     await newClass.save();

//     res.status(201).json(newClass);
//   } catch (err) {
//     console.error("Error creating class:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };


const createClass = async (req, res) => {
  try {
    const { name, subject, description, schedule, tutor, students = [] } = req.body;

    if (!name || !subject || !schedule || !tutor) {
      return res.status(400).json({ message: "Name, subject, schedule, and tutor are required" });
    }

    const newClass = new Class({
      name,
      subject,
      description,
      schedule,
      tutor
    });
    await newClass.save();

    await TutorClass.create({ tutorId: tutor, classId: newClass._id });

    if (students.length > 0) {
      const studentLinks = students.map(sId => ({
        studentId: sId,
        classId: newClass._id
      }));
      await StudentClass.insertMany(studentLinks);
    }

    res.status(201).json({
      message: "Class created and linked successfully",
      class: newClass
    });

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

// Get class by ID
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

// Update class (e.g., assign tutor)
const updateClass = async (req, res) => {
  const { id } = req.params;
  const { tutorId } = req.body;

  try {
    const updated = await Class.findByIdAndUpdate(
      id,
      { tutor: tutorId },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.json({ message: "Class updated", class: updated });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createClass, getAllClasses, getClassById, updateClass };
