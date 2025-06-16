const { User } = require('../models/User');

exports.changePassword = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user.id;
    await User.update({ password }, { where: { id: userId } });
    res.json({ message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
