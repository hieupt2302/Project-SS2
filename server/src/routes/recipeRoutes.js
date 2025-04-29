const express = require('express');
const router = express.Router();
const { getAllRecipes, getRecipeById, createRecipe } = require('../controllers/recipeController');

router.get('/', getAllRecipes);     // Lấy recipe của user hiện tại
router.post('/', createRecipe);          // Tạo recipe mới
router.get('/:recipeID', getRecipeById); 

module.exports = router;