const { Recipe } = require('../models/Recipe');

exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.recipeID);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving recipe', error: err.message });
  }
};

exports.getAllRecipes = async (req, res) => {
    try {
      const recipes = await Recipe.findAll();  // Lấy tất cả recipes
      res.json(recipes);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching recipes', error: err.message });
    }
};

exports.createRecipe = async (req, res) => {
  try {
    const { name, ingredients, instructions } = req.body;
    const newRecipe = await Recipe.create({
      name,
      ingredients,
      instructions,
      authorID: req.user.id
    });
    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(500).json({ message: 'Error creating recipe', error: err.message });
  }
};