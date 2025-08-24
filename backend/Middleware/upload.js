const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'tuition_app_files',
    allowed_formats: ['jpg', 'png', 'pdf', 'docx', 'pptx'], 
  },
});

const parser = multer({ storage });

module.exports = parser;
