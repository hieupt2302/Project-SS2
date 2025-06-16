const { WeeklyPlan } = require('../models/WeeklyPlan');

// GET: Get user's full weekly plan
exports.getPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const plans = await WeeklyPlan.findAll({ where: { userId } });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST: Add meal to plan
exports.addToPlan = async (req, res) => {
  const { day, mealType, recipeId, isDb } = req.body;
  const userId = req.user.id;

  try {
    const existing = await WeeklyPlan.findOne({ where: { userId, day, mealType } });
    if (existing) await existing.destroy(); // Replace if already exists

    const newEntry = await WeeklyPlan.create({ userId, day, mealType, recipeId, isDb });
    res.json({ message: 'Added to plan', plan: newEntry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE: Remove meal from plan
exports.removeFromPlan = async (req, res) => {
  const { day, mealType } = req.body;
  const userId = req.user.id;

  try {
    await WeeklyPlan.destroy({ where: { userId, day, mealType } });
    res.json({ message: 'Removed from plan' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
