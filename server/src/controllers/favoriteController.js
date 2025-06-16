// controllers/favoriteController.js
const { Favorite } = require('../models/Favorite');

exports.toggleFavorite = async (req, res) => {
  const { recipeId, isDb } = req.body;
  const userId = req.user.id;

  try {
    const existing = await Favorite.findOne({ where: { userId, recipeId, isDb } });

    if (existing) {
      await existing.destroy();
      return res.json({ status: 'removed' });
    }

    const newFav = await Favorite.create({ userId, recipeId, isDb });
    res.json({ status: 'added', favorite: newFav });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.findAll({ where: { userId: req.user.id } });
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
