const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();
console.log("Loaded MONGO_URI:", process.env.MONGO_URI);

const app = express();
app.use(cors());
app.use(express.json());


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

const fileRoutes = require('./routes/fileRoutes');
app.use('/api/files', fileRoutes);


// app.get("/", (req,res) => res.send("API is running.."));

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected!"))
.catch(err => console.log(err));

const port =  process.env.PORT || 5000;
app.listen(port, () => console.log( `server running in the port ${port}`));