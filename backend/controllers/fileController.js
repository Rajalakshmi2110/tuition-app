const Material = require('../models/materialModel'); 

const uploadMaterial = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const newMaterial = new Material({
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      uploadedBy: req.user._id,
      uploadDate: Date.now(),
    });

    await newMaterial.save();
    res.status(201).json({ message: 'File uploaded successfully', material: newMaterial });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.find().sort({ uploadDate: -1 });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { uploadMaterial, getAllMaterials };
