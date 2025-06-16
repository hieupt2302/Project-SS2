const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const cron = require('node-cron');
require('dotenv').config();
require('./models/initAssociations');

require('./config/passport');

const sequelize = require('./config/database');
const sendDailyMealNotificationsController = require('./controllers/sendDailyMealNotificationsController');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const settingRoutes = require('./routes/settingRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const commentRoutes = require('./routes/commentRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const weeklyPlanRoutes = require('./routes/weeklyPlanRoutes');
const viewedHistory = require('./routes/historyRoutes');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.urlencoded({ extended: true })); // <-- THÊM DÒNG NÀY
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // true nếu dùng HTTPS
    httpOnly: true
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/uploads', express.static('public/uploads'));
app.use('/api/comments', commentRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/weekly-plan', weeklyPlanRoutes);
app.use('/api/history', viewedHistory);


sequelize.sync().then(() => {
  app.listen(5000, () => console.log('Server started at http://localhost:5000'));

  // Run every day at 7:00 AM
  // Run every day at 13:19 PM is 20 13 * * *
  cron.schedule('0 7 * * *', () => {
    console.log('[🕖] Running daily meal plan notifications...');
    sendDailyMealNotificationsController();
  });
});
