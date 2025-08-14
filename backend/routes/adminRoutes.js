const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middleware/authMiddleware");
const { getUsersByRole, approveTutor, declineTutor } = require("../controllers/adminController");

router.get("/tutors", protect, adminOnly, (req, res) =>
  getUsersByRole(req, res, "tutor")
);

router.get("/tutors/pending", protect, adminOnly, (req, res) =>
  getUsersByRole(req, res, "tutor", "pending")
);

router.patch("/tutors/:id/approve", protect, adminOnly, approveTutor);

router.patch("/tutors/:id/decline", protect, adminOnly, declineTutor);

router.get("/students", protect, adminOnly, (req, res) =>
  getUsersByRole(req, res, "student")
);

module.exports = router;
