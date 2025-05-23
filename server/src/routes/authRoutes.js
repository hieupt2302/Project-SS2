// server/src/routes/authRoutes.js

const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { User } = require('../models/User');
const router = express.Router();

// Register with email
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ name, email, password: hashed });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: 'Email may already exist.' });
  }
});

// Login with email
router.post('/login', passport.authenticate('local'), (req, res) => {
  res.json(req.user);
});

// Google login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    successRedirect: `${process.env.WEBSITE_URL}/home` // You can customize this
  })
);

// VERIFY USER
router.get('/me', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not logged in' });
  res.json(req.user);
});


// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

module.exports = router;
