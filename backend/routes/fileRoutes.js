const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');
const { uploadMaterial, getAllMaterials } = require('../controllers/fileController');

router.post('/', protect, upload.single('file'), uploadMaterial);

router.get('/', protect, getAllMaterials);

module.exports = router;
