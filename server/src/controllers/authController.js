// server/src/controller/authController.js

exports.loginSuccess = (req, res) => {
  if (req.user) {
    res.status(200).json({
      message: "Login successful",
      user: req.user
    });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
};

exports.logout = (req, res) => {
  req.logout(() => {
    res.redirect('http://localhost:5173'); // or send JSON if frontend expects
  });
};
