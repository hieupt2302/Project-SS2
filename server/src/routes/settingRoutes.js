const express = require('express');
const router = express.Router();
const { changePassword } = require('../controllers/settingsController');
const { ensureAuth } = require('../middlewares/authMiddleware');

router.post('/change-password', ensureAuth, changePassword);

module.exports = router;