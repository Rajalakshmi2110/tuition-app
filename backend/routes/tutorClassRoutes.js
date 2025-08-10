
const express = require("express");
const router = express.Router();
const TutorClass = require("../models/TutorClass");

router.post("/", async (req, res) => {
  try {
    const { tutorId, classId } = req.body;
    const newTutorClass = new TutorClass({ tutorId, classId });
    await newTutorClass.save();
    res.status(201).json(newTutorClass);
  } catch (err) {
    console.error("Error creating tutor-class link:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:tutorId", async (req, res) => {
  try {
    const tutorLinks = await TutorClass.find({ tutorId: req.params.tutorId })
      .populate({
        path: "classId",
        populate: { path: "students", select: "name email" }
      });

    if (!tutorLinks.length) {
      return res.status(404).json({ message: "No classes found for this tutor" });
    }

    const classes = tutorLinks.map(link => link.classId);
    res.json(classes);
  } catch (err) {
    console.error("Error fetching tutor classes:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
