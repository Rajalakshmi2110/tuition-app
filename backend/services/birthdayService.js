const User = require('../models/User');
const ExamSchedule = require('../models/ExamSchedule');
const { createNotification, notifyByRole } = require('./notificationService');

const checkBirthdays = async () => {
  try {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    const birthdayUsers = await User.find({
      dateOfBirth: { $ne: null },
      status: 'approved'
    });

    for (const user of birthdayUsers) {
      const dob = new Date(user.dateOfBirth);
      if (dob.getMonth() + 1 === month && dob.getDate() === day) {
        // Wish the birthday person
        await createNotification(
          user._id,
          'birthday',
          '🎂 Happy Birthday!',
          `Wishing you a wonderful birthday, ${user.name}! Have a great day!`,
          `/${user.role}`
        );

        // Notify others
        if (user.role === 'tutor') {
          await notifyByRole('student', 'birthday', '🎉 Birthday Celebration',
            `Today is ${user.name} (Tutor)'s birthday! Wish them a happy birthday! 🎂`,
            '/student');
          await notifyByRole('tutor', 'birthday', '🎉 Birthday Celebration',
            `Today is ${user.name}'s birthday! Wish them a happy birthday! 🎂`,
            '/tutor');
          await notifyByRole('admin', 'birthday', '🎉 Birthday Celebration',
            `Today is ${user.name} (Tutor)'s birthday!`,
            '/admin');
        } else if (user.role === 'student') {
          await notifyByRole('tutor', 'birthday', '🎉 Birthday Celebration',
            `Today is ${user.name} (Student, Class ${user.className})'s birthday! 🎂`,
            '/tutor');
          await notifyByRole('student', 'birthday', '🎉 Birthday Celebration',
            `Today is ${user.name}'s birthday! Wish them! 🎂`,
            '/student');
          await notifyByRole('admin', 'birthday', '🎉 Birthday Celebration',
            `Today is ${user.name} (Student)'s birthday!`,
            '/admin');
        }
      }
    }
  } catch (err) {
    console.error('Birthday check failed:', err.message);
  }
};

const checkExamReminders = async () => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const startOfTomorrow = new Date(tomorrow.setHours(0, 0, 0, 0));
    const endOfTomorrow = new Date(tomorrow.setHours(23, 59, 59, 999));

    const exams = await ExamSchedule.find({
      examDate: { $gte: startOfTomorrow, $lte: endOfTomorrow },
      reminded: false
    }).populate('studentId', 'name className');

    for (const exam of exams) {
      await createNotification(
        exam.studentId._id,
        'exam_reminder',
        '📝 Exam Tomorrow!',
        `You have ${exam.examType} for ${exam.subject} tomorrow at ${exam.examTime}. All the best!`,
        '/student'
      );
      exam.reminded = true;
      await exam.save();
    }
  } catch (err) {
    console.error('Exam reminder check failed:', err.message);
  }
};

module.exports = { checkBirthdays, checkExamReminders };
