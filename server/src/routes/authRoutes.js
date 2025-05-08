const express = require('express');
const passport = require('passport');
const router = express.Router();
const { loginSuccess, logout } = require('../controllers/authController');
const { verifyToken } = require('../middlewares/jwt');

// Start Google OAuth flow
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback after Google login
router.get('/google/callback',passport.authenticate('google', {
    failureRedirect: '/auth/failure',
    session: true,
  }),loginSuccess);
// Lấy thông tin user hiện tại
router.get('/user', (req, res) => {
  const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).json({ error: 'Invalid or expired token' });

    res.json({
        googleId: decoded.googleId,
        displayName: decoded.displayName,
        email: decoded.email
    });
});

// Optional failure route
router.get('/failure', (req, res) => res.status(401).json({ message: 'Google login failed' }));

// Logout
router.get('/logout', logout);

module.exports = router;