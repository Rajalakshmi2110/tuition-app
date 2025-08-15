const express = require("express");
const router = express.Router();
const { getTutorClasses } = require("../controllers/tutorController");
const { uploadDocument } = require("../controllers/documentController");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
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
