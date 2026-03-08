const express = require('express');
const router = express.Router();
const multer = require('multer');
const File = require('../models/File');
const Class = require('../models/Class');
const { protect } = require('../Middleware/authMiddleware');

// Multer setup with file extension preservation and limits
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    cb(null, file.fieldname + '-' + Date.now() + '.' + ext);
  }
});
const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'text/plain',
  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('File type not allowed'), false);
  }
});

// Upload file
router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.body.classId) {
      return res.status(400).json({ message: 'classId is required' });
    }
    
    const newFile = await File.create({
      title: req.body.title || 'Test File',
      url: req.file ? req.file.path : '',
      uploadedBy: req.user._id,
      classId: req.body.classId,
    });
    
    res.json(newFile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/upload', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.body.classId) {
      return res.status(400).json({ message: 'classId is required' });
    }
    
    const newFile = await File.create({
      title: req.body.title || 'Test File',
      url: req.file ? req.file.path : '',
      uploadedBy: req.user._id,
      classId: req.body.classId,
    });
    
    res.json(newFile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all files
router.get('/', protect, async (req, res) => {
  try {
    const files = await File.find()
      .populate('uploadedBy', 'name')
      .populate('classId', 'name classLevel');
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get files by className (for students) - only files from enrolled classes
router.get('/by-classname/:className', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get classes the student is explicitly enrolled in
    const StudentClass = require('../models/StudentClass');
    const enrollments = await StudentClass.find({ studentId: userId });
    const enrolledClassIds = enrollments.map(e => e.classId);
    
    if (enrolledClassIds.length === 0) {
      return res.json([]);
    }
    
    // Find files only for enrolled classes
    const files = await File.find({ classId: { $in: enrolledClassIds } })
      .populate('uploadedBy', 'name')
      .populate('classId', 'name');
    
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a file
router.delete('/:id', protect, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    await File.findByIdAndDelete(req.params.id);
    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;