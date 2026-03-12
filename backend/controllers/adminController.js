const User = require('../models/User');
const { sendTutorApprovalEmail, sendTutorDeclineEmail, sendStudentApprovalEmail, sendStudentDeclineEmail } = require('../services/emailService');
const { createNotification } = require('../services/notificationService');

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

    await createNotification(user._id, 'account_approved', 'Account Approved', `Your ${user.role} account has been approved. Welcome to Kalviyagam!`, `/${user.role}`);

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

    await createNotification(user._id, 'account_declined', 'Account Declined', `Your ${user.role} application was declined. Contact support for details.`);

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
    const Assignment = require('../models/Assignment');
    const AssignmentSubmission = require('../models/AssignmentSubmission');
    const Payment = require('../models/Payment');
    const StudentPerformance = require('../models/StudentPerformance');
    const UserStats = require('../models/UserStats');
    const UserBadge = require('../models/UserBadge');

    if (user.role === 'student') {
      await StudentClass.deleteMany({ studentId: user._id });
      await AssignmentSubmission.deleteMany({ studentId: user._id });
      await Payment.deleteMany({ studentId: user._id });
      await StudentPerformance.deleteMany({ studentId: user._id });
    } else if (user.role === 'tutor') {
      await Class.updateMany({ tutor: user._id }, { $unset: { tutor: '' } });
      const tutorAssignments = await Assignment.find({ tutorId: user._id }).select('_id');
      const assignmentIds = tutorAssignments.map(a => a._id);
      await AssignmentSubmission.deleteMany({ assignmentId: { $in: assignmentIds } });
      await Assignment.deleteMany({ tutorId: user._id });
    }

    // Clean up gamification data for any role
    await UserStats.deleteMany({ userId: user._id });
    await UserBadge.deleteMany({ userId: user._id });

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: `${user.role} deleted successfully` });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { approveUser, declineUser, getUsersByRole, deleteUser };
