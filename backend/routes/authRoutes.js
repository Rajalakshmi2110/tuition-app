const express = require('express');
const router = express.Router();
const { registerUser, loginUser, forgotPassword, resetPassword, googleAuthSuccess, completeGoogleRegistration } = require('../controllers/authController');
const passport = require('../config/passport');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/complete-google-registration', completeGoogleRegistration);

// Google OAuth routes (only if configured)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  router.get('/google/callback', passport.authenticate('google', { failureRedirect: 'http://localhost:3000/login?error=oauth_cancelled' }), googleAuthSuccess);
} else {
  router.get('/google', (req, res) => {
    console.log('Google OAuth attempt - CLIENT_ID exists:', !!process.env.GOOGLE_CLIENT_ID);
    console.log('Google OAuth attempt - CLIENT_SECRET exists:', !!process.env.GOOGLE_CLIENT_SECRET);
    res.status(500).json({ 
      message: 'Google OAuth not configured', 
      details: 'Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET environment variables'
    });
  });
}

module.exports = router;