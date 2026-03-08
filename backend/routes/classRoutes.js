const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { protect, authorize } = require("../Middleware/authMiddleware");

const Class = require("../models/Class");
const StudentClass = require("../models/StudentClass");
const Student = require("../models/User");

// ------------------ ADMIN ROUTES ------------------

// Create a new class
router.post("/create", protect, authorize("admin"), async (req, res) => {
  try {
    const { name, subject, schedule, scheduledDate, tutor, classLevel } = req.body;
    if (!name || !subject || !schedule || !scheduledDate || !tutor || !classLevel)
      return res.status(400).json({ message: "All fields are required" });

    const newClass = await Class.create({
      name, subject, schedule,
      scheduledDate: new Date(scheduledDate),
      tutor, classLevel
    });

    res.status(201).json({
      message: 'Class created successfully. Enroll students manually.',
      class: newClass
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// Get all classes (admin view)
router.get("/", protect, async (req, res) => {
  try {
    // Update existing classes without status to 'scheduled' and add default date
    await Class.updateMany(
      { status: { $exists: false } },
      { $set: { status: 'scheduled', scheduledDate: new Date() } }
    );
    
    const classes = await Class.find().populate("tutor", "name email");
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get classes by className (for student dashboard) - MUST be before /:id
router.get("/by-classname/:className", protect, async (req, res) => {
  try {
    const className = decodeURIComponent(req.params.className);
    
    // Show scheduled classes and classes without status (existing ones)
    const classes = await Class.find({ 
      classLevel: className,
      $or: [
        { status: 'scheduled' },
        { status: { $exists: false } }
      ]
    }).populate("tutor", "name email");
    
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Mark class as completed (tutor only)
router.put("/tutor/class/:id/complete", protect, async (req, res) => {
  try {
    const classId = req.params.id;
    
    // Verify tutor owns this class
    const classItem = await Class.findOne({ _id: classId, tutor: req.user._id });
    if (!classItem) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    // Mark as completed
    classItem.status = 'completed';
    await classItem.save();
    
    res.json({ message: "Class marked as completed" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get class by ID - MUST be after specific routes
router.get("/:id", protect, async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id).populate("tutor", "name email");
    if (!classItem) return res.status(404).json({ message: "Class not found" });
    res.json(classItem);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update class (admin) - whitelist allowed fields
router.put("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const { name, subject, schedule, scheduledDate, classLevel, status } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (subject) updates.subject = subject;
    if (schedule) updates.schedule = schedule;
    if (scheduledDate) updates.scheduledDate = scheduledDate;
    if (classLevel) updates.classLevel = classLevel;
    if (status) updates.status = status;
    const updatedClass = await Class.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updatedClass) return res.status(404).json({ message: "Class not found" });
    res.json(updatedClass);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete class (admin)
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id);
    if (!classItem) return res.status(404).json({ message: "Class not found" });
    
    // Delete associated student enrollments
    await StudentClass.deleteMany({ classId: req.params.id });
    
    // Delete the class
    await Class.findByIdAndDelete(req.params.id);
    
    res.json({ message: "Class deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------ STUDENT ROUTES ------------------

// Get classes enrolled by a student
router.get("/student/:studentId", protect, async (req, res) => {
  try {
    const studentId = req.params.studentId;

    // Only show classes the student is explicitly enrolled in
    const enrolledLinks = await StudentClass.find({ studentId })
      .populate({
        path: "classId",
        populate: { path: "tutor", select: "name email" }
      });

    const enrolledClasses = enrolledLinks.map(link => link.classId).filter(Boolean);
    res.json(enrolledClasses);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// Get available classes for a student (not enrolled yet)
router.get("/available-for-student/:studentId", protect, async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const availableClasses = await Class.find({ classLevel: student.classLevel });
    const enrolledLinks = await StudentClass.find({ studentId: student._id });
    const enrolledClassIds = enrolledLinks.map(link => link.classId.toString());

    const filteredClasses = availableClasses.filter(c => !enrolledClassIds.includes(c._id.toString()));

    res.json(filteredClasses);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Enroll student to class
router.post("/enroll", protect, async (req, res) => {
  const { studentId, classId } = req.body;
  try {
    const existing = await StudentClass.findOne({ studentId, classId });
    if (existing) return res.status(400).json({ message: "Already enrolled" });

    const enrollment = await StudentClass.create({ studentId, classId });
    res.status(201).json(enrollment);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});



// ------------------ TUTOR ROUTES ------------------

// Get classes assigned to a tutor
router.get("/tutor/:tutorId", protect, async (req, res) => {
  try {
    const tutorId = req.params.tutorId;

    const classes = await Class.find({ 
      tutor: tutorId,
      ...(req.query.all ? {} : { status: { $nin: ['completed', 'cancelled'] } })
    });

    // For each class, get enrolled students
    const classesWithStudents = await Promise.all(
      classes.map(async (classItem) => {
        // Get students explicitly enrolled in this class
        const enrollments = await StudentClass.find({ classId: classItem._id })
          .populate('studentId', 'name email className');
        
        const students = enrollments
          .map(e => e.studentId)
          .filter(Boolean);
        
        return {
          ...classItem.toObject(),
          students
        };
      })
    );

    res.json(classesWithStudents);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update class schedule (tutor only)
router.put("/tutor/class/:id", protect, async (req, res) => {
  try {
    const classId = req.params.id;
    const { schedule } = req.body;
    
    // Verify tutor owns this class
    const classItem = await Class.findOne({ _id: classId, tutor: req.user._id });
    if (!classItem) {
      return res.status(403).json({ message: "Not authorized to update this class" });
    }
    
    // Update schedule
    classItem.schedule = schedule;
    await classItem.save();
    
    res.json({ message: "Schedule updated successfully", class: classItem });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add resource link (tutor only)
router.post("/tutor/class/:id/resource", protect, async (req, res) => {
  try {
    const classId = req.params.id;
    const { link } = req.body;
    
    // Verify tutor owns this class
    const classItem = await Class.findOne({ _id: classId, tutor: req.user._id });
    if (!classItem) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    // Add resource link to class
    if (!classItem.resources) classItem.resources = [];
    classItem.resources.push({ link, addedAt: new Date() });
    await classItem.save();
    
    res.json({ message: "Resource added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Post announcement (tutor only)
router.post("/tutor/class/:id/announcement", protect, async (req, res) => {
  try {
    const classId = req.params.id;
    const { text } = req.body;
    
    // Verify tutor owns this class
    const classItem = await Class.findOne({ _id: classId, tutor: req.user._id });
    if (!classItem) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    // Add announcement to class
    if (!classItem.announcements) classItem.announcements = [];
    classItem.announcements.push({ text, postedAt: new Date() });
    await classItem.save();
    
    res.json({ message: "Announcement posted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
