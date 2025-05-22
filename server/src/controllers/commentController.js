const { Comment } = require('../models/associations');

exports.getReviewById = async (req, res) => {
  try {
    const review = await Comment.findByPk(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch review' });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Comment.findByPk(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    await review.destroy();
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
};