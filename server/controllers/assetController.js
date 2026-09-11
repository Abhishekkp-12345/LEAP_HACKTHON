const db = require('../db/database');

const assetController = {
  getAssets(req, res) {
    try {
      const { wardId, assetType, status, isRecurring, search } = req.query;
      let where = ['1=1'];
      let params = [];

      if (wardId) {
        where.push('a.ward_id = ?');
        params.push(wardId);
      }
      if (assetType) {
        where.push('a.asset_type = ?');
        params.push(assetType);
      }
      if (status) {
        where.push('a.status = ?');
        params.push(status);
      }
      if (isRecurring !== undefined && isRecurring !== '') {
        where.push('a.is_recurring_flag = ?');
        params.push(isRecurring === 'true' || isRecurring === '1' ? 1 : 0);
      }
      if (search) {
        where.push('(a.id LIKE ? OR a.name LIKE ? OR a.landmark LIKE ? OR a.location_description LIKE ?)');
        const q = `%${search}%`;
        params.push(q, q, q, q);
      }

      const sql = `
        SELECT 
          a.*,
          w.name as ward_name,
          w.ward_number,
          d.name as department_name,
          d.code as department_code,
          (SELECT count(*) FROM issues WHERE asset_id = a.id AND status NOT IN ('CLOSED')) as active_issues_count
        FROM assets a
        JOIN wards w ON a.ward_id = w.id
        JOIN departments d ON a.department_id = d.id
        WHERE ${where.join(' AND ')}
        ORDER BY a.is_recurring_flag DESC, a.id ASC
      `;

      const assets = db.all(sql, params);
      res.json(assets);
    } catch (err) {
      console.error('getAssets error:', err);
      res.status(500).json({ error: 'Failed to fetch assets.' });
    }
  },

  getAssetById(req, res) {
    try {
      const { id } = req.params;
      const asset = db.get(
        `SELECT 
           a.*,
           w.name as ward_name,
           w.ward_number,
           d.name as department_name,
           d.code as department_code
         FROM assets a
         JOIN wards w ON a.ward_id = w.id
         JOIN departments d ON a.department_id = d.id
         WHERE a.id = ?`,
        [id]
      );

      if (!asset) {
        return res.status(404).json({ error: 'Asset not found.' });
      }

      const issues = db.all(
        `SELECT 
           i.*,
           u.name as reported_by_name,
           s.name as assigned_staff_name
         FROM issues i
         LEFT JOIN users u ON i.reported_by_user_id = u.id
         LEFT JOIN users s ON i.assigned_to_user_id = s.id
         WHERE i.asset_id = ?
         ORDER BY i.created_at DESC`,
        [id]
      );

      const inspections = db.all(
        `SELECT 
           ii.*,
           insp.schedule_date,
           u.name as inspector_name
         FROM inspection_items ii
         JOIN inspections insp ON ii.inspection_id = insp.id
         JOIN users u ON insp.assigned_to_user_id = u.id
         WHERE ii.asset_id = ?
         ORDER BY ii.inspected_at DESC LIMIT 5`,
        [id]
      );

      res.json({
        asset,
        issueHistory: issues,
        inspectionHistory: inspections
      });
    } catch (err) {
      console.error('getAssetById error:', err);
      res.status(500).json({ error: 'Failed to fetch asset details.' });
    }
  },

  createAsset(req, res) {
    try {
      const {
        id, wardId, departmentId, assetType, name,
        locationDescription, landmark, latitude, longitude,
        riskLevel = 'MEDIUM', inspectionFrequencyDays = 14
      } = req.body;

      if (!id || !wardId || !departmentId || !assetType || !name || !locationDescription) {
        return res.status(400).json({ error: 'Missing required asset fields.' });
      }

      const existing = db.get('SELECT id FROM assets WHERE id = ?', [id.trim()]);
      if (existing) {
        return res.status(400).json({ error: `Asset ID ${id} already exists.` });
      }

      db.run(
        `INSERT INTO assets (
          id, village_id, ward_id, department_id, asset_type, name,
          location_description, landmark, latitude, longitude,
          status, risk_level, inspection_frequency_days,
          last_inspection_date, next_inspection_date, failure_count, is_recurring_flag
        ) VALUES (
          ?, 'v-honnur', ?, ?, ?, ?,
          ?, ?, ?, ?,
          'WORKING', ?, ?,
          NULL, datetime('now', '+' || ? || ' days'), 0, 0
        )`,
        [
          id.trim().toUpperCase(), wardId, departmentId, assetType, name.trim(),
          locationDescription.trim(), landmark || null, latitude || 12.824, longitude || 76.755,
          riskLevel, inspectionFrequencyDays, inspectionFrequencyDays
        ]
      );

      const created = db.get('SELECT * FROM assets WHERE id = ?', [id.trim().toUpperCase()]);
      res.status(201).json(created);
    } catch (err) {
      console.error('createAsset error:', err);
      res.status(500).json({ error: 'Failed to create asset.' });
    }
  },

  updateAsset(req, res) {
    try {
      const { id } = req.params;
      const {
        name, locationDescription, landmark, status,
        riskLevel, inspectionFrequencyDays, recurringNotes
      } = req.body;

      db.run(
        `UPDATE assets 
         SET name = COALESCE(?, name),
             location_description = COALESCE(?, location_description),
             landmark = COALESCE(?, landmark),
             status = COALESCE(?, status),
             risk_level = COALESCE(?, risk_level),
             inspection_frequency_days = COALESCE(?, inspection_frequency_days),
             recurring_notes = COALESCE(?, recurring_notes)
         WHERE id = ?`,
        [name, locationDescription, landmark, status, riskLevel, inspectionFrequencyDays, recurringNotes, id]
      );

      const updated = db.get('SELECT * FROM assets WHERE id = ?', [id]);
      res.json(updated);
    } catch (err) {
      console.error('updateAsset error:', err);
      res.status(500).json({ error: 'Failed to update asset.' });
    }
  }
};

module.exports = assetController;
