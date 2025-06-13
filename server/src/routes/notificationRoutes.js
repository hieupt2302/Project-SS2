const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middlewares/authMiddleware');
const { getMyNotifications, markAsRead } = require('../controllers/notificationController');

router.get('/my-notifications', ensureAuth, getMyNotifications);
router.put('/:id/read', ensureAuth, markAsRead);

module.exports = router;