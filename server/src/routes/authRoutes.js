const express = require('express');
const passport = require('passport');
const router = express.Router();
const { loginSuccess, logout } = require('../controllers/authController');

// Start Google OAuth flow
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback after Google login
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/auth/failure',
  session: true
}), loginSuccess);

// Optional failure route
router.get('/failure', (req, res) => res.status(401).json({ message: 'Google login failed' }));

// Logout
router.get('/logout', logout);

module.exports = router;