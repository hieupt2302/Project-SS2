const { Comment } = require('../models/Comment');
const { User } = require('../models/User');
const { Recipe } = require('../models/Recipe');
const { Notification } = require('../models/Notification');

exports.createComment = async (req, res) => {
  const { recipeId, isDb, content } = req.body;
  try {
    const comment = await Comment.create({
      recipeId, isDb, content, userId: req.user.id
    });

    // Notify the recipe owner (if DB recipe)
    if (isDb) {
      const recipe = await Recipe.findByPk(recipeId);
      if (recipe && recipe.createdBy !== req.user.id) {
        await Notification.create({
          userId: recipe.createdBy,
          fromUserId: req.user.id,
          recipeId,
          isDb,
          message: `commented on your recipe: "${content.slice(0, 30)}..."`,
        });
      }
    }

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCommentsByRecipe = async (req, res) => {
  const { recipeId } = req.params;
  const isDb = req.query.isDb === 'true';
  try {
    const comments = await Comment.findAll({
      where: { recipeId, isDb },
      include: { model: User, attributes: ['id', 'name'] },
      order: [['createdAt', 'DESC']]
    });
    res.json(comments);
  } catch (err) {
    console.error('[COMMENTS ERROR]', err);
    res.status(500).json({ error: err.message });
  }
};
