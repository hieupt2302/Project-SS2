// models/Favorite.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Favorite = sequelize.define('Favorite', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  recipeId: { type: DataTypes.STRING, allowNull: false },
  isDb: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { timestamps: false });  // I don’t want createdAt or updatedAt in mySQL

module.exports = { Favorite };
