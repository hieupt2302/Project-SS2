// server/src/models/initAssociations.js (create this file if needed)
const { User } = require('./User');
const { Recipe } = require('./Recipe');
const { Comment } = require('./Comment');
const { Notification } = require('./Notification');

User.associate?.({ Comment, Notification });
Recipe.associate?.({ Comment });
Comment.associate?.({ User, Recipe });
Notification.associate?.({ User });