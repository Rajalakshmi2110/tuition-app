const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middleware/authMiddleware");
const { getUsersByRole } = require("../controllers/adminController");
// console.log("protect:", protect);
// console.log("adminOnly:", adminOnly);
// console.log("getUsersByRole:", getUsersByRole);



console.log("getUsersByRole is:", getUsersByRole);

router.get("/tutors", protect, adminOnly, (req, res) => getUsersByRole(req, res, "tutor"));
router.get("/students", protect, adminOnly, (req, res) => getUsersByRole(req, res, "student"));

module.exports = router;
