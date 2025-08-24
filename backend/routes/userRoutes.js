const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
// const protect = require("../middleware/authMiddleware");
const { protect } = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/authorizeRoles");
const { getAllTutors } = require('../controllers/userController');

router.get("/", (req, res) => {
    res.json({message: "user route is working!"})
});

router.post('/register', registerUser);
router.post('/login', loginUser); 

router.get('/dashboard', protect, authorizeRoles('admin', 'tutor'), (req, res) => {
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