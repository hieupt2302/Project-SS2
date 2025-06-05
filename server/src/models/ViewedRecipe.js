const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Users = require('./User').Users;
const Recipe = require('./Recipe'); // Giả sử bạn đã có model Recipe

const ViewedRecipe = sequelize.define('ViewedRecipe', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  recipeId: { type: DataTypes.INTEGER, allowNull: false },
  viewedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = ViewedRecipe;