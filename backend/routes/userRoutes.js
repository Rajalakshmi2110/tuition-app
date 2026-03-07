const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../Middleware/authMiddleware");
const { getAllTutors } = require('../controllers/userController');

router.get("/", (req, res) => {
    res.json({message: "user route is working!"})
});

router.get('/dashboard', protect, authorize('admin', 'tutor'), (req, res) => {
  res.json({
    message: `Welcome ${req.user.role}!`,
    user: req.user
  });
});

router.get('/profile', protect, (req, res)=>{
    res.json({
        message: "you are logged in!", 
        user: req.user
    })
})

router.get('/tutors', protect, getAllTutors);

module.exports = router;