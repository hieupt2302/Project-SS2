const { Comment } = require('../models/Comment');
const { User } = require('../models/User');

exports.createComment = async (req, res) => {
  const { recipeId, isDb, content } = req.body;
  try {
    const comment = await Comment.create({
      recipeId,
      isDb,
      content,
      userId: req.user.id
    });
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
