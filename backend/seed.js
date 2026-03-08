require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@tuitix.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_PASSWORD) {
  console.error('FATAL: Set ADMIN_PASSWORD env var before running seed');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => { console.error('MongoDB connection error:', err.message); process.exit(1); });

const createAdmin = async () => {
  try {
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    const admin = new User({
      name: 'Admin',
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin',
      status: 'approved'
    });

    await admin.save();
    console.log('Admin user created successfully');
  } catch (error) {
    if (error.code === 11000) {
      console.log('Admin user already exists');
    } else {
      console.error('Error creating admin:', error.message);
    }
  } finally {
    mongoose.connection.close();
  }
};

createAdmin();
