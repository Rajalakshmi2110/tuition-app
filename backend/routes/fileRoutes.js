const express = require('express');
const router = express.Router();
const multer = require('multer');
const File = require('../models/File');
const Class = require('../models/Class');
const { protect } = require('../Middleware/authMiddleware');

// Multer setup with file extension preservation
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    cb(null, file.fieldname + '-' + Date.now() + '.' + ext);
  }
});
const upload = multer({ storage });

// Test route
router.get('/test', (req, res) => {
  console.log('Test route hit');
  res.json({ message: 'File routes working' });
});

// Test route for admin files (no auth)
router.get('/admin-test', async (req, res) => {
  try {
    const fileCount = await File.countDocuments();
    res.json({ message: 'Admin files test working', fileCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Upload route with multer (both /upload and / for compatibility)
router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    console.log('Upload route hit');
    console.log('Body:', req.body);
    console.log('File:', req.file);
    
    if (!req.body.classId) {
      return res.status(400).json({ message: 'classId is required' });
    }
    
    const newFile = await File.create({
      title: req.body.title || 'Test File',
      url: req.file ? req.file.path : 'https://example.com/test.pdf',
      uploadedBy: req.user._id,
      classId: req.body.classId,
    });
    
    res.json(newFile);
  } catch (error) {
    console.error('Upload error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

router.post('/upload', protect, upload.single('file'), async (req, res) => {
  try {
    console.log('Upload route hit');
    console.log('Body:', req.body);
    console.log('File:', req.file);
    
    if (!req.body.classId) {
      return res.status(400).json({ message: 'classId is required' });
    }
    
    const newFile = await File.create({
      title: req.body.title || 'Test File',
      url: req.file ? req.file.path : 'https://example.com/test.pdf',
      uploadedBy: req.user._id,
      classId: req.body.classId,
    });
    
    res.json(newFile);
  } catch (error) {
    console.error('Upload error:', error.message);
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
    console.error('Error fetching files:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get files by className (for students)
router.get('/by-classname/:className', protect, async (req, res) => {
  try {
    const className = decodeURIComponent(req.params.className);
    
    // Find all classes with this classLevel
    const classes = await Class.find({ classLevel: className });
    const classIds = classes.map(c => c._id);
    
    // Find files for these classes
    const files = await File.find({ classId: { $in: classIds } })
      .populate('uploadedBy', 'name')
      .populate('classId', 'name');
    
    res.json(files);
  } catch (err) {
    console.error('Error fetching files by className:', err);
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
    console.error('Error deleting file:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;