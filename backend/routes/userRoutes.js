const express = require("express");
const router = express.Router();
const { protect } = require("../Middleware/authMiddleware");
const authorizeRoles = require("../Middleware/authorizeRoles");
const { getAllTutors } = require('../controllers/userController');
const { loginUser } = require('../controllers/authController');

router.get("/", (req, res) => {
    res.json({message: "user route is working!"})
});

router.post('/test', (req, res) => {
  console.log('Test endpoint hit - Body:', req.body);
  res.json({ message: 'Test successful', body: req.body });
});

router.post('/login', async (req, res) => {
  console.log('Login request body:', req.body);
  console.log('Content-Type:', req.headers['content-type']);
  try {
    await loginUser(req, res);
  } catch (error) {
    console.error('Login route error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
}); 

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