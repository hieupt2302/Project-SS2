const { Users } = require('../models/User');
const { Recipe } = require('../models/Recipe');

// Define associations
Users.hasMany(Recipe, { foreignKey: 'authorID' });
Recipe.belongsTo(Users, { foreignKey: 'authorID' });

module.exports = { Users, Recipe };