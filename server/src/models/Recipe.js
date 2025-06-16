// server/src/controllers/Recipe.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Recipe = sequelize.define('Recipe', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  ingredients: { type: DataTypes.TEXT, allowNull: false },
  instructions: { type: DataTypes.TEXT, allowNull: false },
  imageUrl: { type: DataTypes.STRING },
  createdBy: { type: DataTypes.INTEGER } // FK to User.id
}, {
  timestamps: true
});

// relationship with other users' recipes
const { User } = require('./User');

Recipe.belongsTo(User, { foreignKey: 'createdBy' });
User.hasMany(Recipe, { foreignKey: 'createdBy' });

// relationship with comments
Recipe.associate = (models) => {
  Recipe.hasMany(models.Comment, { foreignKey: 'recipeId' });
};

module.exports = { Recipe };
