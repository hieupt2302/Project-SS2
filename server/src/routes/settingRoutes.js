const express = require('express');
const router = express.Router();
const { changePassword } = require('../controllers/settingsController');
const isAuthenticated = require('../middlewares/isAuthenticated');

// Chỉ user đã login mới gọi được
router.post('/change-password', isAuthenticated, changePassword);

module.exports = router;