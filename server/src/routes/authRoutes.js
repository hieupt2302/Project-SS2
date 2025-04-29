const express = require('express');
const passport = require('passport');
const router = express.Router();
const { loginSuccess, logout } = require('../controllers/authController');

// Start Google OAuth flow
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback after Google login
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/failure',
    session: true,
  }),
  (req, res) => {
    console.log('Đăng nhập thành công, user:', req.user); // ✅ Có user tại đây
    console.log('Session:', req.session.passport); // ✅ Có passport: { user: id }
    res.redirect('http://localhost:5173/settings'); // FE sẽ fetch /auth/user sau
  });
// Lấy thông tin user hiện tại
router.get('/user', (req, res) => {
  console.log('Session:', req.session.passport);
  // console.log('User:', req.passport.user);
  if (req.user) {
    const { id, name, email, role, googleId } = req.user;
    res.json({ id, name, email, role, googleId });
  } else {
    res.status(401).json({ message: 'Not authenticated', session: req.session, user: req.user });
  }
});

// Optional failure route
router.get('/failure', (req, res) => res.status(401).json({ message: 'Google login failed' }));

// Logout
router.get('/logout', logout);

module.exports = router;