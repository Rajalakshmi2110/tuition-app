const express = require('express');
const router = express.Router();
const upload = require('../Middleware/uploadMiddleware');
const { protect } = require('../Middleware/authMiddleware');
const { uploadMaterial, getAllMaterials } = require('../controllers/fileController');

router.post('/', protect, upload.single('file'), uploadMaterial);
router.get('/', protect, getAllMaterials);

module.exports = router;
