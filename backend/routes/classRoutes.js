const express = require("express");
const router = express.Router();
const { createClass, getAllClasses, getClassById  } = require("../controllers/classController");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// router.post("/create", protect, authorizeRoles('admin'), createClass);

// router.get("/", protect, authorizeRoles('admin', 'tutor'), getAllClasses);

//Create class - by admin nly
router.post("/create", protect, createClass);

//All classes
router.get("/", getAllClasses);

// by ID
router.get("/:id", getClassById);


module.exports = router;
