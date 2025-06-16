const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middlewares/authMiddleware');
const { ViewedHistory } = require('../models/ViewedHistory');

// Lưu lịch sử xem
router.post('/viewed', ensureAuth, async (req, res) => {
  const { recipeId, isDb } = req.body;
  try {
    // Tìm xem đã có lịch sử chưa
    const [history, created] = await ViewedHistory.findOrCreate({
      where: { userId: req.user.id, recipeId, isDb },
      defaults: { viewedAt: new Date() }
    });
    if (!created) {
      // Nếu đã có, cập nhật thời gian xem mới nhất
      history.viewedAt = new Date();
      await history.save();
    }
    res.json({ message: 'Viewed history saved' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save history', error: err.message });
  }
});

// Lấy lịch sử xem
router.get('/viewed', ensureAuth, async (req, res) => {
  try {
    const history = await ViewedHistory.findAll({
      where: { userId: req.user.id },
      order: [['viewedAt', 'DESC']],
      limit: 50 // lấy 50 lịch sử gần nhất
    });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch history' });
  }
});

module.exports = router;