const express = require("express");
const router = express.Router();

const { getTutorClasses } = require("../controllers/tutorController");

router.get("/classes", getTutorClasses);


module.exports = router;
