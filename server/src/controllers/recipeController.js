// server/src/controllers/recipeController.js
const { Recipe } = require('../models/Recipe');

exports.createRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const createdBy = req.user?.id || null;

    const newRecipe = await Recipe.create({
      title,
      ingredients,
      instructions,
      imageUrl,
      createdBy
    });

    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyRecipes = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const recipes = await Recipe.findAll({ where: { createdBy: userId } });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions } = req.body || {};

    if (!title || !ingredients || !instructions) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    if (recipe.createdBy !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    recipe.title = title;
    recipe.ingredients = ingredients;
    recipe.instructions = instructions;

    if (req.file) {
      recipe.imageUrl = `/uploads/${req.file.filename}`;
    }

    await recipe.save();

    res.json({ message: 'Recipe updated', recipe });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deleteRecipe = async (req, res) => {
  const { id } = req.params;

  try {
    const recipe = await Recipe.findByPk(id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    if (recipe.createdBy !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await recipe.destroy();
    res.json({ message: 'Recipe deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
