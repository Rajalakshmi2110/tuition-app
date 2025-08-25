const Assignment = require('../models/Assignment');
const AssignmentSubmission = require('../models/AssignmentSubmission');
const User = require('../models/User');

// Create assignment (Tutor only)
const createAssignment = async (req, res) => {
  try {
    const { title, description, subject, className, totalPoints, difficulty, dueDate, instructions } = req.body;
    
    const assignment = new Assignment({
      title,
      description,
      subject,
      className,
      tutorId: req.user.id,
      totalPoints,
      difficulty,
      dueDate,
      instructions
    });

    await assignment.save();
    res.status(201).json({ message: 'Assignment created successfully', assignment });
  } catch (error) {
    console.error('Create Assignment Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get assignments for students (by class)
const getAssignmentsForStudent = async (req, res) => {
  try {
    const student = await User.findById(req.user.id);
    
    const assignments = await Assignment.find({ 
      className: student.className,
      isActive: true 
    })
    .populate('tutorId', 'name')
    .sort({ dueDate: 1 });

    // Check submission status for each assignment
    const assignmentsWithStatus = await Promise.all(
      assignments.map(async (assignment) => {
        const submission = await AssignmentSubmission.findOne({
          assignmentId: assignment._id,
          studentId: req.user.id
        });

        return {
          ...assignment.toObject(),
          submissionStatus: submission ? submission.status : 'Not Submitted',
          isSubmitted: !!submission,
          isOverdue: new Date() > assignment.dueDate && !submission
        };
      })
    );

    res.json(assignmentsWithStatus);
  } catch (error) {
    console.error('Get Assignments Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get assignments created by tutor
const getTutorAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ tutorId: req.user.id })
      .sort({ createdAt: -1 });

    // Get submission count for each assignment
    const assignmentsWithStats = await Promise.all(
      assignments.map(async (assignment) => {
        const submissionCount = await AssignmentSubmission.countDocuments({
          assignmentId: assignment._id
        });
        
        const gradedCount = await AssignmentSubmission.countDocuments({
          assignmentId: assignment._id,
          status: 'Graded'
        });

        return {
          ...assignment.toObject(),
          submissionCount,
          gradedCount,
          pendingGrading: submissionCount - gradedCount
        };
      })
    );

    res.json(assignmentsWithStats);
  } catch (error) {
    console.error('Get Tutor Assignments Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Submit assignment (Student)
const submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { content } = req.body;

    // Check if assignment exists and is active
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment || !assignment.isActive) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if already submitted
    const existingSubmission = await AssignmentSubmission.findOne({
      assignmentId,
      studentId: req.user.id
    });

    if (existingSubmission) {
      return res.status(400).json({ message: 'Assignment already submitted' });
    }

    const submission = new AssignmentSubmission({
      assignmentId,
      studentId: req.user.id,
      content
    });

    await submission.save();
    res.status(201).json({ message: 'Assignment submitted successfully', submission });
  } catch (error) {
    console.error('Submit Assignment Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get assignment submissions (Tutor)
const getAssignmentSubmissions = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    
    // Verify tutor owns this assignment
    const assignment = await Assignment.findOne({
      _id: assignmentId,
      tutorId: req.user.id
    });

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const submissions = await AssignmentSubmission.find({ assignmentId })
      .populate('studentId', 'name email')
      .sort({ submittedAt: -1 });

    res.json({ assignment, submissions });
  } catch (error) {
    console.error('Get Submissions Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Grade assignment (Tutor)
const gradeAssignment = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { pointsEarned, feedback } = req.body;

    const submission = await AssignmentSubmission.findById(submissionId)
      .populate('assignmentId');

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Verify tutor owns this assignment
    if (submission.assignmentId.tutorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    submission.pointsEarned = pointsEarned;
    submission.feedback = feedback;
    submission.gradedAt = new Date();
    submission.gradedBy = req.user.id;
    submission.status = 'Graded';

    await submission.save();
    res.json({ message: 'Assignment graded successfully', submission });
  } catch (error) {
    console.error('Grade Assignment Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get student's assignment submissions and grades
const getStudentSubmissions = async (req, res) => {
  try {
    const submissions = await AssignmentSubmission.find({ studentId: req.user.id })
      .populate('assignmentId', 'title subject totalPoints dueDate')
      .populate('gradedBy', 'name')
      .sort({ submittedAt: -1 });

    res.json(submissions);
  } catch (error) {
    console.error('Get Student Submissions Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createAssignment,
  getAssignmentsForStudent,
  getTutorAssignments,
  submitAssignment,
  getAssignmentSubmissions,
  gradeAssignment,
  getStudentSubmissions
};