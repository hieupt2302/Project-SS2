const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Recipe = sequelize.define('Recipes', {
  RecipeID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  authorID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  author_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cook_time: {
    type: DataTypes.STRING,
  },
  prep_time: {
    type: DataTypes.STRING,
  },
  total_time: {
    type: DataTypes.STRING,
  },
  Images: {
    type: DataTypes.TEXT, // có thể là URL hoặc base64 nếu bạn lưu ảnh dạng chuỗi
  },
  RecipeCategory: {
    type: DataTypes.STRING,
  },
  RecipeIngredientQuantities: {
    type: DataTypes.TEXT, // có thể là JSON dạng chuỗi nếu chứa mảng/phức tạp
  },
  RecipeIngredientParts: {
    type: DataTypes.TEXT,
  },
  AggregatedRating: {
    type: DataTypes.FLOAT,
  },
  Calories: {
    type: DataTypes.FLOAT,
  },
  FatContent: {
    type: DataTypes.FLOAT,
  },
  FiberContent: {
    type: DataTypes.FLOAT,
  },
  SugarContent: {
    type: DataTypes.FLOAT,
  },
  ProteinContent: {
    type: DataTypes.FLOAT,
  },
  RecipeInstructions: {
    type: DataTypes.TEXT, // nếu bạn có nhiều bước thì có thể lưu JSON chuỗi hoặc markdown
  },
}, {
  timestamps: true, // nếu bạn muốn lưu createdAt và updatedAt
});

module.exports = { Recipe };
