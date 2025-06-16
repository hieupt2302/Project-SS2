// server/src/models/initAssociations.js (create this file if needed)
const { User } = require('./User');
const { Recipe } = require('./Recipe');
const { Comment } = require('./Comment');
const { Notification } = require('./Notification');
const { ViewedHistory } = require('./ViewedHistory');

User.associate?.({ Comment, Notification, ViewedHistory });
Recipe.associate?.({ Comment, ViewedHistory });
Comment.associate?.({ User, Recipe });
Notification.associate?.({ User });
ViewedHistory.associate?.({User, Recipe});
