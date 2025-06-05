const { Users } = require('./User');
const { Recipe } = require('./Recipe');
const { Comment } = require('./comment');
const { WeeklyMealPlan } = require('./WeeklyMealPlan');
const ViewedRecipe = require('./ViewedRecipe');

// Comment relations
Users.hasMany(Comment, { foreignKey: 'user_id' });
Recipe.hasMany(Comment, { foreignKey: 'recipe_id' });
Comment.belongsTo(Users, { foreignKey: 'user_id' });
Comment.belongsTo(Recipe, { foreignKey: 'recipe_id' });

// WeeklyMealPlan relations
Users.hasMany(WeeklyMealPlan, { foreignKey: 'user_id' });
Recipe.hasMany(WeeklyMealPlan, { foreignKey: 'recipe_id' });
WeeklyMealPlan.belongsTo(Users, { foreignKey: 'user_id' });
WeeklyMealPlan.belongsTo(Recipe, { foreignKey: 'recipe_id' });

Users.hasMany(ViewedRecipe, { foreignKey: 'userId' });
ViewedRecipe.belongsTo(Users, { foreignKey: 'userId' });
Recipe.hasMany(ViewedRecipe, { foreignKey: 'recipeId' });
ViewedRecipe.belongsTo(Recipe, { foreignKey: 'recipeId' });

module.exports = {
  Users,
  Recipe,
  Comment,
  WeeklyMealPlan,
};
