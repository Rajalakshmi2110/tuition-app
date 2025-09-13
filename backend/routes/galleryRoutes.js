const express = require('express');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const Gallery = require('../models/Gallery');
const { protect, adminOnly } = require('../Middleware/authMiddleware');

const router = express.Router();

// Configure Cloudinary storage for gallery images
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'tuition_app_gallery',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  },
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed'), false);
    }
  }
});

// Get all active gallery images (public)
router.get('/', async (req, res) => {
  try {
    const images = await Gallery.find({ active: true }).sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload new gallery image (admin only)
router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }
    
    const { title, description, category } = req.body;
    
    const gallery = new Gallery({
      title,
      description,
      category,
      imageUrl: req.file.path // Cloudinary URL
    });
    
    await gallery.save();
    res.status(201).json(gallery);
  } catch (err) {
    console.error('Gallery upload error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete gallery image (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Image deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;