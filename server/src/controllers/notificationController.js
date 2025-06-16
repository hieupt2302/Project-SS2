const { Notification } = require('../models/Notification');
const { User } = require('../models/User');

exports.getMyNotifications = async (req, res) => {
  try {
    // console.log('[User in Notification]', req.user); // <-- add this
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      include: [{ model: User, as: 'fromUser', attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']]
    });

    res.json(notifications);
  } catch (err) {
    // console.error('[Notification Error]', err);
    res.status(500).json({ error: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notif = await Notification.findByPk(req.params.id);
    if (notif && notif.userId === req.user.id) {
      notif.isRead = true;
      await notif.save();
      res.json({ success: true });
    } else {
      res.status(403).json({ error: 'Forbidden' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
