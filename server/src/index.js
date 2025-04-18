const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/database');
require('./config/passport')(passport);

const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // Chỉ cho phép yêu cầu từ http://localhost:5173
  methods: 'GET,POST,PUT,DELETE',
  credentials: true, // Cho phép cookie được gửi trong yêu cầu từ client
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);

sequelize.sync().then(() => {
  app.listen(process.env.BE_PORT, () => console.log('Server started at http://localhost:5000'));
});