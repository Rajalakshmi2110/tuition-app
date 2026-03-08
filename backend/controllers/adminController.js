const User = require('../models/User');
const { sendTutorApprovalEmail, sendTutorDeclineEmail, sendStudentApprovalEmail, sendStudentDeclineEmail } = require('../services/emailService');

const getUsersByRole = async (req, res, role, status) => {
  try {
    const query = { role };
    if (status) query.status = status;
    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const approveUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role === 'tutor') {
      await sendTutorApprovalEmail(user.email, user.name);
    } else if (user.role === 'student') {
      await sendStudentApprovalEmail(user.email, user.name);
    }

    res.json({ message: `${user.role} approved successfully`, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const declineUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: 'declined' },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role === 'tutor') {
      await sendTutorDeclineEmail(user.email, user.name);
    } else if (user.role === 'student') {
      await sendStudentDeclineEmail(user.email, user.name);
    }

    res.json({ message: `${user.role} declined successfully`, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ message: 'Cannot delete admin' });

    // Clean up related data
    const StudentClass = require('../models/StudentClass');
    const Class = require('../models/Class');
    const File = require('../models/File');
    const Resource = require('../models/Resource');

    if (user.role === 'student') {
      await StudentClass.deleteMany({ studentId: user._id });
    } else if (user.role === 'tutor') {
      await Class.updateMany({ tutor: user._id }, { $unset: { tutor: '' } });
      await File.deleteMany({ uploadedBy: user._id });
      await Resource.deleteMany({ uploadedBy: user._id });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: `${user.role} deleted successfully` });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { approveUser, declineUser, getUsersByRole, deleteUser };
