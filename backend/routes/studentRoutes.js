const express = require("express");
const router = express.Router();
const protect = require("../Middleware/authMiddleware");
const { enrollInClass, getMyClasses, getAvailableClasses } = require("../controllers/studentController");

router.post("/enroll", protect, enrollInClass);

router.get("/my-classes", protect, getMyClasses);

router.get('/available-classes', protect, getAvailableClasses);


module.exports = router;
