const User = require('../models/User');
const { sendTutorApprovalEmail, sendTutorDeclineEmail } = require('../services/emailService');

const getUsersByRole = async (req, res, role, status) => {
  try {
    const query = { role };
    if (status) query.status = status;
    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const approveTutor = async (req, res) => {
  try {
    const updatedTutor = await User.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    if (!updatedTutor) return res.status(404).json({ message: 'Tutor not found' });
    
    // Send approval email
    await sendTutorApprovalEmail(updatedTutor.email, updatedTutor.name);
    
    res.json({ message: 'Tutor approved successfully', tutor: updatedTutor });
  } catch (err) {
    console.error('Error approving tutor:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const declineTutor = async (req, res) => {
  try {
    const updatedTutor = await User.findByIdAndUpdate(
      req.params.id,
      { status: 'declined' },
      { new: true }
    );
    if (!updatedTutor) return res.status(404).json({ message: 'Tutor not found' });
    
    // Send decline email
    await sendTutorDeclineEmail(updatedTutor.email, updatedTutor.name);
    
    res.json({ message: 'Tutor declined successfully', tutor: updatedTutor });
  } catch (err) {
    console.error('Error declining tutor:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { approveTutor, declineTutor, getUsersByRole };
