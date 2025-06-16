const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ViewedHistory = sequelize.define('ViewedHistory', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  recipeId: { type: DataTypes.STRING, allowNull: false },
  isDb: { type: DataTypes.BOOLEAN, defaultValue: false },
  viewedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  timestamps: false
});

ViewedHistory.associate = (models) => {
  ViewedHistory.belongsTo(models.User, { foreignKey: 'userId' });
};

module.exports = { ViewedHistory };