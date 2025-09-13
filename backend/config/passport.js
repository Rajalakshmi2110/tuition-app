const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Only configure Google OAuth if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "https://tuitionapp-yq06.onrender.com/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists
    let user = await User.findOne({ email: profile.emails[0].value });
    
    if (user) {
      // User exists, update Google ID if not set
      if (!user.googleId) {
        user.googleId = profile.id;
        await user.save();
      }
      return done(null, user);
    }
    
    // For new users, don't auto-create - redirect to role selection
    const tempUserData = {
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
      needsRoleSelection: true
    };
    
    done(null, tempUserData);
  } catch (error) {
    done(error, null);
  }
}));
} else {
  console.log('Google OAuth not configured - missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET');
}

passport.serializeUser((user, done) => {
  // Handle temporary user data for role selection
  if (user.needsRoleSelection) {
    done(null, { needsRoleSelection: true, userData: user });
  } else {
    done(null, user.id || user._id);
  }
});

passport.deserializeUser(async (data, done) => {
  try {
    // Handle temporary user data
    if (typeof data === 'object' && data.needsRoleSelection) {
      done(null, data.userData);
    } else {
      const user = await User.findById(data);
      done(null, user);
    }
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;