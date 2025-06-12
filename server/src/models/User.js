const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING },
  googleId: { type: DataTypes.STRING, unique: true },
  role: { type: DataTypes.ENUM('user', 'admin'), defaultValue: 'user' },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  timestamps: false // nếu không dùng updatedAt
});

// relationship with comments from users
User.associate = (models) => {
  User.hasMany(models.Comment, { foreignKey: 'userId' });
};

module.exports = { User };