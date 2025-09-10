require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const createAdmin = async () => {
  try {
    const hashedPassword = await bcrypt.hash('password', 10);
    
    const admin = new User({
      name: 'Admin',
      email: 'cegmca26@gmail.com',
      password: hashedPassword,
      role: 'admin',
      status: 'approved'
    });

    await admin.save();
    console.log('Admin user created successfully!');
    console.log('Email: cegmca26@gmail.com');
    console.log('Password: password');
  } catch (error) {
    if (error.code === 11000) {
      console.log('Admin user already exists');
    } else {
      console.error('Error creating admin:', error);
    }
  } finally {
    mongoose.connection.close();
  }
};

createAdmin();