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
