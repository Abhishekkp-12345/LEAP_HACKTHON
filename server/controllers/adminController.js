const db = require('../db/database');
const { getDashboardMetrics } = require('../services/analyticsService');
const { checkAndEscalateIssues } = require('../services/escalationService');

const adminController = {
  getAnalytics(req, res) {
    try {
      const { wardId, category, departmentId, priority } = req.query;
      const metrics = getDashboardMetrics({ wardId, category, departmentId, priority });
      res.json(metrics);
    } catch (err) {
      console.error('getAnalytics error:', err);
      res.status(500).json({ error: 'Failed to compute analytics.' });
    }
  },

  triggerEscalationCheck(req, res) {
    try {
      const result = checkAndEscalateIssues();
      res.json({
        message: `Escalation check complete. Evaluated ${result.totalChecked} overdue issues, escalated ${result.escalatedCount}.`,
        result
      });
    } catch (err) {
      console.error('triggerEscalationCheck error:', err);
      res.status(500).json({ error: 'Failed to execute escalation scan.' });
    }
  },

  getRecurringAnalysis(req, res) {
    try {
      const recurringAssets = db.all(
        `SELECT 
           a.*,
           w.name as ward_name,
           d.name as department_name,
           (SELECT count(*) FROM issues WHERE asset_id = a.id) as total_life_issues,
           (SELECT count(*) FROM issues WHERE asset_id = a.id AND datetime(created_at) >= datetime('now', '-60 days')) as recent_failures,
           (SELECT max(created_at) FROM issues WHERE asset_id = a.id) as last_failure_date
         FROM assets a
         JOIN wards w ON a.ward_id = w.id
         JOIN departments d ON a.department_id = d.id
         WHERE a.failure_count >= 2 OR a.is_recurring_flag = 1
         ORDER BY a.failure_count DESC, a.is_recurring_flag DESC`
      );

      res.json(recurringAssets);
    } catch (err) {
      console.error('getRecurringAnalysis error:', err);
      res.status(500).json({ error: 'Failed to fetch recurring asset analysis.' });
    }
  },

  getWardsAndDepartments(req, res) {
    try {
      const wards = db.all('SELECT * FROM wards ORDER BY ward_number ASC');
      const departments = db.all('SELECT * FROM departments ORDER BY name ASC');
      const staff = db.all("SELECT id, name, email, phone, designation, role, ward_id FROM users WHERE role = 'FIELD_STAFF' AND is_active = 1");
      res.json({ wards, departments, staff });
    } catch (err) {
      console.error('getWardsAndDepartments error:', err);
      res.status(500).json({ error: 'Failed to fetch metadata.' });
    }
  },

  getConfig(req, res) {
    try {
      const configs = db.all('SELECT * FROM system_config');
      const departments = db.all('SELECT * FROM departments');
      res.json({ configs, departments });
    } catch (err) {
      console.error('getConfig error:', err);
      res.status(500).json({ error: 'Failed to fetch system configurations.' });
    }
  },

  updateConfig(req, res) {
    try {
      const { configs = [], departmentSlas = [] } = req.body;

      db.transaction(() => {
        for (const item of configs) {
          if (item.key && item.value !== undefined) {
            db.run(
              `INSERT OR REPLACE INTO system_config (key, value, description, updated_at)
               VALUES (?, ?, (SELECT description FROM system_config WHERE key = ?), datetime('now'))`,
              [item.key, item.value.toString(), item.key]
            );
          }
        }

        for (const dept of departmentSlas) {
          if (dept.id) {
            db.run(
              `UPDATE departments 
               SET sla_hours_critical = ?, sla_hours_high = ?, sla_hours_medium = ?, sla_hours_low = ?
               WHERE id = ?`,
              [dept.sla_hours_critical, dept.sla_hours_high, dept.sla_hours_medium, dept.sla_hours_low, dept.id]
            );
          }
        }
      });

      res.json({ success: true, message: 'Configuration and SLA rules updated successfully.' });
    } catch (err) {
      console.error('updateConfig error:', err);
      res.status(500).json({ error: 'Failed to update system config.' });
    }
  }
};

module.exports = adminController;
