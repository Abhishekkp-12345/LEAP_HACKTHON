const db = require('../db/database');
const { handleInspectionItemResult } = require('../services/proactiveDetector');

const inspectionController = {
  getInspections(req, res) {
    try {
      const { wardId, assignedToId, status } = req.query;
      let where = ['1=1'];
      let params = [];

      if (wardId) {
        where.push('i.ward_id = ?');
        params.push(wardId);
      }
      if (assignedToId) {
        where.push('i.assigned_to_user_id = ?');
        params.push(assignedToId);
      }
      if (status) {
        where.push('i.status = ?');
        params.push(status);
      }

      const sql = `
        SELECT 
          i.*,
          w.name as ward_name,
          w.ward_number,
          u.name as inspector_name,
          u.designation as inspector_designation,
          (SELECT count(*) FROM inspection_items WHERE inspection_id = i.id) as total_items,
          (SELECT count(*) FROM inspection_items WHERE inspection_id = i.id AND result != 'PENDING') as checked_items,
          (SELECT count(*) FROM inspection_items WHERE inspection_id = i.id AND result IN ('NOT_WORKING', 'NEEDS_ATTENTION')) as issues_found
        FROM inspections i
        JOIN wards w ON i.ward_id = w.id
        JOIN users u ON i.assigned_to_user_id = u.id
        WHERE ${where.join(' AND ')}
        ORDER BY i.schedule_date DESC, i.created_at DESC
      `;

      const inspections = db.all(sql, params);
      res.json(inspections);
    } catch (err) {
      console.error('getInspections error:', err);
      res.status(500).json({ error: 'Failed to fetch inspections.' });
    }
  },

  getInspectionById(req, res) {
    try {
      const { id } = req.params;
      const inspection = db.get(
        `SELECT 
           i.*,
           w.name as ward_name,
           w.ward_number,
           u.name as inspector_name,
           u.phone as inspector_phone,
           u.designation as inspector_designation
         FROM inspections i
         JOIN wards w ON i.ward_id = w.id
         JOIN users u ON i.assigned_to_user_id = u.id
         WHERE i.id = ?`,
        [id]
      );

      if (!inspection) return res.status(404).json({ error: 'Inspection not found.' });

      const items = db.all(
        `SELECT 
           ii.*,
           a.id as asset_id,
           a.name as asset_name,
           a.asset_type,
           a.location_description as asset_location,
           a.landmark as asset_landmark,
           a.status as current_asset_status,
           a.is_recurring_flag as asset_is_recurring,
           a.failure_count as asset_failure_count
         FROM inspection_items ii
         JOIN assets a ON ii.asset_id = a.id
         WHERE ii.inspection_id = ?
         ORDER BY a.is_recurring_flag DESC, a.id ASC`,
        [id]
      );

      res.json({
        inspection,
        items
      });
    } catch (err) {
      console.error('getInspectionById error:', err);
      res.status(500).json({ error: 'Failed to fetch inspection details.' });
    }
  },

  createInspectionSchedule(req, res) {
    try {
      const { wardId, assignedToUserId, scheduleDate, notes } = req.body;
      if (!wardId || !assignedToUserId || !scheduleDate) {
        return res.status(400).json({ error: 'Ward, assigned staff, and schedule date are required.' });
      }

      const inspId = `insp-${wardId}-${Date.now().toString().slice(-4)}`;

      db.transaction(() => {
        db.run(
          `INSERT INTO inspections (id, ward_id, assigned_to_user_id, schedule_date, status, notes, total_assets_checked, issues_detected_count)
           VALUES (?, ?, ?, ?, 'SCHEDULED', ?, 0, 0)`,
          [inspId, wardId, assignedToUserId, scheduleDate, notes || `Scheduled audit for Ward ${wardId}`]
        );

        const wardAssets = db.all('SELECT id FROM assets WHERE ward_id = ?', [wardId]);
        for (const a of wardAssets) {
          db.run(
            `INSERT INTO inspection_items (id, inspection_id, asset_id, result)
             VALUES (?, ?, ?, 'PENDING')`,
            [`ii-${Date.now()}-${Math.floor(Math.random() * 10000)}`, inspId, a.id]
          );
        }
      });

      const created = db.get('SELECT * FROM inspections WHERE id = ?', [inspId]);
      res.status(201).json(created);
    } catch (err) {
      console.error('createInspectionSchedule error:', err);
      res.status(500).json({ error: 'Failed to schedule inspection.' });
    }
  },

  submitItemResult(req, res) {
    try {
      const { inspectionId, itemId } = req.params;
      const { assetId, result, notes = '', photoUrl = null } = req.body;
      const inspectedByUserId = req.user.id;

      if (!result || !['WORKING', 'NEEDS_ATTENTION', 'NOT_WORKING'].includes(result)) {
        return res.status(400).json({ error: 'Valid result (WORKING, NEEDS_ATTENTION, NOT_WORKING) is required.' });
      }

      const response = handleInspectionItemResult({
        inspectionId,
        itemId,
        assetId,
        result,
        notes,
        photoUrl,
        inspectedByUserId
      });

      res.json(response);
    } catch (err) {
      console.error('submitItemResult error:', err);
      res.status(500).json({ error: err.message || 'Failed to record inspection result.' });
    }
  }
};

module.exports = inspectionController;
