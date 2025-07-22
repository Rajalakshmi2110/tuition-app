const express = require("express");
const router = express.Router();
const { createClass, getAllClasses, getClassById, updateClass   } = require("../controllers/classController");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// router.post("/create", protect, authorizeRoles('admin'), createClass);

// router.get("/", protect, authorizeRoles('admin', 'tutor'), getAllClasses);

router.post("/create", protect, createClass);

router.get("/", getAllClasses);

router.get("/:id", getClassById);
router.put("/:id", protect, updateClass);


module.exports = router;
