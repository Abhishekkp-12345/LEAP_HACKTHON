const db = require('../db/database');
const { generateIssueId, checkForDuplicate, checkAndFlagRecurringAsset } = require('../services/proactiveDetector');
const { calculatePriority } = require('../services/priorityEngine');
const { routeAndAssign } = require('../services/routingService');
const { createNotification } = require('../services/notificationService');

const issueController = {
  getIssues(req, res) {
    try {
      const { wardId, category, status, priority, assignedToId, reporterId, search } = req.query;
      let where = ['1=1'];
      let params = [];

      if (wardId) {
        where.push('i.ward_id = ?');
        params.push(wardId);
      }
      if (category) {
        where.push('i.category = ?');
        params.push(category);
      }
      if (status) {
        where.push('i.status = ?');
        params.push(status);
      }
      if (priority) {
        where.push('i.priority = ?');
        params.push(priority);
      }
      if (assignedToId) {
        where.push('i.assigned_to_user_id = ?');
        params.push(assignedToId);
      }
      if (reporterId) {
        where.push('i.reported_by_user_id = ?');
        params.push(reporterId);
      }
      if (search) {
        where.push('(i.id LIKE ? OR i.title LIKE ? OR i.location_text LIKE ? OR i.landmark LIKE ?)');
        const q = `%${search}%`;
        params.push(q, q, q, q);
      }

      const sql = `
        SELECT 
          i.*,
          w.name as ward_name,
          w.ward_number,
          d.name as department_name,
          u.name as reporter_name,
          u.phone as reporter_phone,
          s.name as assigned_staff_name,
          s.designation as assigned_staff_designation,
          a.name as asset_name,
          a.is_recurring_flag as asset_is_recurring,
          fb.rating as feedback_rating,
          fb.is_resolved_confirmed as feedback_confirmed
        FROM issues i
        JOIN wards w ON i.ward_id = w.id
        JOIN departments d ON i.department_id = d.id
        LEFT JOIN users u ON i.reported_by_user_id = u.id
        LEFT JOIN users s ON i.assigned_to_user_id = s.id
        LEFT JOIN assets a ON i.asset_id = a.id
        LEFT JOIN feedback fb ON i.id = fb.issue_id
        WHERE ${where.join(' AND ')}
        ORDER BY 
          CASE i.priority
            WHEN 'CRITICAL' THEN 1
            WHEN 'HIGH' THEN 2
            WHEN 'MEDIUM' THEN 3
            WHEN 'LOW' THEN 4
            ELSE 5
          END,
          i.created_at DESC
      `;

      const issues = db.all(sql, params);
      res.json(issues);
    } catch (err) {
      console.error('getIssues error:', err);
      res.status(500).json({ error: 'Failed to fetch issues.' });
    }
  },

  getIssueById(req, res) {
    try {
      const { id } = req.params;
      const issue = db.get(
        `SELECT 
           i.*,
           w.name as ward_name,
           w.ward_number,
           d.name as department_name,
           d.code as department_code,
           u.name as reporter_name,
           u.phone as reporter_phone,
           u.email as reporter_email,
           s.name as assigned_staff_name,
           s.phone as assigned_staff_phone,
           s.designation as assigned_staff_designation,
           a.name as asset_name,
           a.location_description as asset_location,
           a.is_recurring_flag as asset_is_recurring,
           a.failure_count as asset_failure_count
         FROM issues i
         JOIN wards w ON i.ward_id = w.id
         JOIN departments d ON i.department_id = d.id
         LEFT JOIN users u ON i.reported_by_user_id = u.id
         LEFT JOIN users s ON i.assigned_to_user_id = s.id
         LEFT JOIN assets a ON i.asset_id = a.id
         WHERE i.id = ?`,
        [id]
      );

      if (!issue) {
        return res.status(404).json({ error: 'Issue not found.' });
      }

      const history = db.all(
        `SELECT h.*, u.name as changed_by_name 
         FROM issue_status_history h
         LEFT JOIN users u ON h.changed_by_user_id = u.id
         WHERE h.issue_id = ?
         ORDER BY h.created_at ASC`,
        [id]
      );

      const feedback = db.get('SELECT * FROM feedback WHERE issue_id = ?', [id]);

      res.json({
        issue,
        history,
        feedback
      });
    } catch (err) {
      console.error('getIssueById error:', err);
      res.status(500).json({ error: 'Failed to fetch issue details.' });
    }
  },

  createIssue(req, res) {
    try {
      const {
        assetId,
        wardId,
        category,
        title,
        description,
        locationText,
        landmark,
        latitude,
        longitude,
        detectionSource = 'CITIZEN_REPORT',
        photoUrl = null
      } = req.body;

      if (!category || !title || !description || !locationText || !wardId) {
        return res.status(400).json({ error: 'Missing required issue fields.' });
      }

      const duplicateCheck = checkForDuplicate({ assetId, category, wardId });
      if (duplicateCheck.isDuplicate) {
        return res.status(409).json({
          error: duplicateCheck.reason,
          existingIssue: duplicateCheck.existingIssue,
          isDuplicate: true
        });
      }

      let asset = null;
      if (assetId) {
        asset = db.get('SELECT * FROM assets WHERE id = ?', [assetId]);
      }

      const priorityResult = calculatePriority({
        category,
        locationText,
        landmark,
        assetId,
        asset
      });

      const routing = routeAndAssign({
        category,
        wardId,
        priority: priorityResult.priority
      });

      const issueId = generateIssueId();
      const reporterId = req.user ? req.user.id : null;
      const initialStatus = routing.assignedToUserId ? 'ASSIGNED' : 'REPORTED';

      db.run(
        `INSERT INTO issues (
          id, asset_id, ward_id, department_id, reported_by_user_id,
          detection_source, title, description, category, location_text,
          landmark, latitude, longitude, priority, priority_score, priority_rationale,
          status, target_completion_date, assigned_to_user_id, before_photo_url, created_at
        ) VALUES (
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, datetime('now')
        )`,
        [
          issueId, assetId || null, wardId, routing.departmentId, reporterId,
          detectionSource, title.trim(), description.trim(), category, locationText.trim(),
          landmark || null, latitude || 12.824, longitude || 76.755,
          priorityResult.priority, priorityResult.score, priorityResult.rationale,
          initialStatus, routing.targetCompletionDate, routing.assignedToUserId, photoUrl
        ]
      );

      db.run(
        `INSERT INTO issue_status_history (id, issue_id, old_status, new_status, changed_by_user_id, notes, created_at)
         VALUES (?, ?, NULL, ?, ?, ?, datetime('now'))`,
        [
          `hist-${issueId}-1`,
          issueId,
          initialStatus,
          reporterId,
          `Issue registered via ${detectionSource.replace(/_/g, ' ')}. Prioritized as ${priorityResult.priority} and auto-routed to ${routing.departmentName}.`
        ]
      );

      if (assetId) {
        checkAndFlagRecurringAsset(assetId);
      }

      if (reporterId) {
        createNotification({
          userId: reporterId,
          issueId,
          title: `GramSeva – Issue Registered (${issueId})`,
          message: `Your issue regarding ${category.replace(/_/g, ' ')} has been registered. Priority: ${priorityResult.priority}. Target completion: ${new Date(routing.targetCompletionDate).toLocaleDateString()}.`,
          type: 'STATUS_CHANGE'
        });
      }

      if (routing.assignedToUserId) {
        createNotification({
          userId: routing.assignedToUserId,
          issueId,
          title: `New Task Assignment (${issueId})`,
          message: `New ${priorityResult.priority} priority issue assigned to you in Ward ${wardId}: "${title}". Target completion: ${new Date(routing.targetCompletionDate).toLocaleDateString()}.`,
          type: 'ASSIGNMENT'
        });
      }

      const created = db.get('SELECT * FROM issues WHERE id = ?', [issueId]);
      res.status(201).json(created);
    } catch (err) {
      console.error('createIssue error:', err);
      res.status(500).json({ error: 'Failed to create issue.' });
    }
  },

  startWork(req, res) {
    try {
      const { id } = req.params;
      const { notes } = req.body;
      const staffId = req.user.id;

      const issue = db.get('SELECT * FROM issues WHERE id = ?', [id]);
      if (!issue) return res.status(404).json({ error: 'Issue not found.' });

      db.run(
        `UPDATE issues 
         SET status = 'IN_PROGRESS',
             progress_notes = COALESCE(?, progress_notes)
         WHERE id = ?`,
        [notes, id]
      );

      db.run(
        `INSERT INTO issue_status_history (id, issue_id, old_status, new_status, changed_by_user_id, notes, created_at)
         VALUES (?, ?, ?, 'IN_PROGRESS', ?, ?, datetime('now'))`,
        [`hist-${id}-${Date.now()}`, id, issue.status, staffId, notes || 'Field staff arrived on site and started repair work.']
      );

      if (issue.reported_by_user_id) {
        createNotification({
          userId: issue.reported_by_user_id,
          issueId: id,
          title: `GramSeva – Work Started for ${id}`,
          message: `Field maintenance staff has arrived on site and commenced repair work for your reported issue.`,
          type: 'STATUS_CHANGE'
        });
      }

      const updated = db.get('SELECT * FROM issues WHERE id = ?', [id]);
      res.json(updated);
    } catch (err) {
      console.error('startWork error:', err);
      res.status(500).json({ error: 'Failed to update work progress.' });
    }
  },

  addProgressNote(req, res) {
    try {
      const { id } = req.params;
      const { notes, photoUrl } = req.body;
      const userId = req.user.id;

      const issue = db.get('SELECT * FROM issues WHERE id = ?', [id]);
      if (!issue) return res.status(404).json({ error: 'Issue not found.' });

      db.run(
        `UPDATE issues 
         SET progress_notes = COALESCE(?, progress_notes)
         WHERE id = ?`,
        [notes, id]
      );

      db.run(
        `INSERT INTO issue_status_history (id, issue_id, old_status, new_status, changed_by_user_id, notes, created_at)
         VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
        [`hist-${id}-${Date.now()}`, id, issue.status, issue.status, userId, notes || 'Progress note recorded']
      );

      res.json({ success: true, notes });
    } catch (err) {
      console.error('addProgressNote error:', err);
      res.status(500).json({ error: 'Failed to add progress note.' });
    }
  },

  resolveIssue(req, res) {
    try {
      const { id } = req.params;
      const { resolutionNotes, afterPhotoUrl } = req.body;
      const staffId = req.user.id;

      const issue = db.get('SELECT * FROM issues WHERE id = ?', [id]);
      if (!issue) return res.status(404).json({ error: 'Issue not found.' });

      db.run(
        `UPDATE issues 
         SET status = 'RESOLVED',
             resolution_notes = ?,
             after_photo_url = COALESCE(?, after_photo_url),
             resolved_at = datetime('now')
         WHERE id = ?`,
        [resolutionNotes || 'Field maintenance work completed and verified on site.', afterPhotoUrl, id]
      );

      db.run(
        `INSERT INTO issue_status_history (id, issue_id, old_status, new_status, changed_by_user_id, notes, created_at)
         VALUES (?, ?, ?, 'RESOLVED', ?, ?, datetime('now'))`,
        [`hist-${id}-${Date.now()}`, id, issue.status, staffId, resolutionNotes || 'Repairs completed by field staff. Awaiting citizen verification.']
      );

      if (issue.asset_id) {
        db.run("UPDATE assets SET status = 'WORKING' WHERE id = ?", [issue.asset_id]);
      }

      if (issue.reported_by_user_id) {
        createNotification({
          userId: issue.reported_by_user_id,
          issueId: id,
          title: `GramSeva – Verification Requested for Issue ${id}`,
          message: `Field staff has completed work for issue ${id} ("${issue.title}"). Has the issue been satisfactorily resolved? Please verify.`,
          type: 'VERIFICATION_REQUEST'
        });
      }

      const updated = db.get('SELECT * FROM issues WHERE id = ?', [id]);
      res.json(updated);
    } catch (err) {
      console.error('resolveIssue error:', err);
      res.status(500).json({ error: 'Failed to resolve issue.' });
    }
  },

  verifyResolution(req, res) {
    try {
      const { id } = req.params;
      const { isResolvedConfirmed, rating = 5, comments = '', feedbackSource = 'INTERNAL_FORM' } = req.body;
      const citizenId = req.user.id;

      const issue = db.get('SELECT * FROM issues WHERE id = ?', [id]);
      if (!issue) return res.status(404).json({ error: 'Issue not found.' });

      const confirmed = isResolvedConfirmed === true || isResolvedConfirmed === 1 || isResolvedConfirmed === '1';

      if (confirmed) {
        db.run(
          `UPDATE issues 
           SET status = 'CLOSED',
               closed_at = datetime('now')
           WHERE id = ?`,
          [id]
        );

        db.run(
          `INSERT OR REPLACE INTO feedback (id, issue_id, citizen_id, is_resolved_confirmed, rating, comments, feedback_source, submitted_at)
           VALUES (?, ?, ?, 1, ?, ?, ?, datetime('now'))`,
          [`fb-${id}-${Date.now()}`, id, citizenId, rating, comments, feedbackSource]
        );

        db.run(
          `INSERT INTO issue_status_history (id, issue_id, old_status, new_status, changed_by_user_id, notes, created_at)
           VALUES (?, ?, ?, 'CLOSED', ?, ?, datetime('now'))`,
          [`hist-${id}-${Date.now()}`, id, issue.status, citizenId, `Citizen verified satisfactory resolution. Rating: ${rating}/5. Issue closed.`]
        );

        if (issue.assigned_to_user_id) {
          createNotification({
            userId: issue.assigned_to_user_id,
            issueId: id,
            title: `Issue ${id} Verified & Closed`,
            message: `Citizen verified resolution for issue ${id}. Rating: ${rating}/5 stars. Thank you for your service!`,
            type: 'STATUS_CHANGE'
          });
        }
      } else {
        db.run(
          `UPDATE issues 
           SET status = 'REOPENED',
               priority = 'HIGH',
               priority_score = priority_score + 25,
               priority_rationale = priority_rationale || ' | +25 Citizen reported Still Not Resolved'
           WHERE id = ?`,
          [id]
        );

        db.run(
          `INSERT OR REPLACE INTO feedback (id, issue_id, citizen_id, is_resolved_confirmed, rating, comments, feedback_source, submitted_at)
           VALUES (?, ?, ?, 0, ?, ?, ?, datetime('now'))`,
          [`fb-${id}-${Date.now()}`, id, citizenId, rating, comments || 'Citizen stated issue is still unresolved.', feedbackSource]
        );

        db.run(
          `INSERT INTO issue_status_history (id, issue_id, old_status, new_status, changed_by_user_id, notes, created_at)
           VALUES (?, ?, ?, 'REOPENED', ?, ?, datetime('now'))`,
          [`hist-${id}-${Date.now()}`, id, issue.status, citizenId, `Citizen reported: "Still Not Resolved". Comments: ${comments || 'None'}. Priority elevated.`]
        );

        if (issue.assigned_to_user_id) {
          createNotification({
            userId: issue.assigned_to_user_id,
            issueId: id,
            title: `⚠ Issue Reopened by Citizen (${id})`,
            message: `Citizen reported that issue ${id} is still unresolved. Remarks: "${comments || 'Requires re-inspection'}". Work priority elevated to HIGH.`,
            type: 'STATUS_CHANGE'
          });
        }

        createNotification({
          userId: 'u-admin-1',
          issueId: id,
          title: `Alert: Issue ${id} Reopened by Citizen`,
          message: `Resident in Ward ${issue.ward_id} verified that ${issue.title} is not fixed. Re-opened for supervisor intervention.`,
          type: 'STATUS_CHANGE'
        });
      }

      const updated = db.get('SELECT * FROM issues WHERE id = ?', [id]);
      res.json(updated);
    } catch (err) {
      console.error('verifyResolution error:', err);
      res.status(500).json({ error: 'Failed to record verification.' });
    }
  }
};

module.exports = issueController;
