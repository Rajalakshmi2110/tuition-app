const express = require("express");
const router = express.Router();
const { getTutorClasses } = require("../controllers/tutorController");
const { uploadDocument } = require("../controllers/documentController");
const { protect, authorize } = require("../Middleware/authMiddleware");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Routes
router.get("/classes", protect, authorize("tutor"), getTutorClasses);

router.post(
  "/upload/:classId",
  protect,
  authorize("tutor"),
  upload.single("file"),
  uploadDocument
);

module.exports = router;
