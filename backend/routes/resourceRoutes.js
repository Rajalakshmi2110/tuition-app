const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Resource = require('../models/Resource');
const User = require('../models/User');
const { protect, tutorOnly, adminOnly, authorize } = require('../Middleware/authMiddleware');
const { notifyMultiple } = require('../services/notificationService');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/resources';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, 'resource-' + Date.now() + ext);
  }
});

const allowedTypes = [
  'application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'text/plain',
  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
];

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('File type not allowed'), false);
  }
});

// Tutor: Create resource
router.post('/', protect, tutorOnly, upload.single('file'), async (req, res) => {
  try {
    const { title, description, classLevel, subject, category } = req.body;
    if (!title || !classLevel || !subject || !category) {
      return res.status(400).json({ message: 'title, classLevel, subject, and category are required' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'File is required' });
    }

    const resource = await Resource.create({
      title, description: description || '', url: req.file.path,
      classLevel, subject, category, uploadedBy: req.user._id
    });

    // Notify students in this class+subject
    try {
      const students = await User.find({ role: 'student', status: 'approved', className: classLevel, subjects: subject }).select('_id');
      await notifyMultiple(students.map(s => s._id), 'resource_uploaded', 'New Study Material', `"${title}" uploaded for ${subject} (Class ${classLevel}).`, '/student/resources');
    } catch (e) {}

    res.status(201).json(resource);
  } catch (err) {
    res.status(500).json({ message: 'Failed to upload resource' });
  }
});

// Tutor: Get own resources
router.get('/my', protect, tutorOnly, async (req, res) => {
  try {
    const resources = await Resource.find({ uploadedBy: req.user._id })
      .sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch resources' });
  }
});

// Tutor: Update resource (metadata only, not file)
router.put('/:id', protect, tutorOnly, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    if (resource.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, description, classLevel, subject, category } = req.body;
    if (title) resource.title = title;
    if (description !== undefined) resource.description = description;
    if (classLevel) resource.classLevel = classLevel;
    if (subject) resource.subject = subject;
    if (category) resource.category = category;

    await resource.save();
    res.json(resource);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update resource' });
  }
});

// Tutor: Delete own resource
router.delete('/:id', protect, authorize('tutor', 'admin'), async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });

    if (req.user.role === 'tutor' && resource.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete file from disk
    if (fs.existsSync(resource.url)) {
      fs.unlinkSync(resource.url);
    }

    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resource deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete resource' });
  }
});

// Student: Get resources for registered class & subjects
router.get('/student', protect, authorize('student'), async (req, res) => {
  try {
    const user = req.user;
    if (!user.className || !user.subjects || user.subjects.length === 0) {
      return res.json([]);
    }

    const orConditions = user.subjects.map(subject => ({
      classLevel: user.className,
      subject: { $regex: new RegExp(`^${subject.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
    }));

    const resources = await Resource.find({ $or: orConditions })
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch resources' });
  }
});

// Admin: Get all resources
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const resources = await Resource.find()
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch resources' });
  }
});

module.exports = router;
