const bcrypt = require('bcrypt');
const { Users } = require('../models/User');

const changeNameAndPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const { name } = req.body; // Lấy tên từ body của yêu cầu
    if (!newPassword) return res.status(400).json({ message: 'New password required' });
    if (!name) return res.status(400).json({ message: 'Name required' }); // Kiểm tra tên có tồn tại không
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    req.user.name = name; // Cập nhật tên người dùng
    await req.user.save();
    req.user.password = hashedPassword;
    await req.user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { changePassword };