const db = require('../db/database');

const notificationController = {
  getUserNotifications(req, res) {
    try {
      const userId = req.user.id;
      const notifications = db.all(
        `SELECT n.*, i.title as issue_title, i.priority as issue_priority, i.status as issue_status
         FROM notifications n
         LEFT JOIN issues i ON n.issue_id = i.id
         WHERE n.user_id = ?
         ORDER BY n.created_at DESC LIMIT 50`,
        [userId]
      );

      const unreadCount = db.get(
        'SELECT count(*) as count FROM notifications WHERE user_id = ? AND is_read = 0',
        [userId]
      );

      res.json({
        notifications,
        unreadCount: unreadCount ? unreadCount.count : 0
      });
    } catch (err) {
      console.error('getUserNotifications error:', err);
      res.status(500).json({ error: 'Failed to fetch notifications.' });
    }
  },

  markAsRead(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      if (id === 'all') {
        db.run('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [userId]);
      } else {
        db.run('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?', [id, userId]);
      }

      res.json({ success: true });
    } catch (err) {
      console.error('markAsRead error:', err);
      res.status(500).json({ error: 'Failed to mark notifications read.' });
    }
  }
};

module.exports = notificationController;
