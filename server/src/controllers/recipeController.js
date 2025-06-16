// server/src/controllers/recipeController.js
const { Recipe } = require('../models/Recipe');
const { User } = require('../models/User');

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

    // ✅ Allow either creator OR admin
    if (recipe.createdBy !== req.user.id && req.user.role !== 'admin') {
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
    // console.log('req.user:', req.user);
    const recipe = await Recipe.findByPk(id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    // ✅ Allow either creator or admin
    if (recipe.createdBy !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await recipe.destroy();
    res.json({ message: 'Recipe deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// for admin
exports.getAllRecipesWithUsers = async (req, res) => {
  try {
    const recipes = await Recipe.findAll({
      include: {
        model: User,
        attributes: ['id', 'name', 'email'],
      },
      order: [['createdAt', 'DESC']],
    });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};