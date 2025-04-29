const loginSuccess = (req, res) => {
  if (req.user) {
    console.log('User logged in:', req.user);
    res.status(200).json({
      user: req.user // Trả về thông tin người dùng
    });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
};
  
const logout = (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.json({ message: 'Logged out' });
  });
};
  
module.exports = { loginSuccess, logout };