-- GramSeva Relational Database Schema
-- Pilot: Honnur Gram Panchayat, Karnataka

PRAGMA foreign_keys = ON;

-- 1. Villages
CREATE TABLE IF NOT EXISTS villages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  taluk TEXT NOT NULL,
  district TEXT NOT NULL,
  pin_code TEXT NOT NULL,
  gp_name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Wards / Areas
CREATE TABLE IF NOT EXISTS wards (
  id TEXT PRIMARY KEY,
  village_id TEXT NOT NULL REFERENCES villages(id) ON DELETE CASCADE,
  ward_number INTEGER NOT NULL,
  name TEXT NOT NULL,
  representative_name TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Users (CITIZEN, FIELD_STAFF, ADMIN)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('CITIZEN', 'FIELD_STAFF', 'ADMIN')),
  designation TEXT,
  ward_id TEXT REFERENCES wards(id) ON DELETE SET NULL,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Departments
CREATE TABLE IF NOT EXISTS departments (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  head_name TEXT,
  sla_hours_critical INTEGER DEFAULT 24,
  sla_hours_high INTEGER DEFAULT 48,
  sla_hours_medium INTEGER DEFAULT 120,
  sla_hours_low INTEGER DEFAULT 240,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Public Assets Registry
CREATE TABLE IF NOT EXISTS assets (
  id TEXT PRIMARY KEY,
  village_id TEXT NOT NULL REFERENCES villages(id) ON DELETE CASCADE,
  ward_id TEXT NOT NULL REFERENCES wards(id) ON DELETE RESTRICT,
  department_id TEXT NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
  asset_type TEXT NOT NULL CHECK(asset_type IN ('STREETLIGHT', 'WATER_POINT', 'PUBLIC_TOILET', 'ROAD', 'DRAINAGE', 'WASTE_FACILITY', 'OTHER')),
  name TEXT NOT NULL,
  location_description TEXT NOT NULL,
  landmark TEXT,
  latitude REAL,
  longitude REAL,
  status TEXT NOT NULL DEFAULT 'WORKING' CHECK(status IN ('WORKING', 'NEEDS_ATTENTION', 'NOT_WORKING', 'RECURRING_FAILURE')),
  risk_level TEXT NOT NULL DEFAULT 'MEDIUM' CHECK(risk_level IN ('HIGH', 'MEDIUM', 'LOW')),
  inspection_frequency_days INTEGER DEFAULT 14,
  last_inspection_date DATETIME,
  next_inspection_date DATETIME,
  failure_count INTEGER DEFAULT 0,
  is_recurring_flag INTEGER DEFAULT 0,
  recurring_notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. Issues (The Core Lifecycle Entity)
CREATE TABLE IF NOT EXISTS issues (
  id TEXT PRIMARY KEY,
  asset_id TEXT REFERENCES assets(id) ON DELETE SET NULL,
  ward_id TEXT NOT NULL REFERENCES wards(id) ON DELETE RESTRICT,
  department_id TEXT NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
  reported_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  detection_source TEXT NOT NULL CHECK(detection_source IN ('CITIZEN_REPORT', 'SCHEDULED_INSPECTION', 'COMMUNITY_OBSERVATION', 'HISTORICAL_DETECTION')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK(category IN ('STREETLIGHT', 'WATER_POINT', 'PUBLIC_TOILET', 'ROAD', 'DRAINAGE', 'WASTE_FACILITY', 'OTHER')),
  location_text TEXT NOT NULL,
  landmark TEXT,
  latitude REAL,
  longitude REAL,
  priority TEXT NOT NULL DEFAULT 'MEDIUM' CHECK(priority IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),
  priority_score INTEGER DEFAULT 30,
  priority_rationale TEXT,
  status TEXT NOT NULL DEFAULT 'REPORTED' CHECK(status IN (
    'REPORTED',
    'VERIFICATION_PENDING',
    'VERIFIED',
    'ASSIGNED',
    'INSPECTION',
    'IN_PROGRESS',
    'RESOLVED',
    'CITIZEN_VERIFICATION',
    'CLOSED',
    'REOPENED',
    'ESCALATED'
  )),
  target_completion_date DATETIME,
  assigned_to_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  before_photo_url TEXT,
  after_photo_url TEXT,
  progress_notes TEXT,
  resolution_notes TEXT,
  escalation_level INTEGER DEFAULT 0,
  escalation_history TEXT,
  is_duplicate_of_id TEXT REFERENCES issues(id) ON DELETE SET NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  resolved_at DATETIME,
  closed_at DATETIME
);

-- 7. Timestamped History of Important Status Transitions
CREATE TABLE IF NOT EXISTS issue_status_history (
  id TEXT PRIMARY KEY,
  issue_id TEXT NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 8. Scheduled Field Inspections
CREATE TABLE IF NOT EXISTS inspections (
  id TEXT PRIMARY KEY,
  ward_id TEXT NOT NULL REFERENCES wards(id) ON DELETE RESTRICT,
  assigned_to_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  schedule_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'SCHEDULED' CHECK(status IN ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED')),
  notes TEXT,
  total_assets_checked INTEGER DEFAULT 0,
  issues_detected_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME
);

-- 9. Inspection Checklist Items
CREATE TABLE IF NOT EXISTS inspection_items (
  id TEXT PRIMARY KEY,
  inspection_id TEXT NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
  asset_id TEXT NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  result TEXT NOT NULL DEFAULT 'PENDING' CHECK(result IN ('PENDING', 'WORKING', 'NEEDS_ATTENTION', 'NOT_WORKING')),
  notes TEXT,
  photo_url TEXT,
  created_issue_id TEXT REFERENCES issues(id) ON DELETE SET NULL,
  inspected_at DATETIME
);

-- 10. Citizen Verification & Feedback
CREATE TABLE IF NOT EXISTS feedback (
  id TEXT PRIMARY KEY,
  issue_id TEXT NOT NULL UNIQUE REFERENCES issues(id) ON DELETE CASCADE,
  citizen_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_resolved_confirmed INTEGER NOT NULL CHECK(is_resolved_confirmed IN (0, 1)),
  rating INTEGER CHECK(rating BETWEEN 1 AND 5),
  comments TEXT,
  feedback_source TEXT DEFAULT 'INTERNAL_FORM',
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 11. Meaningful Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  issue_id TEXT REFERENCES issues(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  is_read INTEGER DEFAULT 0,
  email_sent INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 12. System Configuration & Rules
CREATE TABLE IF NOT EXISTS system_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance & quick lookups
CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(status);
CREATE INDEX IF NOT EXISTS idx_issues_ward ON issues(ward_id);
CREATE INDEX IF NOT EXISTS idx_issues_department ON issues(department_id);
CREATE INDEX IF NOT EXISTS idx_issues_assigned ON issues(assigned_to_user_id);
CREATE INDEX IF NOT EXISTS idx_issues_asset ON issues(asset_id);
CREATE INDEX IF NOT EXISTS idx_assets_ward ON assets(ward_id);
CREATE INDEX IF NOT EXISTS idx_assets_type ON assets(asset_type);
CREATE INDEX IF NOT EXISTS idx_assets_status ON assets(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
