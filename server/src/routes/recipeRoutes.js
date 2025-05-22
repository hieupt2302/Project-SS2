const express = require('express');
const router = express.Router();
const { getAllRecipes, getRecipeById, createRecipe, updateRecipe,  getFavouriteRecipes } = require('../controllers/recipeController');

router.get('/', getAllRecipes);     // Lấy recipe của user hiện tại
router.post('/', createRecipe);          // Tạo recipe mới
router.get('/:recipeID', getRecipeById); 
router.put('/:recipeID', updateRecipe);
router.get('/favourites', getFavouriteRecipes);

module.exports = router;