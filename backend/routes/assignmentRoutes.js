// routes/assignmentRoutes.js
const express = require("express");
const router = express.Router();
const Assignment = require("../models/Assignment");
const upload = require("../middleware/upload");
const { verifyTutor, verifyStudent } = require("../middleware/authMiddleware");

router.post("/create", verifyTutor, upload.single("file"), async (req, res) => {
      console.log('req.file:', req.file);
      console.log('req.body:', req.body);
      console.log('req.user:', req.user);
  try {
    const assignment = new Assignment({
      title: req.body.title,
      description: req.body.description,
      fileUrl: req.file?.path || null,
      tutor: req.user.id,
      classId: req.body.classId,
      deadline: req.body.deadline,
  });

    await assignment.save();
    res.status(201).json(assignment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:id/submit", verifyStudent, upload.single("file"), async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ error: "Assignment not found" });

    assignment.submissions.push({
      student: req.user.id,
      fileUrl: req.file?.path || null,
    });

    await assignment.save();
    res.json({ message: "Submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/:id/grade/:studentId", verifyTutor, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ error: "Assignment not found" });

    const submission = assignment.submissions.find(
      (sub) => sub.student.toString() === req.params.studentId
    );
    if (!submission) return res.status(404).json({ error: "Submission not found" });

    submission.grade = req.body.grade;
    submission.feedback = req.body.feedback;

    await assignment.save();
    res.json({ message: "Graded successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
