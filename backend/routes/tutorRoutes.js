// routes/tutorRoutes.js
const express = require("express");
const router = express.Router();
const { getTutorClasses } = require("../controllers/tutorController");

// Get classes for logged-in tutor
router.get("/classes", getTutorClasses);

module.exports = router;
