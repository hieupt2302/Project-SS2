const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middlewares/authMiddleware');
const { createComment, getCommentsByRecipe } = require('../controllers/commentController');

router.post('/', ensureAuth, createComment);
router.get('/:recipeId', getCommentsByRecipe);

module.exports = router;

