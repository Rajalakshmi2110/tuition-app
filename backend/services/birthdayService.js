const User = require('../models/User');
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

module.exports = { checkBirthdays };
