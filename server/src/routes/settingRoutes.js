const express = require('express');
const router = express.Router();
const { changePassword } = require('../controllers/settingsController');

// Chỉ user đã login mới gọi được
router.post('/change-password', changePassword);

module.exports = router;