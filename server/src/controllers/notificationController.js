const db = require('../config/database'); 

exports.getNotifications = async (req, res) => {
  const userId = req.user.id;

  const notiList = await db.Notifications.findAll({
    where: { user_id: userId },
    order: [['created_at', 'DESC']],
  });

  res.json(notiList);
};
