const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();
console.log("Loaded MONGO_URI:", process.env.MONGO_URI);


const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

// app.get("/", (req,res) => res.send("API is running.."));

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected!"))
.catch(err => console.log(err));

const port =  process.env.PORT || 5000;
app.listen(port, () => console.log( `server running in the port ${port}`));