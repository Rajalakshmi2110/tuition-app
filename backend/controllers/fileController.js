const Material = require("../models/Material");

const uploadMaterial = async (req, res) => {
  try {
    const { title } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded!" });
    }

    const newMaterial = new Material({
      title,
      fileUrl: file.path,
      uploadedBy: req.user._id,
      role: req.user.role,
    });

    await newMaterial.save();

    res.status(201).json({ message: "File uploaded!", material: newMaterial });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.find().populate("uploadedBy", "name role");
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  uploadMaterial,
  getAllMaterials,
};
