require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const testLogin = async () => {
  try {
    const email = 'cegmca26@gmail.com';
    const password = 'password';
    
    console.log('Testing login for:', email);
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found:', user.name, user.role);
    
    if (!user.password) {
      console.log('❌ No password set for user');
      return;
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      console.log('✅ Password matches!');
    } else {
      console.log('❌ Password does not match');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
};

testLogin();