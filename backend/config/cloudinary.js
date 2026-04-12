const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const galleryStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'kalviyagam/gallery', allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'] }
});

const resourceStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'kalviyagam/resources', resource_type: 'auto' }
});

const paymentStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'kalviyagam/payments', allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'] }
});

const uploadGallery = multer({ storage: galleryStorage });
const uploadResource = multer({ storage: resourceStorage, limits: { fileSize: 10 * 1024 * 1024 } });
const uploadPayment = multer({ storage: paymentStorage });

const deleteFromCloudinary = async (url) => {
  try {
    if (!url || !url.includes('cloudinary')) return;
    const parts = url.split('/');
    const folderAndFile = parts.slice(parts.indexOf('kalviyagam')).join('/');
    const publicId = folderAndFile.replace(/\.[^/.]+$/, '');
    await cloudinary.uploader.destroy(publicId);
  } catch (e) {}
};

module.exports = { cloudinary, uploadGallery, uploadResource, uploadPayment, deleteFromCloudinary };
