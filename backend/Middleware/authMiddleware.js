const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect middleware
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (err) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Admin only middleware
const adminOnly = (req, res, next) => {
  if (req.user?.role === "admin") next();
  else res.status(403).json({ message: "Admin access only" });
};

// Tutor only middleware
const tutorOnly = (req, res, next) => {
  if (req.user?.role === "tutor") next();
  else res.status(403).json({ message: "Tutor access only" });
};


const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ message: `Role ${req.user?.role} not authorized` });
    }
    next();
  };
};

const verifyTutor = [protect, tutorOnly];
const verifyStudent = [protect, authorize("student")];

module.exports = { protect, adminOnly, tutorOnly, authorize, verifyTutor, verifyStudent };


