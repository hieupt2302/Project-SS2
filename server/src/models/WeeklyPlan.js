// models/WeeklyPlan.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WeeklyPlan = sequelize.define('WeeklyPlan', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  day: { type: DataTypes.STRING, allowNull: false },      // "Monday", "Tuesday", etc.
  mealType: { type: DataTypes.STRING, allowNull: false }, // "Breakfast", "Lunch", "Dinner"
  recipeId: { type: DataTypes.STRING, allowNull: false },
  isDb: { type: DataTypes.BOOLEAN, defaultValue: false }
});

module.exports = { WeeklyPlan };
