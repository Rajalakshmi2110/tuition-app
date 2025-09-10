require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const checkUsers = async () => {
  try {
    const users = await User.find({});
    console.log('All users in database:');
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role} - Status: ${user.status}`);
    });
    
    const admin = await User.findOne({ email: 'cegmca26@gmail.com' });
    if (admin) {
      console.log('\nAdmin user found:', admin.email);
    } else {
      console.log('\nNo admin user found with email cegmca26@gmail.com');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
};

checkUsers();