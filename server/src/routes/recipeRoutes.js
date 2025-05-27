// server/src/routes/recipeRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { createRecipe, getMyRecipes, updateRecipe, deleteRecipe, getAllRecipesWithUsers } = require('../controllers/recipeController');
const { ensureAuth } = require('../middlewares/authMiddleware');
const { Recipe } = require('../models/Recipe');

// Multer config for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

router.post('/', upload.single('image'), createRecipe);
router.put('/:id', ensureAuth, upload.single('image'), updateRecipe);
router.delete('/:id', ensureAuth, deleteRecipe);
router.get('/user/:id', ensureAuth, async (req, res) => {
  const recipes = await Recipe.findAll({ where: { createdBy: req.params.id } });
  res.json(recipes);
});
router.get('/all', ensureAuth, getAllRecipesWithUsers); 
router.get('/mine', ensureAuth, getMyRecipes);

module.exports = router;
