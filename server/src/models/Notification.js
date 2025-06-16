const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },         // receiver
  fromUserId: { type: DataTypes.INTEGER, allowNull: false },     // sender
  recipeId: { type: DataTypes.STRING, allowNull: false },
  isDb: { type: DataTypes.BOOLEAN, defaultValue: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { timestamps: true });

Notification.associate = (models) => {
  Notification.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
  Notification.belongsTo(models.User, { as: 'fromUser', foreignKey: 'fromUserId' });
};

module.exports = { Notification };
