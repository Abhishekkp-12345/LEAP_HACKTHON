const db = require('../db/database');
const { calculatePriority } = require('./priorityEngine');
const { routeAndAssign } = require('./routingService');
const { createNotification } = require('./notificationService');

function generateIssueId() {
  const year = new Date().getFullYear();
  const countRow = db.get('SELECT count(*) as count FROM issues');
  const nextNum = 1000 + (countRow ? countRow.count + 1 : 1);
  return `GS-${year}-${nextNum}`;
}

function checkForDuplicate({ assetId, category, wardId }) {
  if (assetId) {
    const existing = db.get(
      `SELECT * FROM issues 
       WHERE asset_id = ? 
         AND status NOT IN ('CLOSED') 
       ORDER BY created_at DESC LIMIT 1`,
      [assetId]
    );
    if (existing) {
      return {
        isDuplicate: true,
        existingIssue: existing,
        reason: `An active issue (${existing.id}) is already open for asset ${assetId} with status '${existing.status}'.`
      };
    }
  }

  const recentInWard = db.get(
    `SELECT * FROM issues 
     WHERE ward_id = ? 
       AND category = ? 
       AND status NOT IN ('CLOSED') 
       AND datetime(created_at) >= datetime('now', '-24 hours')
     ORDER BY created_at DESC LIMIT 1`,
    [wardId, category]
  );

  if (recentInWard && !assetId) {
    return {
      isDuplicate: true,
      existingIssue: recentInWard,
      reason: `A similar ${category} issue (${recentInWard.id}) was registered in this ward within the last 24 hours.`
    };
  }

  return { isDuplicate: false };
}

function handleInspectionItemResult({
  inspectionId,
  itemId,
  assetId,
  result,
  notes = '',
  photoUrl = null,
  inspectedByUserId
}) {
  const asset = db.get('SELECT * FROM assets WHERE id = ?', [assetId]);
  if (!asset) throw new Error(`Asset ${assetId} not found`);

  let newAssetStatus = 'WORKING';
  if (result === 'NOT_WORKING') {
    newAssetStatus = asset.is_recurring_flag ? 'RECURRING_FAILURE' : 'NOT_WORKING';
  } else if (result === 'NEEDS_ATTENTION') {
    newAssetStatus = 'NEEDS_ATTENTION';
  }

  db.run(
    `UPDATE assets 
     SET status = ?, last_inspection_date = datetime('now')
     WHERE id = ?`,
    [newAssetStatus, assetId]
  );

  let createdIssue = null;

  if (result === 'NOT_WORKING' || result === 'NEEDS_ATTENTION') {
    const dupCheck = checkForDuplicate({
      assetId,
      category: asset.asset_type,
      wardId: asset.ward_id
    });

    if (dupCheck.isDuplicate) {
      createdIssue = dupCheck.existingIssue;
      db.run(
        `INSERT INTO issue_status_history (id, issue_id, old_status, new_status, changed_by_user_id, notes, created_at)
         VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
        [
          `hist-insp-${Date.now()}`,
          createdIssue.id,
          createdIssue.status,
          createdIssue.status,
          inspectedByUserId,
          `Proactive Scheduled Inspection reaffirmed issue on ${assetId}: ${notes || result}`
        ]
      );
    } else {
      const issueId = generateIssueId();
      const priorityInfo = calculatePriority({
        category: asset.asset_type,
        locationText: asset.location_description,
        landmark: asset.landmark,
        assetId: asset.id,
        asset
      });

      const routing = routeAndAssign({
        category: asset.asset_type,
        wardId: asset.ward_id,
        priority: priorityInfo.priority
      });

      const title = `[Proactive Detection] ${asset.name} - ${result === 'NOT_WORKING' ? 'Total Outage' : 'Requires Attention'}`;
      const desc = notes || `Identified during scheduled field inspection. Asset condition marked as ${result}.`;

      db.run(
        `INSERT INTO issues (
          id, asset_id, ward_id, department_id, reported_by_user_id,
          detection_source, title, description, category, location_text,
          landmark, latitude, longitude, priority, priority_score, priority_rationale,
          status, target_completion_date, assigned_to_user_id, before_photo_url, created_at
        ) VALUES (
          ?, ?, ?, ?, ?,
          'SCHEDULED_INSPECTION', ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?,
          'ASSIGNED', ?, ?, ?, datetime('now')
        )`,
        [
          issueId, asset.id, asset.ward_id, routing.departmentId, inspectedByUserId,
          title, desc, asset.asset_type, asset.location_description,
          asset.landmark, asset.latitude, asset.longitude,
          priorityInfo.priority, priorityInfo.score, priorityInfo.rationale,
          routing.targetCompletionDate, routing.assignedToUserId, photoUrl
        ]
      );

      db.run(
        `INSERT INTO issue_status_history (id, issue_id, old_status, new_status, changed_by_user_id, notes, created_at)
         VALUES (?, ?, NULL, 'ASSIGNED', ?, ?, datetime('now'))`,
        [
          `hist-${issueId}-1`,
          issueId,
          inspectedByUserId,
          `Detected during scheduled inspection. Auto-assigned to ${routing.assignedStaffName} with ${priorityInfo.priority} priority.`
        ]
      );

      checkAndFlagRecurringAsset(asset.id);

      createdIssue = db.get('SELECT * FROM issues WHERE id = ?', [issueId]);

      createNotification({
        userId: 'u-admin-1',
        issueId,
        title: `Proactive Issue Detected: ${asset.id}`,
        message: `Field staff detected ${result} for ${asset.name}. Auto-routed to ${routing.departmentName} (${priorityInfo.priority} priority).`,
        type: 'STATUS_CHANGE'
      });

      if (routing.assignedToUserId) {
        createNotification({
          userId: routing.assignedToUserId,
          issueId,
          title: `New Assignment: ${asset.id} (${priorityInfo.priority})`,
          message: `Proactively detected issue ${issueId} assigned to you. Due by ${new Date(routing.targetCompletionDate).toLocaleDateString()}.`,
          type: 'ASSIGNMENT'
        });
      }
    }
  }

  db.run(
    `UPDATE inspection_items 
     SET result = ?, notes = ?, photo_url = ?, created_issue_id = ?, inspected_at = datetime('now')
     WHERE id = ?`,
    [result, notes, photoUrl, createdIssue ? createdIssue.id : null, itemId]
  );

  const counts = db.get(
    `SELECT 
       count(*) as total,
       sum(CASE WHEN result != 'PENDING' THEN 1 ELSE 0 END) as checked,
       sum(CASE WHEN result IN ('NOT_WORKING', 'NEEDS_ATTENTION') THEN 1 ELSE 0 END) as issuesFound
     FROM inspection_items WHERE inspection_id = ?`,
    [inspectionId]
  );

  const isAllChecked = counts && counts.checked >= counts.total;

  db.run(
    `UPDATE inspections 
     SET total_assets_checked = ?, 
         issues_detected_count = ?,
         status = ?,
         completed_at = ?
     WHERE id = ?`,
    [
      counts ? counts.checked : 0,
      counts ? counts.issuesFound : 0,
      isAllChecked ? 'COMPLETED' : 'IN_PROGRESS',
      isAllChecked ? new Date().toISOString() : null,
      inspectionId
    ]
  );

  return {
    success: true,
    result,
    assetStatus: newAssetStatus,
    createdIssue
  };
}

function checkAndFlagRecurringAsset(assetId) {
  const asset = db.get('SELECT * FROM assets WHERE id = ?', [assetId]);
  if (!asset) return null;

  const historyRow = db.get(
    `SELECT count(*) as count 
     FROM issues 
     WHERE asset_id = ? 
       AND datetime(created_at) >= datetime('now', '-60 days')`,
    [assetId]
  );

  const failuresCount = historyRow ? historyRow.count : 0;

  if (failuresCount >= 3) {
    const recNotes = `⚠ Chronic recurring failures (${failuresCount} in past 60 days). Recommend permanent overhaul or replacement instead of temporary repairs.`;

    db.run(
      `UPDATE assets 
       SET failure_count = ?, 
           is_recurring_flag = 1, 
           inspection_frequency_days = 7,
           recurring_notes = ?
       WHERE id = ?`,
      [failuresCount, recNotes, assetId]
    );

    createNotification({
      userId: 'u-admin-1',
      issueId: null,
      title: `⚠ Recurring Failure Alert: Asset ${asset.id}`,
      message: `${asset.name} has recorded ${failuresCount} failures in the last 60 days. System has elevated inspection frequency to Weekly. Recommend permanent overhaul.`,
      type: 'RECURRING_ALERT'
    });

    return {
      isRecurring: true,
      failuresCount,
      recommendation: 'Recommend permanent replacement or circuit overhaul'
    };
  } else {
    db.run('UPDATE assets SET failure_count = ? WHERE id = ?', [failuresCount, assetId]);
    return { isRecurring: false, failuresCount };
  }
}

module.exports = {
  generateIssueId,
  checkForDuplicate,
  handleInspectionItemResult,
  checkAndFlagRecurringAsset
};
