// server/src/routes/authRoutes.js

const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { User } = require('../models/User');
const { ensureAuth } = require('../middlewares/authMiddleware');
const router = express.Router();

// Register with email
// Check if email already exists
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashed });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});


// Login with email
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info.message || 'Login failed' });

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.status(200).json({ message: 'Login successful', user });
    });
  })(req, res, next);
});

// Google login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Nếu là admin thì luôn về /home, nếu là user thì kiểm tra password
    if (req.user && req.user.role === 'admin') {
      res.redirect(`${process.env.WEBSITE_URL}/home`);
    } else if (req.user && req.user.password) {
      res.redirect(`${process.env.WEBSITE_URL}/home`);
    } else {
      res.redirect(`${process.env.WEBSITE_URL}/user-dashboard`);
    }
  }
);

// VERIFY USER
router.get('/me', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not logged in' });
  res.json(req.user);
});

// CHANGE PASSWORD FOR USERS (google sign in can change too)
router.post('/change-password', ensureAuth, async (req, res) => {
  const { password } = req.body;
  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }
  try {
    const hashed = await bcrypt.hash(password, 10);
    await User.update(
      { password: hashed },
      { where: { id: req.user.id } }
    );
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update password' });
  }
});


// Logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ error: 'Session destroy failed' });
      res.clearCookie('connect.sid'); // Optional: clears session cookie
      res.json({ message: 'Logged out' });
    });
  });
});

module.exports = router;
