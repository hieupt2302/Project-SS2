// server/src/controllers/Comment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { User } = require('./User');

const Comment = sequelize.define('Comment', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  recipeId: { type: DataTypes.STRING, allowNull: false }, // can be API ID or DB ID
  isDb: { type: DataTypes.BOOLEAN, defaultValue: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
}, { timestamps: true });

Comment.associate = (models) => {
  Comment.belongsTo(models.User, { foreignKey: 'userId' });
  Comment.belongsTo(models.Recipe, { foreignKey: 'recipeId', constraints: false }); // optional if recipeId is sometimes not a real FK
};
module.exports = { Comment };

