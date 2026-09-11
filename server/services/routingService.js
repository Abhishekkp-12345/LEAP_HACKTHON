const db = require('../db/database');

function routeAndAssign({ category, wardId, priority = 'MEDIUM' }) {
  let deptCode = 'DEPT_STREETLIGHT';
  if (category === 'STREETLIGHT') {
    deptCode = 'STREETLIGHT';
  } else if (category === 'WATER_POINT') {
    deptCode = 'WATER_SUPPLY';
  } else if (category === 'DRAINAGE' || category === 'PUBLIC_TOILET' || category === 'WASTE_FACILITY') {
    deptCode = 'DRAINAGE_SANITATION';
  } else if (category === 'ROAD') {
    deptCode = 'ROADS_INFRA';
  }

  const department = db.get('SELECT * FROM departments WHERE code = ?', [deptCode]) ||
                     db.get('SELECT * FROM departments LIMIT 1');

  let assignedStaff = null;
  if (deptCode === 'STREETLIGHT') {
    assignedStaff = db.get("SELECT * FROM users WHERE role = 'FIELD_STAFF' AND email LIKE '%ramesh%' AND is_active = 1");
  } else if (deptCode === 'WATER_SUPPLY') {
    assignedStaff = db.get("SELECT * FROM users WHERE role = 'FIELD_STAFF' AND email LIKE '%suresh%' AND is_active = 1");
  } else if (deptCode === 'DRAINAGE_SANITATION' || deptCode === 'ROADS_INFRA') {
    assignedStaff = db.get("SELECT * FROM users WHERE role = 'FIELD_STAFF' AND email LIKE '%basavaraj%' AND is_active = 1");
  }

  if (!assignedStaff) {
    assignedStaff = db.get("SELECT * FROM users WHERE role = 'FIELD_STAFF' AND is_active = 1 LIMIT 1");
  }

  let slaHours = 72;
  if (department) {
    if (priority === 'CRITICAL') slaHours = department.sla_hours_critical || 24;
    else if (priority === 'HIGH') slaHours = department.sla_hours_high || 48;
    else if (priority === 'MEDIUM') slaHours = department.sla_hours_medium || 120;
    else if (priority === 'LOW') slaHours = department.sla_hours_low || 240;
  }

  const targetDate = new Date(Date.now() + slaHours * 60 * 60 * 1000).toISOString();

  return {
    departmentId: department ? department.id : null,
    departmentName: department ? department.name : 'Panchayat Engineering Cell',
    assignedToUserId: assignedStaff ? assignedStaff.id : null,
    assignedStaffName: assignedStaff ? assignedStaff.name : 'Duty Lineman / Inspector',
    targetCompletionDate: targetDate,
    slaHours
  };
}

module.exports = {
  routeAndAssign
};
