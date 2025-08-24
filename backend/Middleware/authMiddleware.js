const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect middleware
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // 🔹 Debug logs must be INSIDE the function
      console.log("Authorization header:", req.headers.authorization);
      console.log("Extracted token:", token);
      console.log("JWT_SECRET being used:", process.env.JWT_SECRET || "mysecretkey");

      const decoded = jwt.verify(token, process.env.JWT_SECRET || "mysecretkey");

      console.log("Decoded token payload:", decoded);

      req.user = await User.findById(decoded.id).select("-password");
      console.log("User from DB:", req.user);

      next();
    } catch (err) {
      console.error("JWT error:", err.message);
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
    console.log("User role:", req.user.role);
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ message: `Role ${req.user?.role} not authorized` });
    }
    next();
  };
};

const verifyTutor = [protect, tutorOnly];
const verifyStudent = [protect, authorize("student")];

module.exports = { protect, adminOnly, tutorOnly, authorize, verifyTutor, verifyStudent };


