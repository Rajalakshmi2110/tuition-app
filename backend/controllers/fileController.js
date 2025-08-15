const File = require("../models/File");
const path = require("path");
const fs = require("fs");

// Upload file
exports.uploadFile = async (req, res) => {
  try {
    const file = new File({
      className: req.body.className,
      uploadedBy: req.user._id,
      role: req.user.role,
      fileName: req.file.filename,
      filePath: req.file.path,
      fileType: req.file.mimetype
    });

    await file.save();
    res.status(201).json({ message: "File uploaded successfully", file });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get files (role based)
exports.getFiles = async (req, res) => {
  try {
    let files;
    if (req.user.role === "admin") {
      files = await File.find();
    } else if (req.user.role === "tutor") {
      files = await File.find({ uploadedBy: req.user._id });
    } else if (req.user.role === "student") {
      files = await File.find({ className: req.query.className });
    }
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete file
exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    // Delete from disk
    fs.unlinkSync(file.filePath);
    await file.remove();
    res.json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
