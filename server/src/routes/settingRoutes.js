const express = require('express');
const router = express.Router();
const { changePassword } = require('../controllers/settingsController');
const isAuthenticated = require('../middlewares/authMiddleware');

router.post('/change-password', isAuthenticated, changePassword);

module.exports = router;