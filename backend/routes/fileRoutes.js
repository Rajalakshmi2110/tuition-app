const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { uploadFile, getFiles, deleteFile } = require("../controllers/fileController");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

router.post("/upload", protect, authorizeRoles("tutor", "admin"), upload.single("file"), uploadFile);

router.get("/", protect, getFiles);

router.delete("/:id", protect, authorizeRoles("tutor", "admin"), deleteFile);

module.exports = router;
