const db = require('../db/database');
const { createNotification } = require('./notificationService');

function checkAndEscalateIssues() {
  const overdueIssues = db.all(
    `SELECT i.*, 
       ROUND((julianday('now') - julianday(i.target_completion_date)) * 24, 1) as hours_overdue,
       u.name as assigned_staff_name,
       d.name as department_name
     FROM issues i
     LEFT JOIN users u ON i.assigned_to_user_id = u.id
     LEFT JOIN departments d ON i.department_id = d.id
     WHERE i.status NOT IN ('RESOLVED', 'CITIZEN_VERIFICATION', 'CLOSED')
       AND datetime(i.target_completion_date) < datetime('now')`
  );

  const escalationResults = [];

  for (const issue of overdueIssues) {
    const hoursOverdue = issue.hours_overdue || 0;
    let newLevel = 1;
    let responsibleAuthority = issue.assigned_staff_name || 'Assigned Officer';

    if (hoursOverdue > 72) {
      newLevel = 3;
      responsibleAuthority = 'Executive Officer (Taluk Panchayat, Nagamangala)';
    } else if (hoursOverdue > 24) {
      newLevel = 2;
      responsibleAuthority = 'K. Shivakumar (Panchayat Development Officer, Honnur GP)';
    } else {
      newLevel = 1;
      responsibleAuthority = `${issue.assigned_staff_name || 'Duty Lineman'} & Dept Head`;
    }

    if (newLevel > issue.escalation_level || issue.status !== 'ESCALATED') {
      let history = [];
      try {
        if (issue.escalation_history) {
          history = JSON.parse(issue.escalation_history);
        }
      } catch (e) {
        history = [];
      }

      history.push({
        level: newLevel,
        escalatedAt: new Date().toISOString(),
        hoursOverdue,
        responsibleAuthority,
        reason: `Exceeded SLA by ${hoursOverdue} hours`
      });

      db.run(
        `UPDATE issues 
         SET status = 'ESCALATED',
             escalation_level = ?,
             escalation_history = ?
         WHERE id = ?`,
        [newLevel, JSON.stringify(history), issue.id]
      );

      db.run(
        `INSERT INTO issue_status_history (id, issue_id, old_status, new_status, changed_by_user_id, notes, created_at)
         VALUES (?, ?, ?, 'ESCALATED', 'u-admin-1', ?, datetime('now'))`,
        [
          `hist-esc-${issue.id}-${Date.now()}`,
          issue.id,
          issue.status,
          `Escalated to Level ${newLevel} (${responsibleAuthority}). Overdue by ${Math.round(hoursOverdue / 24)} days.`
        ]
      );

      createNotification({
        userId: 'u-admin-1',
        issueId: issue.id,
        title: `Level ${newLevel} Escalation: Issue ${issue.id}`,
        message: `Issue ${issue.id} (${issue.title}) is overdue by ${Math.round(hoursOverdue / 24)} days. Escalated to ${responsibleAuthority}.`,
        type: 'ESCALATION'
      });

      escalationResults.push({
        issueId: issue.id,
        title: issue.title,
        hoursOverdue,
        newLevel,
        responsibleAuthority
      });
    }
  }

  return {
    totalChecked: overdueIssues.length,
    escalatedCount: escalationResults.length,
    escalations: escalationResults
  };
}

module.exports = {
  checkAndEscalateIssues
};
