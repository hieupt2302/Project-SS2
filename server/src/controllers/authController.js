const { generateToken } = require("../middlewares/jwt");
const loginSuccess = (req, res) => {
  const token = generateToken(req.user);

        // Set JWT cookie (httpOnly)
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: false, // true if using HTTPS
    sameSite: 'lax',
    maxAge: 60 * 60 * 1000 // 1 hour
    });
  console.log('JWT:', token);
  res.redirect('http://localhost:5173/settings'); // Redirect to settings page after login
};
  
const logout = (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.json({ message: 'Logged out' });
  });
};
  
module.exports = { loginSuccess, logout };