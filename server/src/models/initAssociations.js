// server/src/models/initAssociations.js (create this file if needed)
const { User } = require('./User');
const { Recipe } = require('./Recipe');
const { Comment } = require('./Comment');

User.associate?.({ Comment });
Recipe.associate?.({ Comment });
Comment.associate?.({ User, Recipe });