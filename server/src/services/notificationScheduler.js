const cron = require('node-cron');
const db = require('../config/database');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');

const WEEKDAY_MAP = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

const TIME_SLOT_HOUR = {
  Breakfast: 8,
  Lunch: 12,
  Dinner: 18,
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your_email@gmail.com',
    pass: 'your_app_password',
  },
});

cron.schedule('*/5 * * * *', async () => {
  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday
  const currentHour = now.getHours();

  const matchedPlans = await db.WeeklyMealPlans.findAll({
    where: {
      meal_day: {
        [Op.eq]: Object.keys(WEEKDAY_MAP).find(day => WEEKDAY_MAP[day] === currentDay)
      },
      meal_time: {
        [Op.in]: Object.keys(TIME_SLOT_HOUR).filter(slot => TIME_SLOT_HOUR[slot] === currentHour)
      }
    },
    include: [{ model: db.User }, { model: db.Recipe }]
  });

  for (const plan of matchedPlans) {
    const user = plan.User;
    const recipe = plan.Recipe;

    const message = `It's time for your meal: ${recipe.name} (${plan.meal_time})`;

    // In-App Notification
    await db.Notifications.create({
      user_id: user.id,
      message: message
    });

    // Email
    await transporter.sendMail({
      from: '"Recipe Master" <your_email@gmail.com>',
      to: user.email,
      subject: `Meal Reminder: ${recipe.name}`,
      text: message,
    });

    console.log(`Sent notification to ${user.email}`);
  }
});
