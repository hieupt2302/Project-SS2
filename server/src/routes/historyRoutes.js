const ViewedRecipe = require('../models/ViewedRecipe');
const express = require('express');
const router = express.Router();
const ViewedRecipe = require('../models/ViewedRecipe');
const Recipe = require('../models/Recipe');
router.get('/:id', async (req, res) => {
  const recipeId = req.params.id;
  const userId = req.user?.id; 
  if (userId) {
    await ViewedRecipe.create({ userId, recipeId });
  }

  res.json(recipe);
});



router.get('/viewed', async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Not authenticated' });

  const history = await ViewedRecipe.findAll({
    where: { userId },
    include: [{ model: Recipe }],
    order: [['viewedAt', 'DESC']]
  });

  res.json(history);
});

module.exports = router;