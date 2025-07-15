const express = require("express");
const router = express.Router();
const protect = require("../Middleware/authMiddleware");
const { getTutorClasses } = require("../controllers/tutorController");

router.get("/my-classes", protect, getTutorClasses);

module.exports = router;
