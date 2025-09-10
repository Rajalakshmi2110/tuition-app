// seed.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// 1️⃣ Connect to MongoDB Atlas
const DB_URI = process.env.MONGO_URI; 

mongoose.connect(DB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// 2️⃣ Create a schema and model
const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  email: String,
  password: String,
  role: String,
  createdAt: Date,
  status: String,
  updatedAt: Date,
});

const User = mongoose.model("User", userSchema);

// 3️⃣ Hash the admin password
const plainPassword = "password"; // admin's actual password

bcrypt.hash(plainPassword, 10, (err, hashedPassword) => {
  if (err) {
    console.error("Error hashing password:", err);
    mongoose.connection.close();
    return;
  }

  // 4️⃣ Create admin document with hashed password
  const adminUser = new User({
    _id: new mongoose.Types.ObjectId("68b251b6db2f8eab74cb0ce2"),
    name: "Admin",
    email: "cegmca26@gmail.com",
    password: hashedPassword, // store hashed password
    role: "admin",
    createdAt: new Date("2025-08-30T01:19:50.352Z"),
    status: "approved",
    updatedAt: new Date("2025-09-09T03:14:39.388Z"),
  });

  // 5️⃣ Insert admin into DB
  adminUser.save()
    .then(() => {
      console.log("Admin user added successfully!");
      mongoose.connection.close();
    })
    .catch((err) => {
      console.error("Error adding admin user:", err);
      mongoose.connection.close();
    });
});
