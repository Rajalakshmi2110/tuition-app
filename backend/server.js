const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const fs = require('fs');

// Load environment variables first
require('dotenv').config();

// Then load passport config (which needs env vars)
const passport = require('./config/passport');
console.log("Loaded MONGO_URI:", process.env.MONGO_URI);
console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);
console.log("EMAIL_USER exists:", !!process.env.EMAIL_USER);
console.log("NODE_ENV:", process.env.NODE_ENV);

const app = express();
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://rajituitionapp.netlify.app/'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Create uploads directories if they don't exist
const uploadsDir = path.join(__dirname, 'uploads');
const galleryDir = path.join(__dirname, 'uploads', 'gallery');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
if (!fs.existsSync(galleryDir)) fs.mkdirSync(galleryDir);

// Session middleware for Passport
app.use(session({
  secret: process.env.JWT_SECRET || 'mysecretkey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Serve payment screenshots
app.get('/uploads/payments/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', 'payments', filename);
  
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp'
  };
  
  const contentType = mimeTypes[ext] || 'image/jpeg';
  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Disposition', 'inline');
  
  res.sendFile(filePath);
});

// Serve uploaded files with proper MIME types
app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);
  
  // Set proper content type based on file extension
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes = {
    '.pdf': 'application/pdf',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.txt': 'text/plain',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  };
  
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  res.setHeader('Content-Type', contentType);
  
  // For viewing in browser (not forcing download)
  if (req.query.download === 'true') {
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  } else {
    res.setHeader('Content-Disposition', 'inline');
  }
  
  res.sendFile(filePath);
});

// Serve gallery images
app.get('/uploads/gallery/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', 'gallery', filename);
  
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp'
  };
  
  const contentType = mimeTypes[ext] || 'image/jpeg';
  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Disposition', 'inline');
  
  res.sendFile(filePath);
});

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const classRoutes = require('./routes/classRoutes');
app.use("/api/classes", classRoutes);

const studentRoutes = require('./routes/studentRoutes');
app.use("/api/students", studentRoutes);

const tutorRoutes = require('./routes/tutorRoutes');
app.use('/api/tutors', tutorRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const classAssignmentRoutes = require("./routes/classAssignmentRoutes");
app.use("/api/class", classAssignmentRoutes);

const studentClassRoutes = require("./routes/studentClassRoutes");
app.use("/api/student-classes", studentClassRoutes);

const tutorClassRoutes = require("./routes/tutorClassRoutes");
app.use("/api/tutor-classes", tutorClassRoutes);

const fileRoutes = require("./routes/fileRoutes");
app.use("/api/files", fileRoutes);

const announcementRoutes = require("./routes/announcementRoutes");
app.use("/api/announcements", announcementRoutes);

const publicRoutes = require("./routes/publicRoutes");
app.use("/api/public", publicRoutes);

const feedbackRoutes = require("./routes/feedbackRoutes");
app.use("/api/feedback", feedbackRoutes);

const galleryRoutes = require("./routes/galleryRoutes");
app.use("/api/gallery", galleryRoutes);

const performanceRoutes = require("./routes/performanceRoutes");
app.use("/api/performance", performanceRoutes);

const assignmentRoutes2 = require("./routes/assignmentRoutes2");
app.use("/api/assignments", assignmentRoutes2);

const gamificationRoutes = require("./routes/gamificationRoutes");
app.use("/api/gamification", gamificationRoutes);

const paymentRoutes = require("./routes/paymentRoutes");
app.use("/api/payments", paymentRoutes);

const mlRoutes = require("./routes/mlRoutes");
app.use("/api/ml", mlRoutes);

const tutorAnalyticsRoutes = require("./routes/tutorAnalyticsRoutes");
app.use("/api/tutor-analytics", tutorAnalyticsRoutes);

const reportsRoutes = require("./routes/reportsRoutes");
app.use("/api/reports", reportsRoutes);

// Catch-all for OAuth redirects
app.get('/login', (req, res) => {
  res.redirect('http://localhost:3000/login?error=oauth_cancelled');
});

app.get("/", (req,res) => res.json({ message: "Tuition Management API is running!", status: "success" }));

app.get("/api/health", (req,res) => res.json({ status: "healthy", timestamp: new Date() }));

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tuitionApp')
.then(() => console.log("MongoDB connected!"))
.catch(err => console.log(err));

const port =  process.env.PORT || 5000;
app.listen(port, () => console.log( `server running in the port ${port}`));