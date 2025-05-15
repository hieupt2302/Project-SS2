const express = require('express');
const router = express.Router();
const controller = require('../controllers/notificationController');
const auth = require('../middlewares/jwt'); // nếu có xác thực

router.get('/', auth.verifyToken, controller.getNotifications);

module.exports = router;
