const express = require("express");
const router = express.Router();
const { getTutorClasses } = require("../controllers/tutorController");
const { uploadDocument } = require("../controllers/documentController");
const { protect } = require("../Middleware/authMiddleware");
const authorizeRoles = require("../Middleware/authorizeRoles"); 
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
const upload = multer({ storage });

// Routes
router.get("/classes", protect, authorizeRoles("tutor"), getTutorClasses);

router.post(
  "/upload/:classId",
  protect,
  authorizeRoles("tutor"),
  upload.single("file"),
  uploadDocument
);

module.exports = router;
