const express = require('express');
const router = express.Router();
const ExamSchedule = require('../models/ExamSchedule');
const { protect, adminOnly } = require('../Middleware/authMiddleware');
const { createNotification, notifyByRole } = require('../services/notificationService');

// Student: Add exam
router.post('/', protect, async (req, res) => {
  try {
    const { subject, examDate, examTime, examType, notes } = req.body;
    if (!subject || !examDate || !examTime || !examType) {
      return res.status(400).json({ message: 'Subject, date, time, and type are required' });
    }

    const exam = await ExamSchedule.create({
      studentId: req.user._id, subject, examDate, examTime, examType, notes
    });

    // Notify admin and tutors
    const studentName = req.user.name;
    const dateStr = new Date(examDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    await notifyByRole('admin', 'exam_scheduled', 'Exam Scheduled',
      `${studentName} has ${examType} for ${subject} on ${dateStr}`, '/admin');
    await notifyByRole('tutor', 'exam_scheduled', 'Student Exam Alert',
      `${studentName} (Class ${req.user.className}) has ${examType} for ${subject} on ${dateStr}`, '/tutor');

    res.status(201).json(exam);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add exam' });
  }
});

// Student: Get my exams
router.get('/my', protect, async (req, res) => {
  try {
    const exams = await ExamSchedule.find({ studentId: req.user._id })
      .sort({ examDate: 1 });
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch exams' });
  }
});

// Student: Delete exam
router.delete('/:id', protect, async (req, res) => {
  try {
    await ExamSchedule.findOneAndDelete({ _id: req.params.id, studentId: req.user._id });
    res.json({ message: 'Exam deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete' });
  }
});

// Admin/Tutor: Get all upcoming exams
router.get('/all', protect, async (req, res) => {
  try {
    const exams = await ExamSchedule.find({ examDate: { $gte: new Date() } })
      .populate('studentId', 'name className')
      .sort({ examDate: 1 });
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch exams' });
  }
});

module.exports = router;
