const Notification = require('../models/Notification');
const User = require('../models/User');

const createNotification = async (userId, type, title, message, link = '', metadata = {}) => {
  try {
    await Notification.create({ userId, type, title, message, link, metadata });
  } catch (err) {
    console.error('Notification creation failed:', err.message);
  }
};

const notifyByRole = async (role, type, title, message, link = '', metadata = {}) => {
  try {
    const users = await User.find({ role, status: 'approved' }).select('_id');
    const docs = users.map(u => ({ userId: u._id, type, title, message, link, metadata }));
    if (docs.length) await Notification.insertMany(docs);
  } catch (err) {
    console.error('Bulk notification failed:', err.message);
  }
};

const notifyMultiple = async (userIds, type, title, message, link = '', metadata = {}) => {
  try {
    const docs = userIds.map(id => ({ userId: id, type, title, message, link, metadata }));
    if (docs.length) await Notification.insertMany(docs);
  } catch (err) {
    console.error('Multi notification failed:', err.message);
  }
};

module.exports = { createNotification, notifyByRole, notifyMultiple };
