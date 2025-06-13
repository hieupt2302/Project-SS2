// server/src/routes/favoriteRoutes.js
const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const { ensureAuth } = require('../middlewares/authMiddleware');

router.post('/toggle', ensureAuth, favoriteController.toggleFavorite);
router.get('/my-favorites', ensureAuth, favoriteController.getUserFavorites);

module.exports = router;

