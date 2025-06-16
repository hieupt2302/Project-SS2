const { WeeklyPlan } = require('../models/WeeklyPlan');
const { Notification } = require('../models/Notification');
const { User } = require('../models/User');
const { Recipe } = require('../models/Recipe');

const weekdays = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
];

const sendDailyMealNotificationsController = async () => {
  try {
    const today = new Date();
    const dayName = weekdays[today.getDay()]; // e.g., "Monday"
    console.log(`[🔍] Sending meal notifications for: ${dayName}`);

    const plans = await WeeklyPlan.findAll({ where: { day: dayName } });

    if (plans.length === 0) {
      console.log('[ℹ️] No meals scheduled for today.');
      return;
    }

    for (const plan of plans) {
      let recipeTitle = 'a meal';

      if (plan.isDb) {
        const recipe = await Recipe.findByPk(plan.recipeId);
        if (recipe) recipeTitle = recipe.title;
      } else {
        try {
          const apiRes = await fetch(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${plan.recipeId}`
          );
          const data = await apiRes.json();
          const meal = data.meals?.[0];
          recipeTitle = meal?.strMeal || `recipe #${plan.recipeId}`;
        } catch (err) {
          console.error(`Failed to fetch API recipe ${plan.recipeId}:`, err.message);
          recipeTitle = `recipe #${plan.recipeId}`;
        }
      }

      await Notification.create({
        userId: plan.userId,
        fromUserId: plan.userId,
        recipeId: plan.recipeId,
        isDb: plan.isDb,
        message: `🍽️ Today's ${plan.mealType}: ${recipeTitle}`,
        isRead: false
      });
    }


    console.log(`[🎉] All ${plans.length} notifications processed`);
  } catch (err) {
    console.error('[❌] Error in daily meal notifications job:', err.message);
  }
};

module.exports = sendDailyMealNotificationsController;
