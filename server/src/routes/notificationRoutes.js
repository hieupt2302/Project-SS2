const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middlewares/authMiddleware');
const { getMyNotifications, markAsRead } = require('../controllers/notificationController');
const sendDailyMealNotificationsController = require('../controllers/sendDailyMealNotificationsController');

router.get('/my-notifications', ensureAuth, getMyNotifications);
router.put('/:id/read', ensureAuth, markAsRead);

// test meal notification
router.get('/test-daily-meals', ensureAuth, async (req, res) => {
  try {
    await sendDailyMealNotifications();
    res.json({ message: '✅ Test daily meal notifications sent!' });
  } catch (err) {
    console.error('[Test Notification Error]', err);
    res.status(500).json({ error: 'Failed to send test meal notifications' });
  }
});


module.exports = router;
