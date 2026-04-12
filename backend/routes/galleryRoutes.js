const express = require('express');
const Gallery = require('../models/Gallery');
const { protect, adminOnly } = require('../Middleware/authMiddleware');
const { uploadGallery, deleteFromCloudinary } = require('../config/cloudinary');

const router = express.Router();

// Get all active gallery images (public)
router.get('/', async (req, res) => {
  try {
    const images = await Gallery.find({ active: true }).sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload new gallery image (admin only)
router.post('/', protect, adminOnly, uploadGallery.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    const { title, description, category } = req.body;

    const gallery = new Gallery({
      title,
      description,
      category,
      imageUrl: req.file.path
    });

    await gallery.save();
    res.status(201).json(gallery);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete gallery image (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (image) {
      await deleteFromCloudinary(image.imageUrl);
      await Gallery.findByIdAndDelete(req.params.id);
    }
    res.json({ message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
