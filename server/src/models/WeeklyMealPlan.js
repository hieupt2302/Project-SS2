const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WeeklyMealPlan = sequelize.define('WeeklyMealPlans', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  recipe_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  meal_day: {
    type: DataTypes.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
    allowNull: false,
  },
  meal_time: {
    type: DataTypes.ENUM('Breakfast', 'Lunch', 'Dinner'),
    allowNull: false,
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false,
});

module.exports = { WeeklyMealPlan };
