import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

export const translations = {
  en: {
    // Top Bar & Branding
    karnataka_gov_banner: 'Department of Rural Development & Panchayat Raj | Govt of Karnataka',
    pilot_location_banner: 'Pilot Deployment: Honnur Gram Panchayat (Mandya District)',
    app_title: 'GRAMSEVA',
    sub_title: 'Proactive Village Infrastructure Platform',
    pilot_location: 'Honnur Gram Panchayat, Mandya District',
    proactive_pilot_tag: 'Proactive Pilot',

    // Role Switcher
    switch_role: 'Active Role:',
    citizen: 'Citizen',
    field_staff: 'Field Inspector',
    admin: 'PDO / Admin',
    role_citizen_desc: 'Citizen Portal • Honnur Gram Panchayat',
    role_field_desc: 'Field Operations Console • Honnur GP',
    role_admin_desc: 'Panchayat Development Executive Console • Honnur GP',

    // Navigation
    nav_dashboard: 'Dashboard',
    nav_report: 'Report Issue',
    nav_my_issues: 'My Issues',
    nav_inspections: 'Inspection Tasks',
    nav_work_orders: 'Assigned Repairs',
    nav_assets: 'Asset Registry',
    nav_escalations: 'Escalations',
    nav_recurring: 'Recurring Assets',
    nav_analytics: 'Live Analytics',
    nav_map: 'Village Map',
    nav_config: 'Rules & SLAs',

    // Common Buttons
    btn_report_issue: 'Report Public Issue',
    btn_verify: 'Verify Resolution',
    btn_start_work: 'Start Work',
    btn_mark_resolved: 'Mark Resolved',
    btn_submit: 'Submit',
    btn_cancel: 'Cancel',
    btn_save: 'Save',
    btn_track: 'Track',
    btn_details: 'Details',
    btn_read_all: 'Read All',
    btn_refresh: 'Refresh Live Data',
    btn_back_to_dashboard: 'Back to Dashboard',
    btn_run_audit: 'Run Audit Checklist',
    btn_review_checklist: 'Review Checklist',
    btn_update_work: 'Update Work Progress',
    btn_schedule_audit: 'Schedule New Ward Audit',
    btn_register_asset: 'Register New Public Asset',
    btn_trigger_escalation: 'Trigger SLA Escalation Scan',
    btn_open_analytics: 'Live Visual Analytics',
    btn_view_full_history: 'View Full History',
    btn_confirm_close: 'Confirm & Close Issue',
    btn_reopen_issue: 'Reopen Issue',
    btn_yes_fixed: 'YES, Issue is Fixed',
    btn_no_not_fixed: 'NO, Still Not Resolved',

    // Categories
    cat_STREETLIGHT: 'Streetlight',
    cat_WATER_POINT: 'Drinking Water / RO',
    cat_DRAINAGE: 'Drainage',
    cat_ROAD: 'Road / Pavement',
    cat_PUBLIC_TOILET: 'Public Toilet',
    cat_OTHER: 'Other Facility',

    // Departments
    dept_streetlight: 'Streetlight Maintenance Team',
    dept_water: 'Rural Water Supply (RWSS)',
    dept_sanitation: 'Sanitation & Solid Waste Team',
    dept_roads: 'Rural Infrastructure (PWD)',

    // Wards
    ward_w_1: 'Ward 1 - Kote & Temple Area',
    ward_w_2: 'Ward 2 - School & PHC Ward',
    ward_w_3: 'Ward 3 - Market & Bus Stop',
    ward_w_4: 'Ward 4 - Colony & Lake Extension',
    all_wards: 'All Wards',
    all_categories: 'All Categories',
    all_priorities: 'All Priorities',
    all_statuses: 'All Statuses',

    // Statuses
    status_REPORTED: 'Reported',
    status_VERIFICATION_PENDING: 'Verification Pending',
    status_VERIFIED: 'Verified',
    status_ASSIGNED: 'Assigned',
    status_IN_PROGRESS: 'In Progress',
    status_INSPECTION: 'Inspection',
    status_RESOLVED: 'Resolved',
    status_CITIZEN_VERIFICATION: 'Verification Required',
    status_CLOSED: 'Closed',
    status_REOPENED: 'Reopened',
    status_ESCALATED: 'Escalated',
    status_WORKING: 'Working',
    status_NEEDS_ATTENTION: 'Needs Attention',
    status_NOT_WORKING: 'Not Working',
    status_RECURRING_FAILURE: 'Recurring Failure',
    status_COMPLETED: 'Completed',
    status_PENDING: 'Pending',

    // Priorities
    priority_CRITICAL: 'Critical',
    priority_HIGH: 'High',
    priority_MEDIUM: 'Medium',
    priority_LOW: 'Low',
    priority_rationale_title: 'Transparent Priority Rationale:',

    // Detection Sources
    source_SCHEDULED_INSPECTION: '⚡ Proactive Inspection',
    source_CITIZEN_REPORT: 'Citizen Report',
    source_SUPERVISOR_AUDIT: 'Supervisor Audit',

    // KPI Labels
    kpi_total_assets: 'Total Public Assets',
    kpi_functional_assets: 'Functional Assets',
    kpi_recurring_assets: '⚠ Recurring Assets',
    kpi_active_open: 'Active Open Issues',
    kpi_repairs_progress: 'Repairs in Progress',
    kpi_pending_verification: 'Pending Verification',
    kpi_sla_escalated: 'SLA Escalated',
    kpi_citizen_reopened: 'Citizen Reopened',
    kpi_resolution_rate: 'Resolution Rate',
    kpi_avg_resolution_time: 'Avg Resolution Time',
    kpi_citizen_satisfaction: 'Citizen Satisfaction',
    kpi_proactive_finds: 'Proactive Audit Finds',
    kpi_verified_rate: 'Verified by Citizens',
    kpi_issues_you_reported: 'Issues You Reported',
    kpi_verified_closed: 'Verified & Closed',
    kpi_audits_pending: 'Audits Pending',
    kpi_active_repairs: 'Active Repairs',

    // Citizen Dashboard
    citizen_welcome_title: 'Namaskara',
    citizen_welcome_desc: 'GramSeva continuously monitors village public assets through scheduled audits and community reports. You don\'t need to report every issue—our field teams inspect weekly!',
    verification_req_banner_title: 'Resolution Verification Required',
    verification_req_banner_desc: 'Field staff completed repairs for issue. Has the problem actually been fixed on site?',
    verify_now_btn: 'Verify Now',
    activity_title: 'Village Infrastructure Activity (Honnur GP)',
    activity_sub: 'Transparent public status of village infrastructure',
    table_issue_id: 'Issue ID',
    table_category: 'Category',
    table_desc_location: 'Description & Location',
    table_detection_source: 'Detection Source',
    table_priority: 'Priority',
    table_current_status: 'Current Status',
    table_action: 'Action',

    // Report Issue Form
    report_title: 'Report Village Infrastructure Problem',
    report_subtitle: 'Simple, direct reporting for Honnur Gram Panchayat residents.',
    report_step1: '1. Select Problem Category',
    report_step2: '2. Village Ward / Area',
    report_link_asset: 'Optional: Link to Known Asset',
    report_link_asset_default: '-- General Issue / Not Listed --',
    report_step3: '3. Issue Title / Summary',
    report_title_placeholder: 'e.g. Streetlight flickering and wire exposed outside School',
    report_step4: '4. Details of the Problem',
    report_desc_placeholder: 'Explain what is damaged or non-functional and how long it has been in this state...',
    report_location: 'Location Address / Street',
    report_location_placeholder: 'e.g. School Cross Road, Ward 2',
    report_landmark: 'Nearby Landmark',
    report_landmark_placeholder: 'e.g. Govt Primary School gate / Bus shelter',
    report_photo: 'Photo Evidence (Optional but helpful)',
    report_choose_photo: 'Choose Photo',
    report_photo_attached: 'Photo attached',
    report_submitting: 'Registering...',
    report_submit_btn: 'Submit Issue to Panchayat',
    report_success_title: 'Issue Successfully Registered!',
    report_success_complaint_id: 'Unique Complaint ID',
    report_success_priority: 'Priority Assigned:',
    report_success_msg: 'Your issue has been routed directly to the responsible maintenance team. You will receive important progress notifications.',
    report_track_btn: 'Track Issue Progress',

    // My Issues Page
    my_issues_title: 'My Reported Issues & Grievances',
    my_issues_subtitle: 'Track resolution progress and verify completed field work.',
    filter_all: 'All My Reports',
    filter_active: 'Active',
    filter_resolved: 'Resolved',
    filter_closed: 'Closed',
    no_issues_found: 'No issues found matching this filter.',
    reported_on: 'Reported on',

    // Field Staff Dashboard
    field_header_title: 'Field Operations Console • Honnur GP',
    field_header_desc: 'Conduct proactive scheduled infrastructure audits and resolve assigned village repairs.',
    tab_scheduled_inspections: 'Scheduled Field Inspections',
    tab_assigned_repairs: 'Assigned Maintenance Tasks',
    audit_date: 'Audit Date:',
    assets_checked: 'Assets Checked:',
    outages_discovered: 'Outages Discovered',
    target_sla: 'Target SLA:',
    recurring_asset_warning: '⚠ Chronic Recurring Asset: Check permanent wiring/fixture.',

    // Admin Dashboard
    admin_header_subtitle: 'Panchayat Development Executive Console • Honnur GP',
    admin_header_title: 'Village Infrastructure Health & Resolution Center',
    admin_header_model: 'Operating model:',
    admin_model_flow: 'Detect → Verify → Prioritize → Route → Assign → Repair → Verify → Close → Analyze → Prevent Recurrence.',
    insights_title: 'Real-Time Administrative Insights (Deterministic Rules, No AI)',
    insights_subtitle: 'Calculated dynamically from live Honnur GP database records',
    card_asset_registry_title: 'Digital Asset Registry',
    card_asset_registry_desc: 'Maintain digital inventory of all streetlights, water points, toilets, and drains.',
    card_recurring_title: '⚠ Recurring Assets Analysis',
    card_recurring_desc: 'Move from repeated quick-fixes to preventive replacement for SL-047, etc.',
    card_audits_title: 'Scheduled Field Audits',
    card_audits_desc: 'Configure weekly ward inspection checklists and review field inspector progress.',

    // Live Analytics Page
    analytics_title: 'Executive Analytics & Visual Telemetry',
    analytics_subtitle: 'Live database-backed analytical insights for Honnur Gram Panchayat.',
    analytics_live_pulse: 'LIVE: Auto-updating from Database (Honnur GP)',
    analytics_last_updated: 'Last updated',
    analytics_seconds_ago: 'seconds ago',
    analytics_just_now: 'just now',
    analytics_filter_ward: 'Filter Ward:',
    analytics_filter_category: 'Category:',
    analytics_filter_priority: 'Priority:',
    chart1_title: '1. Infrastructure Health & Resolution Status',
    chart1_desc: 'Live breakdown of active open repairs, in-progress work, verifications, and closures.',
    chart2_title: '2. Proactive vs Reactive Detection Ratio',
    chart2_desc: 'Proactive routine inspections vs reactive citizen grievance reports.',
    chart3_title: '3. Ward-wise Issue Density & Asset Health',
    chart3_desc: 'Active issues compared with functional public infrastructure across Wards 1 to 4.',
    chart4_title: '4. Department Resolution Time & SLA Compliance',
    chart4_desc: 'Average hours to resolve issues and SLA performance across departments.',

    // Asset Registry
    asset_registry_title: 'Village Public Asset Registry',
    asset_registry_subtitle: 'Digital inventory of all public infrastructure in Honnur Gram Panchayat.',
    search_assets_placeholder: 'Search by ID (e.g. SL-047), name, landmark...',
    filter_recurring_btn: 'Filter Recurring (3+)',
    showing_recurring_btn: 'Showing Recurring',
    th_asset_id: 'Asset ID',
    th_asset_name: 'Asset Name & Landmark',
    th_type: 'Type',
    th_ward: 'Ward',
    th_department: 'Department',
    th_status: 'Current Status',
    th_cadence: 'Audit Cadence',
    th_failures: 'Failures',
    cadence_every: 'Every',
    cadence_days: 'Days',

    // Recurring Assets Page
    recurring_title: '⚠ Chronic Recurring Asset Analysis & Prevention',
    recurring_subtitle: 'Transitioning from repeated quick-fixes to root-cause overhaul and permanent replacement.',
    recurring_advisory_title: 'Automated Preventive Maintenance Protocol Active',
    recurring_advisory_desc: 'When an asset records 3 or more failures in 60 days, GramSeva automatically bumps inspection frequency to Weekly (7 Days) and flags the asset for permanent overhaul rather than temporary repairs.',
    failures_in_60_days: 'Failures in 60 Days',
    root_cause_rec_title: 'Root Cause Diagnosis & Engineering Recommendation:',
    lifetime_issues: 'Lifetime Recorded Issues:',
    recent_60day_failures: 'Recent 60-Day Failures:',
    current_cadence: 'Current Inspection Cadence:',
    no_recurring_found: 'No chronic recurring failure assets identified.',

    // Escalation Center
    escalation_title: 'SLA Escalation & Overdue Oversight',
    escalation_subtitle: 'Configurable multi-tier escalation hierarchy for overdue civic repairs.',
    btn_run_escalation_audit: 'Run Escalation Audit Now',
    auditing_overdue: 'Auditing Overdue SLAs...',
    tier_hierarchy_title: 'Configurable Multi-Tier Escalation Hierarchy:',
    level_1_title: 'LEVEL 1 (0–24h Overdue)',
    level_1_resp: 'Responsible: Assigned Field Staff & Line Inspector',
    level_2_title: 'LEVEL 2 (24–72h Overdue)',
    level_2_resp: 'Responsible: K. Shivakumar (Panchayat Development Officer - PDO)',
    level_3_title: 'LEVEL 3 (>72h Overdue)',
    level_3_resp: 'Responsible: Executive Officer (Taluk Panchayat, Nagamangala)',
    active_escalated_issues: 'Active Escalated Issues',
    target_sla_label: 'Target Completion SLA:',
    current_authority_label: 'Current Escalated Authority:',
    no_escalations_active: 'No SLA escalations currently active. All open issues are within their configured target times!',

    // Village Map
    map_title: 'Honnur Gram Panchayat Interactive Infrastructure Map',
    map_subtitle: 'Ward 1 (Kote) • Ward 2 (School & PHC) • Ward 3 (Market) • Ward 4 (Colony & Lake)',
    map_filter_all: 'All Assets',
    map_filter_issues: 'Active Issues',
    map_filter_recurring: '⚠ Recurring (SL-047, etc.)',
    map_legend_title: 'Map Legend:',
    map_legend_working: 'Functional / Working Asset',
    map_legend_issue: 'Active Issue / Outage',
    map_legend_recurring: '⚠ Chronic Recurring Asset (SL-047, etc.)',

    // Modals
    modal_verify_title: 'Has the issue been resolved?',
    modal_verify_question: 'Did the field repair resolve the problem on site?',
    modal_rating_label: 'How satisfied are you with the promptness & repair quality?',
    modal_comments_label: 'Optional Comments / Remarks',
    modal_comments_placeholder: 'Share any feedback for the Panchayat maintenance team...',
    modal_reopen_why: 'Why is the problem still unresolved?',
    modal_reopen_warning: 'Marking "Still Not Resolved" will immediately reopen the issue with elevated priority and notify the supervisor.',
    modal_reopen_placeholder: 'e.g. Light worked for 10 minutes and tripped again / Valve is still leaking...',
    modal_track_title: 'Issue Details & Lifecycle Stepper',
    modal_work_title: 'Field Staff Work Update',
    modal_notifications_title: 'Civic Notifications',
    modal_notifications_desc: 'Meaningful lifecycle updates and proactive infrastructure alerts sent by GramSeva.',
    modal_no_notifications: 'No new notifications at this time.'
  },

  kn: {
    // Top Bar & Branding
    karnataka_gov_banner: 'ಗ್ರಾಮೀಣಾಭಿವೃದ್ಧಿ ಮತ್ತು ಪಂಚಾಯತ್ ರಾಜ್ ಇಲಾಖೆ | ಕರ್ನಾಟಕ ಸರ್ಕಾರ',
    pilot_location_banner: 'ಪ್ರಾಯೋಗಿಕ ಯೋಜನೆ: ಹೊನ್ನೂರು ಗ್ರಾಮ ಪಂಚಾಯಿತಿ (ಮಂಡ್ಯ ಜಿಲ್ಲೆ)',
    app_title: 'ಗ್ರಾಮ ಸೇವಾ',
    sub_title: 'ಸಕ್ರಿಯ ಗ್ರಾಮೀಣ ಮೂಲಸೌಕರ್ಯ ನಿರ್ವಹಣಾ ವೇದಿಕೆ',
    pilot_location: 'ಹೊನ್ನೂರು ಗ್ರಾಮ ಪಂಚಾಯಿತಿ, ಮಂಡ್ಯ ಜಿಲ್ಲೆ',
    proactive_pilot_tag: 'ಸಕ್ರಿಯ ಯೋಜನೆ',

    // Role Switcher
    switch_role: 'ಸಕ್ರಿಯ ಪಾತ್ರ:',
    citizen: 'ನಾಗರಿಕರು',
    field_staff: 'ಕ್ಷೇತ್ರ ಪರಿವೀಕ್ಷಕರು',
    admin: 'ಪಿಡಿಒ / ಆಡಳಿತ',
    role_citizen_desc: 'ನಾಗರಿಕ ಪೋರ್ಟಲ್ • ಹೊನ್ನೂರು ಗ್ರಾಮ ಪಂಚಾಯಿತಿ',
    role_field_desc: 'ಕ್ಷೇತ್ರ ಕಾರ್ಯಾಚರಣೆಗಳ ಕನ್ಸೋಲ್ • ಹೊನ್ನೂರು ಗ್ರಾ.ಪಂ.',
    role_admin_desc: 'ಪಂಚಾಯತ್ ಅಭಿವೃದ್ಧಿ ಅಧಿಕಾರಿ (ಪಿಡಿಒ) ಕನ್ಸೋಲ್ • ಹೊನ್ನೂರು ಗ್ರಾ.ಪಂ.',

    // Navigation
    nav_dashboard: 'ಮುಖಪುಟ',
    nav_report: 'ಸಮಸ್ಯೆ ವರದಿ',
    nav_my_issues: 'ನನ್ನ ದೂರುಗಳು',
    nav_inspections: 'ತಪಾಸಣಾ ಕಾರ್ಯಗಳು',
    nav_work_orders: 'ನಿಯೋಜಿತ ಕಾಮಗಾರಿ',
    nav_assets: 'ಆಸ್ತಿಗಳ ನೋಂದಣಿ',
    nav_escalations: 'ತುರ್ತು ಪರಿಶೀಲನೆ',
    nav_recurring: 'ಮರುಕಳಿಸುವ ಸಮಸ್ಯೆಗಳು',
    nav_analytics: 'ನೇರ ವಿಶ್ಲೇಷಣೆ',
    nav_map: 'ಗ್ರಾಮದ ನಕ್ಷೆ',
    nav_config: 'ನಿಯಮಗಳು & ಎಸ್‌ಎಲ್‌ಎ',

    // Common Buttons
    btn_report_issue: 'ಸಾರ್ವಜನಿಕ ಸಮಸ್ಯೆ ವರದಿ ಮಾಡಿ',
    btn_verify: 'ಪರಿಹಾರ ಪರಿಶೀಲಿಸಿ',
    btn_start_work: 'ಕಾಮಗಾರಿ ಪ್ರಾರಂಭಿಸಿ',
    btn_mark_resolved: 'ಪೂರ್ಣಗೊಂಡಿದೆ ಎಂದು ಗುರುತಿಸಿ',
    btn_submit: 'ಸಲ್ಲಿಸಿ',
    btn_cancel: 'ರದ್ದುಗೊಳಿಸಿ',
    btn_save: 'ಉಳಿಸಿ',
    btn_track: 'ಸ್ಥಿತಿ ನೋಡಿ',
    btn_details: 'ವಿವರಗಳು',
    btn_read_all: 'ಎಲ್ಲವನ್ನೂ ಓದಲಾಗಿದೆ',
    btn_refresh: 'ನೈಜ ಮಾಹಿತಿ ನವೀಕರಿಸಿ',
    btn_back_to_dashboard: 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ',
    btn_run_audit: 'ತಪಾಸಣಾ ಪರಿಶೀಲನೆ ನಡೆಸಿ',
    btn_review_checklist: 'ಪಟ್ಟಿ ಪರಿಶೀಲಿಸಿ',
    btn_update_work: 'ಕೆಲಸದ ಪ್ರಗತಿ ದಾಖಲಿಸಿ',
    btn_schedule_audit: 'ಹೊಸ ವಾರ್ಡ್ ತಪಾಸಣೆ ನಿಗದಿಪಡಿಸಿ',
    btn_register_asset: 'ಹೊಸ ಸಾರ್ವಜನಿಕ ಆಸ್ತಿ ನೋಂದಾಯಿಸಿ',
    btn_trigger_escalation: 'ಎಸ್‌ಎಲ್‌ಎ ಮೀರಿದ ಸಮಸ್ಯೆಗಳ ಪರಿಶೀಲನೆ',
    btn_open_analytics: 'ನೇರ ಚಿತ್ರಾತ್ಮಕ ವಿಶ್ಲೇಷಣೆ',
    btn_view_full_history: 'ಸಂಪೂರ್ಣ ಇತಿಹಾಸ ನೋಡಿ',
    btn_confirm_close: 'ದೃಢೀಕರಿಸಿ & ಮುಕ್ತಾಯಗೊಳಿಸಿ',
    btn_reopen_issue: 'ದೂರನ್ನು ಮರುತೆರೆಯಿರಿ',
    btn_yes_fixed: 'ಹೌದು, ಸಮಸ್ಯೆ ಪರಿಹಾರವಾಗಿದೆ',
    btn_no_not_fixed: 'ಇಲ್ಲ, ಇನ್ನೂ ಪರಿಹಾರವಾಗಿಲ್ಲ',

    // Categories
    cat_STREETLIGHT: 'ಬೀದಿ ದೀಪ',
    cat_WATER_POINT: 'ಕುಡಿಯುವ ನೀರು / ಶುದ್ಧ ಕುಡಿಯುವ ನೀರಿನ ಘಟಕ',
    cat_DRAINAGE: 'ಚರಂಡಿ ವ್ಯವಸ್ಥೆ',
    cat_ROAD: 'ರಸ್ತೆ / ಕಾಲುದಾರಿ',
    cat_PUBLIC_TOILET: 'ಸಾರ್ವಜನಿಕ ಶೌಚಾಲಯ',
    cat_OTHER: 'ಇತರ ಸೌಲಭ್ಯ',

    // Departments
    dept_streetlight: 'ಬೀದಿ ದೀಪ ನಿರ್ವಹಣಾ ದಳ',
    dept_water: 'ಗ್ರಾಮೀಣ ಕುಡಿಯುವ ನೀರು ಮತ್ತು ನೈರ್ಮಲ್ಯ ಇಲಾಖೆ (RWSS)',
    dept_sanitation: 'ನೈರ್ಮಲ್ಯ ಮತ್ತು ಘನತ್ಯಾಜ್ಯ ನಿರ್ವಹಣಾ ತಂಡ',
    dept_roads: 'ಗ್ರಾಮೀಣ ಮೂಲಸೌಕರ್ಯ (ಲೋಕೋಪಯೋಗಿ - PWD)',

    // Wards
    ward_w_1: 'ವಾರ್ಡ್ ೧ - ಕೋಟೆ ಮತ್ತು ದೇವಾಲಯ ಪ್ರದೇಶ',
    ward_w_2: 'ವಾರ್ಡ್ ೨ - ಶಾಲೆ ಮತ್ತು ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರ',
    ward_w_3: 'ವಾರ್ಡ್ ೩ - ಮಾರುಕಟ್ಟೆ ಮತ್ತು ಬಸ್ ನಿಲ್ದಾಣ',
    ward_w_4: 'ವಾರ್ಡ್ ೪ - ಕಾಲೋನಿ ಮತ್ತು ಕೆರೆ ವಿಸ್ತರಣೆ',
    all_wards: 'ಎಲ್ಲಾ ವಾರ್ಡ್‌ಗಳು',
    all_categories: 'ಎಲ್ಲಾ ವಿಭಾಗಗಳು',
    all_priorities: 'ಎಲ್ಲಾ ಆದ್ಯತೆಗಳು',
    all_statuses: 'ಎಲ್ಲಾ ಸ್ಥಿತಿಗಳು',

    // Statuses
    status_REPORTED: 'ದಾಖಲಾಗಿದೆ',
    status_VERIFICATION_PENDING: 'ಪರಿಶೀಲನೆ ಬಾಕಿ',
    status_VERIFIED: 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ',
    status_ASSIGNED: 'ನಿಯೋಜಿಸಲಾಗಿದೆ',
    status_IN_PROGRESS: 'ಕಾಮಗಾರಿ ಪ್ರಗತಿಯಲ್ಲಿದೆ',
    status_INSPECTION: 'ತಪಾಸಣೆಯಲ್ಲಿದೆ',
    status_RESOLVED: 'ಪರಿಹರಿಸಲಾಗಿದೆ',
    status_CITIZEN_VERIFICATION: 'ನಾಗರಿಕರ ದೃಢೀಕರಣ ಅಗತ್ಯವಿದೆ',
    status_CLOSED: 'ಮುಕ್ತಾಯಗೊಂಡಿದೆ',
    status_REOPENED: 'ಮರುತೆರೆಯಲಾಗಿದೆ',
    status_ESCALATED: 'ಮೇಲಧಿಕಾರಿಗೆ ರವಾನಿಸಲಾಗಿದೆ',
    status_WORKING: 'ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಿದೆ',
    status_NEEDS_ATTENTION: 'ಗಮನ ಅಗತ್ಯವಿದೆ',
    status_NOT_WORKING: 'ಕೆಲಸ ಮಾಡುತ್ತಿಲ್ಲ',
    status_RECURRING_FAILURE: 'ಮರುಕಳಿಸುವ ವೈಫಲ್ಯ',
    status_COMPLETED: 'ಪೂರ್ಣಗೊಂಡಿದೆ',
    status_PENDING: 'ಬಾಕಿ ಇದೆ',

    // Priorities
    priority_CRITICAL: 'ಅತಿ ತುರ್ತು',
    priority_HIGH: 'ಹೆಚ್ಚಿನ ಆದ್ಯತೆ',
    priority_MEDIUM: 'ಮಧ್ಯಮ ಆದ್ಯತೆ',
    priority_LOW: 'ಕಡಿಮೆ ಆದ್ಯತೆ',
    priority_rationale_title: 'ಪಾರದರ್ಶಕ ಆದ್ಯತೆಯ ವಿವರಣೆ:',

    // Detection Sources
    source_SCHEDULED_INSPECTION: '⚡ ಪೂರ್ವಭಾವಿ ತಪಾಸಣೆ',
    source_CITIZEN_REPORT: 'ನಾಗರಿಕರ ದೂರು',
    source_SUPERVISOR_AUDIT: 'ಮೇಲ್ವಿಚಾರಕರ ತಪಾಸಣೆ',

    // KPI Labels
    kpi_total_assets: 'ಒಟ್ಟು ಸಾರ್ವಜನಿಕ ಆಸ್ತಿಗಳು',
    kpi_functional_assets: 'ಕಾರ್ಯನಿರತ ಆಸ್ತಿಗಳು',
    kpi_recurring_assets: '⚠ ಮರುಕಳಿಸುವ ಆಸ್ತಿಗಳು',
    kpi_active_open: 'ಪ್ರಸ್ತುತ ಸಕ್ರಿಯ ಸಮಸ್ಯೆಗಳು',
    kpi_repairs_progress: 'ದುರಸ್ತಿ ಪ್ರಗತಿಯಲ್ಲಿದೆ',
    kpi_pending_verification: 'ದೃಢೀಕರಣ ಬಾಕಿ ಇದೆ',
    kpi_sla_escalated: 'ಗಡುವು ಮೀರಿದ ಸಮಸ್ಯೆಗಳು',
    kpi_citizen_reopened: 'ಮರುತೆರೆದ ಸಮಸ್ಯೆಗಳು',
    kpi_resolution_rate: 'ಪರಿಹಾರ ದರ',
    kpi_avg_resolution_time: 'ಸರಾಸರಿ ಪರಿಹಾರ ಸಮಯ',
    kpi_citizen_satisfaction: 'ನಾಗರಿಕರ ತೃಪ್ತಿ',
    kpi_proactive_finds: 'ಪೂರ್ವಭಾವಿಯಾಗಿ ಪತ್ತೆಯಾದವು',
    kpi_verified_rate: 'ನಾಗರಿಕರಿಂದ ದೃಢೀಕರಿಸಲಾಗಿದೆ',
    kpi_issues_you_reported: 'ನೀವು ದಾಖಲಿಸಿದ ದೂರುಗಳು',
    kpi_verified_closed: 'ದೃಢೀಕರಿಸಿ ಮುಕ್ತಾಯವಾದವು',
    kpi_audits_pending: 'ಬಾಕಿ ಇರುವ ತಪಾಸಣೆಗಳು',
    kpi_active_repairs: 'ಸಕ್ರಿಯ ದುರಸ್ತಿ ಕಾಮಗಾರಿಗಳು',

    // Citizen Dashboard
    citizen_welcome_title: 'ನಮಸ್ಕಾರ',
    citizen_welcome_desc: 'ಗ್ರಾಮಸೇವಾ ಯೋಜನೆಯು ಗ್ರಾಮದ ಸಾರ್ವಜನಿಕ ಮೂಲಸೌಕರ್ಯಗಳನ್ನು ನಿಯಮಿತ ತಪಾಸಣೆಗಳ ಮೂಲಕ ಸಕ್ರಿಯವಾಗಿ ಪರಿಶೀಲಿಸುತ್ತದೆ. ಪ್ರತಿಯೊಂದು ಸಮಸ್ಯೆಯನ್ನೂ ನೀವು ವರದಿ ಮಾಡುವ ಅಗತ್ಯವಿಲ್ಲ—ನಮ್ಮ ಸಿಬ್ಬಂದಿ ವಾರಕ್ಕೊಮ್ಮೆ ತಪಾಸಣೆ ನಡೆಸುತ್ತಾರೆ!',
    verification_req_banner_title: 'ಪರಿಹಾರ ದೃಢೀಕರಣ ಅಗತ್ಯವಿದೆ',
    verification_req_banner_desc: 'ಕ್ಷೇತ್ರ ಸಿಬ್ಬಂದಿ ಈ ಸಮಸ್ಯೆಯ ದುರಸ್ತಿ ಕಾರ್ಯ ಪೂರ್ಣಗೊಳಿಸಿದ್ದಾರೆ. ಸ್ಥಳದಲ್ಲಿ ಸಮಸ್ಯೆ ನಿಜವಾಗಿ ಬಗೆಹರಿದಿದೆಯೇ?',
    verify_now_btn: 'ಈಗಲೇ ಪರಿಶೀಲಿಸಿ',
    activity_title: 'ಗ್ರಾಮದ ಮೂಲಸೌಕರ್ಯ ಕಾಮಗಾರಿಗಳ ವಿವರ (ಹೊನ್ನೂರು)',
    activity_sub: 'ಸಾರ್ವಜನಿಕ ಮೂಲಸೌಕರ್ಯಗಳ ಪಾರದರ್ಶಕ ಸ್ಥಿತಿಗತಿ',
    table_issue_id: 'ದೂರು ಸಂಖ್ಯೆ',
    table_category: 'ವಿಭಾಗ',
    table_desc_location: 'ವಿವರಣೆ ಮತ್ತು ಸ್ಥಳ',
    table_detection_source: 'ಪತ್ತೆಯಾದ ಮೂಲ',
    table_priority: 'ಆದ್ಯತೆ',
    table_current_status: 'ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ',
    table_action: 'ಕ್ರಮ',

    // Report Issue Form
    report_title: 'ಗ್ರಾಮ ಮೂಲಸೌಕರ್ಯ ಸಮಸ್ಯೆ ವರದಿ ಮಾಡಿ',
    report_subtitle: 'ಹೊನ್ನೂರು ಗ್ರಾಮ ಪಂಚಾಯಿತಿ ನಿವಾಸಿಗಳಿಗೆ ನೇರ ಹಾಗೂ ಸುಲಭ ವರದಿ ವ್ಯವಸ್ಥೆ.',
    report_step1: '೧. ಸಮಸ್ಯೆಯ ವಿಭಾಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    report_step2: '೨. ಗ್ರಾಮದ ವಾರ್ಡ್ / ಪ್ರದೇಶ',
    report_link_asset: 'ಐಚ್ಛಿಕ: ನಿರ್ದಿಷ್ಟ ಆಸ್ತಿಗೆ ಲಿಂಕ್ ಮಾಡಿ',
    report_link_asset_default: '-- ಸಾಮಾನ್ಯ ಸಮಸ್ಯೆ / ಪಟ್ಟಿಯಲ್ಲಿಲ್ಲ --',
    report_step3: '೩. ಸಮಸ್ಯೆಯ ಸಂಕ್ಷಿಪ್ತ ಶೀರ್ಷಿಕೆ',
    report_title_placeholder: 'ಉದಾ: ಶಾಲೆಯ ಮುಂಭಾಗದ ಬೀದಿ ದೀಪ ಕೆಟ್ಟಿದೆ ಮತ್ತು ತಂತಿ ಹೊರಬಂದಿದೆ',
    report_step4: '೪. ಸಮಸ್ಯೆಯ ಸಂಪೂರ್ಣ ವಿವರ',
    report_desc_placeholder: 'ಏನು ಹಾನಿಯಾಗಿದೆ ಮತ್ತು ಎಷ್ಟು ದಿನಗಳಿಂದ ಈ ಸ್ಥಿತಿಯಲ್ಲಿದೆ ಎಂಬುದನ್ನು ವಿವರಿಸಿ...',
    report_location: 'ರಸ್ತೆ / ಸ್ಥಳದ ವಿಳಾಸ',
    report_location_placeholder: 'ಉದಾ: ಶಾಲಾ ರಸ್ತೆ, ವಾರ್ಡ್ ೨',
    report_landmark: 'ಹತ್ತಿರದ ಪ್ರಮುಖ ಗುರುತು',
    report_landmark_placeholder: 'ಉದಾ: ಸರ್ಕಾರಿ ಪ್ರಾಥಮಿಕ ಶಾಲಾ ಗೇಟ್ / ಬಸ್ ತಂಗುದಾಣ',
    report_photo: 'ಫೋಟೋ ಪುರಾವೆ (ಐಚ್ಛಿಕ)',
    report_choose_photo: 'ಫೋಟೋ ಆಯ್ಕೆಮಾಡಿ',
    report_photo_attached: 'ಫೋಟೋ ಲಗತ್ತಿಸಲಾಗಿದೆ',
    report_submitting: 'ದಾಖಲಿಸಲಾಗುತ್ತಿದೆ...',
    report_submit_btn: 'ಪಂಚಾಯಿತಿಗೆ ದೂರು ಸಲ್ಲಿಸಿ',
    report_success_title: 'ಸಮಸ್ಯೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ದಾಖಲಿಸಲಾಗಿದೆ!',
    report_success_complaint_id: 'ದೂರು ಗುರುತಿನ ಸಂಖ್ಯೆ',
    report_success_priority: 'ನಿಗದಿಪಡಿಸಿದ ಆದ್ಯತೆ:',
    report_success_msg: 'ನಿಮ್ಮ ದೂರನ್ನು ಸಂಬಂಧಪಟ್ಟ ನಿರ್ವಹಣಾ ತಂಡಕ್ಕೆ ನೇರವಾಗಿ ಕಳುಹಿಸಲಾಗಿದೆ. ಪ್ರಗತಿಯ ವಿವರಗಳು ನಿಮಗೆ ತಲುಪಲಿವೆ.',
    report_track_btn: 'ದೂರಿನ ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಿ',

    // My Issues Page
    my_issues_title: 'ನನ್ನ ದೂರುಗಳು ಮತ್ತು ಸ್ಥಿತಿಗತಿ',
    my_issues_subtitle: 'ನಿಮ್ಮ ದೂರುಗಳ ಪರಿಹಾರ ಪ್ರಗತಿಯನ್ನು ವೀಕ್ಷಿಸಿ ಮತ್ತು ಕಾಮಗಾರಿಯನ್ನು ದೃಢೀಕರಿಸಿ.',
    filter_all: 'ಎಲ್ಲಾ ದೂರುಗಳು',
    filter_active: 'ಪ್ರಗತಿಯಲ್ಲಿರುವವು',
    filter_resolved: 'ಪರಿಹರಿಸಲಾದವು',
    filter_closed: 'ಮುಕ್ತಾಯಗೊಂಡವು',
    no_issues_found: 'ಈ ವಿಭಾಗದಲ್ಲಿ ಯಾವುದೇ ದೂರುಗಳಿಲ್ಲ.',
    reported_on: 'ದಾಖಲಾದ ದಿನಾಂಕ',

    // Field Staff Dashboard
    field_header_title: 'ಕ್ಷೇತ್ರ ಕಾರ್ಯಾಚರಣೆಗಳ ಕನ್ಸೋಲ್ • ಹೊನ್ನೂರು ಗ್ರಾ.ಪಂ.',
    field_header_desc: 'ಪೂರ್ವಭಾವಿ ತಪಾಸಣೆಗಳನ್ನು ನಡೆಸಿ ಮತ್ತು ನಿಯೋಜಿತ ದುರಸ್ತಿ ಕಾಮಗಾರಿಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ.',
    tab_scheduled_inspections: 'ನಿಗದಿತ ಕ್ಷೇತ್ರ ತಪಾಸಣೆಗಳು',
    tab_assigned_repairs: 'ನಿಯೋಜಿತ ದುರಸ್ತಿ ಕಾಮಗಾರಿಗಳು',
    audit_date: 'ತಪಾಸಣಾ ದಿನಾಂಕ:',
    assets_checked: 'ಪರಿಶೀಲಿಸಿದ ಆಸ್ತಿಗಳು:',
    outages_discovered: 'ಪತ್ತೆಯಾದ ದೋಷಗಳು',
    target_sla: 'ಅಂತಿಮ ಗಡುವು:',
    recurring_asset_warning: '⚠ ಮರುಕಳಿಸುವ ಆಸ್ತಿ: ಶಾಶ್ವತ ವೈರಿಂಗ್ ಅಥವಾ ಹೊಸ ಉಪಕರಣವನ್ನು ಪರೀಕ್ಷಿಸಿ.',

    // Admin Dashboard
    admin_header_subtitle: 'ಪಂಚಾಯತ್ ಅಭಿವೃದ್ಧಿ ಕಾರ್ಯನಿರ್ವಾಹಕ ಕನ್ಸೋಲ್ • ಹೊನ್ನೂರು ಗ್ರಾ.ಪಂ.',
    admin_header_title: 'ಗ್ರಾಮ ಮೂಲಸೌಕರ್ಯ ಸ್ಥಿತಿಗತಿ ಮತ್ತು ಪರಿಹಾರ ಕೇಂದ್ರ',
    admin_header_model: 'ಕಾರ್ಯಾಚರಣೆ ಮಾದರಿ:',
    admin_model_flow: 'ಪತ್ತೆ → ಪರಿಶೀಲನೆ → ಆದ್ಯತೆ → ಮಾರ್ಗಸೂಚಿ → ನಿಯೋಜನೆ → ದುರಸ್ತಿ → ನಾಗರಿಕ ದೃಢೀಕರಣ → ಮುಕ್ತಾಯ → ಮರುಕಳಿಕೆ ತಡೆಗಟ್ಟುವಿಕೆ.',
    insights_title: 'ನೈಜ ಸಮಯದ ಆಡಳಿತಾತ್ಮಕ ಸೂಚನೆಗಳು (ನಿಯಮ-ಆಧಾರಿತ, ಕೃತಕವಲ್ಲ)',
    insights_subtitle: 'ಹೊನ್ನೂರು ಗ್ರಾ.ಪಂ. ನೈಜ ದತ್ತಸಂಚಯದಿಂದ ಲೆಕ್ಕಾಚಾರ ಮಾಡಲಾಗಿದೆ',
    card_asset_registry_title: 'ಡಿಜಿಟಲ್ ಆಸ್ತಿಗಳ ನೋಂದಣಿ',
    card_asset_registry_desc: 'ಗ್ರಾಮದ ಎಲ್ಲಾ ಬೀದಿ ದೀಪಗಳು, ನೀರಿನ ಘಟಕಗಳು, ಶೌಚಾಲಯಗಳು ಮತ್ತು ಚರಂಡಿಗಳ ಪಟ್ಟಿ.',
    card_recurring_title: '⚠ ಮರುಕಳಿಸುವ ಆಸ್ತಿಗಳ ವಿಶ್ಲೇಷಣೆ',
    card_recurring_desc: 'ತಾತ್ಕಾಲಿಕ ದುರಸ್ತಿ ಬದಲು ಶಾಶ್ವತ ಬದಲಾವಣೆಗೆ ಅಗತ್ಯವಿರುವ ಆಸ್ತಿಗಳ ಗುರುತಿಸುವಿಕೆ (ಉದಾ: SL-047).',
    card_audits_title: 'ನಿಗದಿತ ಕ್ಷೇತ್ರ ತಪಾಸಣೆಗಳು',
    card_audits_desc: 'ವಾರ್ಡ್‌ವಾರು ತಪಾಸಣಾ ವೇಳಾಪಟ್ಟಿ ಮತ್ತು ಕ್ಷೇತ್ರ ಸಿಬ್ಬಂದಿಯ ಕಾರ್ಯಪ್ರಗತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ.',

    // Live Analytics Page
    analytics_title: 'ನೇರ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಸಚಿತ್ರ ವರದಿ',
    analytics_subtitle: 'ಹೊನ್ನೂರು ಗ್ರಾಮ ಪಂಚಾಯಿತಿಯ ದತ್ತಸಂಚಯ-ಆಧಾರಿತ ನೈಜ ವಿಶ್ಲೇಷಣಾತ್ಮಕ ಚಾರ್ಟ್‌ಗಳು.',
    analytics_live_pulse: 'ನೇರ ಪ್ರಸಾರ: ದತ್ತಸಂಚಯದಿಂದ ನೈಜ ಸಮಯದಲ್ಲಿ ನವೀಕರಣಗೊಳ್ಳುತ್ತಿದೆ',
    analytics_last_updated: 'ಕೊನೆಯ ನವೀಕರಣ',
    analytics_seconds_ago: 'ಸೆಕೆಂಡುಗಳ ಹಿಂದೆ',
    analytics_just_now: 'ಈಗಷ್ಟೇ',
    analytics_filter_ward: 'ವಾರ್ಡ್ ಆಯ್ಕೆ:',
    analytics_filter_category: 'ವಿಭಾಗ:',
    analytics_filter_priority: 'ಆದ್ಯತೆ:',
    chart1_title: '೧. ಮೂಲಸೌಕರ್ಯ ಸ್ಥಿತಿ ಮತ್ತು ಪರಿಹಾರ ಹಂತಗಳು',
    chart1_desc: 'ಸಕ್ರಿಯ ದುರಸ್ತಿಗಳು, ಪ್ರಗತಿಯಲ್ಲಿರುವ ಕೆಲಸಗಳು, ದೃಢೀಕರಣ ಬಾಕಿ ಮತ್ತು ಮುಕ್ತಾಯಗೊಂಡವುಗಳ ನೇರ ವಿವರ.',
    chart2_title: '೨. ಪೂರ್ವಭಾವಿ vs ನಾಗರಿಕರ ದೂರುಗಳ ಅನುಪಾತ',
    chart2_desc: 'ಸಿಬ್ಬಂದಿಯ ನಿಯಮಿತ ತಪಾಸಣೆಯಿಂದ ಪತ್ತೆಯಾದವು ಮತ್ತು ನಾಗರಿಕರು ವರದಿ ಮಾಡಿದ ಸಮಸ್ಯೆಗಳ ಹೋಲಿಕೆ.',
    chart3_title: '೩. ವಾರ್ಡ್‌ವಾರು ಸಮಸ್ಯೆಗಳ ಸಾಂದ್ರತೆ ಮತ್ತು ಆಸ್ತಿಗಳ ಸ್ಥಿತಿ',
    chart3_desc: '೧ ರಿಂದ ೪ ನೇ ವಾರ್ಡ್‌ಗಳಲ್ಲಿನ ಸಕ್ರಿಯ ಸಮಸ್ಯೆಗಳು ಮತ್ತು ಸುಸ್ಥಿತಿಯಲ್ಲಿರುವ ಆಸ್ತಿಗಳ ಹೋಲಿಕೆ.',
    chart4_title: '೪. ಇಲಾಖಾವಾರು ಪರಿಹಾರ ಸಮಯ ಮತ್ತು ಗಡುವು ಪಾಲನೆ',
    chart4_desc: 'ವಿವಿಧ ಇಲಾಖೆಗಳು ಸಮಸ್ಯೆ ಬಗೆಹರಿಸಲು ತೆಗೆದುಕೊಂಡ ಸರಾಸರಿ ಗಂಟೆಗಳು ಮತ್ತು ಗಡುವು ಪಾಲನೆಯ ದರ.',

    // Asset Registry
    asset_registry_title: 'ಗ್ರಾಮ ಸಾರ್ವಜನಿಕ ಆಸ್ತಿಗಳ ನೋಂದಣಿ ವಹಿ',
    asset_registry_subtitle: 'ಹೊನ್ನೂರು ಗ್ರಾಮ ಪಂಚಾಯಿತಿಯ ಎಲ್ಲಾ ಸಾರ್ವಜನಿಕ ಮೂಲಸೌಕರ್ಯಗಳ ಡಿಜಿಟಲ್ ದಾಸ್ತಾನು.',
    search_assets_placeholder: 'ಸಂಖ್ಯೆ (ಉದಾ: SL-047), ಹೆಸರು ಅಥವಾ ಗುರುತಿನಿಂದ ಹುಡುಕಿ...',
    filter_recurring_btn: 'ಮರುಕಳಿಸುವ ಆಸ್ತಿಗಳು (೩+)',
    showing_recurring_btn: 'ಮರುಕಳಿಸುವ ಆಸ್ತಿಗಳು ಮಾತ್ರ',
    th_asset_id: 'ಆಸ್ತಿ ಸಂಖ್ಯೆ',
    th_asset_name: 'ಆಸ್ತಿಯ ಹೆಸರು & ಗುರುತು',
    th_type: 'ವಿಧ',
    th_ward: 'ವಾರ್ಡ್',
    th_department: 'ಇಲಾಖೆ',
    th_status: 'ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ',
    th_cadence: 'ತಪಾಸಣಾ ಆವರ್ತನೆ',
    th_failures: 'ವೈಫಲ್ಯಗಳು',
    cadence_every: 'ಪ್ರತಿ',
    cadence_days: 'ದಿನಗಳಿಗೊಮ್ಮೆ',

    // Recurring Assets Page
    recurring_title: '⚠ ಮರುಕಳಿಸುವ ಆಸ್ತಿಗಳ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ತಡೆಗಟ್ಟುವಿಕೆ',
    recurring_subtitle: 'ತಾತ್ಕಾಲಿಕ ರಿಪೇರಿಗಳಿಂದ ಮೂಲ ಕಾರಣದ ಸಂಪೂರ್ಣ ಬದಲಾವಣೆಗೆ ಪರಿವರ್ತಿಸುವ ವ್ಯವಸ್ಥೆ.',
    recurring_advisory_title: 'ಸ್ವಯಂಚಾಲಿತ ಮುನ್ನೆಚ್ಚರಿಕಾ ನಿರ್ವಹಣಾ ನಿಯಮ ಸಕ್ರಿಯವಾಗಿದೆ',
    recurring_advisory_desc: 'ಒಂದು ಆಸ್ತಿಯು ೬೦ ದಿನಗಳಲ್ಲಿ ೩ ಅಥವಾ ಹೆಚ್ಚಿನ ಬಾರಿ ವಿಫಲವಾದರೆ, ಗ್ರಾಮಸೇವಾ ವ್ಯವಸ್ಥೆಯು ಅದರ ತಪಾಸಣೆಯನ್ನು ಸಾಪ್ತಾಹಿಕ (೭ ದಿನಗಳು) ಮಟ್ಟಕ್ಕೆ ಹೆಚ್ಚಿಸುತ್ತದೆ ಮತ್ತು ಶಾಶ್ವತ ದುರಸ್ತಿಗೆ ಶಿಫಾರಸು ಮಾಡುತ್ತದೆ.',
    failures_in_60_days: '೬೦ ದಿನಗಳಲ್ಲಿನ ವೈಫಲ್ಯಗಳು',
    root_cause_rec_title: 'ಮೂಲ ಕಾರಣದ ರೋಗನಿರ್ಣಯ ಮತ್ತು ತಾಂತ್ರಿಕ ಶಿಫಾರಸು:',
    lifetime_issues: 'ಒಟ್ಟು ದಾಖಲಾದ ಸಮಸ್ಯೆಗಳು:',
    recent_60day_failures: 'ಇತ್ತೀಚಿನ ೬೦ ದಿನಗಳ ವೈಫಲ್ಯಗಳು:',
    current_cadence: 'ಪ್ರಸ್ತುತ ತಪಾಸಣಾ ಆವರ್ತನೆ:',
    no_recurring_found: 'ಯಾವುದೇ ದೀರ್ಘಕಾಲಿಕ ಮರುಕಳಿಸುವ ವೈಫಲ್ಯದ ಆಸ್ತಿಗಳು ಕಂಡುಬಂದಿಲ್ಲ.',

    // Escalation Center
    escalation_title: 'ಗಡುವು ಮೀರಿದ ಸಮಸ್ಯೆಗಳ ತುರ್ತು ಪರಿಶೀಲನೆ',
    escalation_subtitle: 'ವಿಳಂಬವಾದ ಕಾಮಗಾರಿಗಳಿಗಾಗಿ ಬಹು-ಹಂತದ ಮೇಲ್ವಿಚಾರಣಾ ಶ್ರೇಣಿ.',
    btn_run_escalation_audit: 'ಗಡುವು ಮೀರಿದ ದೂರುಗಳ ಪರಿಶೀಲನೆ ನಡೆಸಿ',
    auditing_overdue: 'ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...',
    tier_hierarchy_title: 'ಬಹು-ಹಂತದ ಹೊಣೆಗಾರಿಕೆ ಶ್ರೇಣಿ:',
    level_1_title: 'ಹಂತ ೧ (೦–೨೪ ಗಂಟೆ ವಿಳಂಬ)',
    level_1_resp: 'ಹೊಣೆಗಾರರು: ನಿಯೋಜಿತ ಕ್ಷೇತ್ರ ಸಿಬ್ಬಂದಿ ಮತ್ತು ಲೈನ್ ಇನ್‌ಸ್ಪೆಕ್ಟರ್',
    level_2_title: 'ಹಂತ ೨ (೨೪–೭೨ ಗಂಟೆ ವಿಳಂಬ)',
    level_2_resp: 'ಹೊಣೆಗಾರರು: ಕೆ. ಶಿವಕುಮಾರ್ (ಪಂಚಾಯತ್ ಅಭಿವೃದ್ಧಿ ಅಧಿಕಾರಿ - ಪಿಡಿಒ)',
    level_3_title: 'ಹಂತ ೩ (>೭೨ ಗಂಟೆ ವಿಳಂಬ)',
    level_3_resp: 'ಹೊಣೆಗಾರರು: ಕಾರ್ಯನಿರ್ವಾಹಕ ಅಧಿಕಾರಿಗಳು (ತಾಲ್ಲೂಕು ಪಂಚಾಯಿತಿ, ನಾಗಮಂಗಲ)',
    active_escalated_issues: 'ಉನ್ನತೀಕರಿಸಲಾದ ಸಕ್ರಿಯ ಸಮಸ್ಯೆಗಳು',
    target_sla_label: 'ಅಂತಿಮ ಪರಿಹಾರ ಗಡುವು:',
    current_authority_label: 'ಪ್ರಸ್ತುತ ಉನ್ನತೀಕರಿಸಲಾದ ಅಧಿಕಾರಿ:',
    no_escalations_active: 'ಪ್ರಸ್ತುತ ಯಾವುದೇ ಸಮಸ್ಯೆಗಳು ಗಡುವು ಮೀರಿಲ್ಲ. ಎಲ್ಲಾ ಕಾಮಗಾರಿಗಳು ನಿಗದಿತ ಸಮಯದೊಳಗಿವೆ!',

    // Village Map
    map_title: 'ಹೊನ್ನೂರು ಗ್ರಾಮ ಪಂಚಾಯಿತಿ ಸಂವಾದಾತ್ಮಕ ಮೂಲಸೌಕರ್ಯ ನಕ್ಷೆ',
    map_subtitle: 'ವಾರ್ಡ್ ೧ (ಕೋಟೆ) • ವಾರ್ಡ್ ೨ (ಶಾಲೆ & ಪಿಎಚ್‌ಸಿ) • ವಾರ್ಡ್ ೩ (ಮಾರುಕಟ್ಟೆ) • ವಾರ್ಡ್ ೪ (ಕಾಲೋನಿ & ಕೆರೆ)',
    map_filter_all: 'ಎಲ್ಲಾ ಆಸ್ತಿಗಳು',
    map_filter_issues: 'ದೋಷವಿರುವ ಆಸ್ತಿಗಳು',
    map_filter_recurring: '⚠ ಮರುಕಳಿಸುವ ಆಸ್ತಿಗಳು (SL-047)',
    map_legend_title: 'ನಕ್ಷೆಯ ಸಂಕೇತಗಳು:',
    map_legend_working: 'ಸುಸ್ಥಿತಿಯಲ್ಲಿರುವ ಸಾರ್ವಜನಿಕ ಆಸ್ತಿ',
    map_legend_issue: 'ಸಮಸ್ಯೆ / ದುರಸ್ತಿಯಲ್ಲಿರುವ ಆಸ್ತಿ',
    map_legend_recurring: '⚠ ಮರುಕಳಿಸುವ ಆಸ್ತಿ (SL-047, ಇತ್ಯಾದಿ)',

    // Modals
    modal_verify_title: 'ಸಮಸ್ಯೆಯು ಪರಿಹಾರವಾಗಿದೆಯೇ?',
    modal_verify_question: 'ಸ್ಥಳದಲ್ಲಿ ಕೈಗೊಂಡ ದುರಸ್ತಿಯಿಂದ ಸಮಸ್ಯೆ ಪರಿಹಾರವಾಗಿದೆಯೇ?',
    modal_rating_label: 'ದುರಸ್ತಿಯ ಗುಣಮಟ್ಟ ಮತ್ತು ಸಮಯಪಾಲನೆಯ ಬಗ್ಗೆ ನಿಮ್ಮ ಅಭಿಪ್ರಾಯವೇನು?',
    modal_comments_label: 'ನಿಮ್ಮ ಅನಿಸಿಕೆ / ಪ್ರತಿಕ್ರಿಯೆ (ಐಚ್ಛಿಕ)',
    modal_comments_placeholder: 'ಪಂಚಾಯಿತಿ ನಿರ್ವಹಣಾ ತಂಡಕ್ಕಾಗಿ ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆ ಹಂಚಿಕೊಳ್ಳಿ...',
    modal_reopen_why: 'ಸಮಸ್ಯೆ ಏಕೆ ಇನ್ನೂ ಪರಿಹಾರವಾಗಿಲ್ಲ?',
    modal_reopen_warning: '"ಇನ್ನೂ ಪರಿಹಾರವಾಗಿಲ್ಲ" ಎಂದು ಆಯ್ಕೆಮಾಡಿದರೆ ಈ ದೂರು ಹೆಚ್ಚಿನ ಆದ್ಯತೆಯೊಂದಿಗೆ ತಕ್ಷಣವೇ ಮರುತೆರೆಯಲ್ಪಡುತ್ತದೆ.',
    modal_reopen_placeholder: 'ಉದಾ: ದೀಪ ೧೦ ನಿಮಿಷ ಬೆಳಗಿ ಮತ್ತೆ ಆರಿಹೋಯಿತು / ನೀರಿನ ಕವಾಟ ಇನ್ನೂ ಸೋರುತ್ತಿದೆ...',
    modal_track_title: 'ದೂರಿನ ಸಂಪೂರ್ಣ ವಿವರ ಮತ್ತು ಹಂತಗಳು',
    modal_work_title: 'ಕ್ಷೇತ್ರ ಸಿಬ್ಬಂದಿ ಕೆಲಸದ ಪ್ರಗತಿ ದಾಖಲಿಸುವಿಕೆ',
    modal_notifications_title: 'ಸಾರ್ವಜನಿಕ ಪ್ರಕಟಣೆಗಳು ಮತ್ತು ಸಂದೇಶಗಳು',
    modal_notifications_desc: 'ಗ್ರಾಮಸೇವಾ ವ್ಯವಸ್ಥೆಯಿಂದ ಕಳುಹಿಸಲಾದ ಪ್ರಮುಖ ಕಾಮಗಾರಿ ನವೀಕರಣಗಳು.',
    modal_no_notifications: 'ಪ್ರಸ್ತುತ ಯಾವುದೇ ಹೊಸ ಪ್ರಕಟಣೆಗಳಿಲ್ಲ.'
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('gramseva_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('gramseva_lang', lang);
  }, [lang]);

  function toggleLanguage() {
    setLang(prev => (prev === 'en' ? 'kn' : 'en'));
  }

  function t(key, fallback = '') {
    if (translations[lang] && translations[lang][key] !== undefined) {
      return translations[lang][key];
    }
    if (translations.en && translations.en[key] !== undefined) {
      return translations.en[key];
    }
    return fallback || key;
  }

  // Helper translators for dynamic database values
  function translateCategory(cat) {
    if (!cat) return '';
    const key = `cat_${cat}`;
    return t(key, cat.replace(/_/g, ' '));
  }

  function translateStatus(status) {
    if (!status) return '';
    const key = `status_${status}`;
    return t(key, status.replace(/_/g, ' '));
  }

  function translatePriority(priority) {
    if (!priority) return '';
    const key = `priority_${priority}`;
    return t(key, priority);
  }

  function translateWard(wardNameOrId) {
    if (!wardNameOrId) return '';
    if (wardNameOrId.includes('w-1') || wardNameOrId.includes('Ward 1')) return t('ward_w_1');
    if (wardNameOrId.includes('w-2') || wardNameOrId.includes('Ward 2')) return t('ward_w_2');
    if (wardNameOrId.includes('w-3') || wardNameOrId.includes('Ward 3')) return t('ward_w_3');
    if (wardNameOrId.includes('w-4') || wardNameOrId.includes('Ward 4')) return t('ward_w_4');
    return wardNameOrId;
  }

  function translateDept(deptName) {
    if (!deptName) return '';
    const lower = deptName.toLowerCase();
    if (lower.includes('streetlight')) return t('dept_streetlight');
    if (lower.includes('water')) return t('dept_water');
    if (lower.includes('sanitation') || lower.includes('waste')) return t('dept_sanitation');
    if (lower.includes('road') || lower.includes('pwd')) return t('dept_roads');
    return deptName;
  }

  function translateSource(source) {
    if (!source) return '';
    const key = `source_${source}`;
    return t(key, source.replace(/_/g, ' '));
  }

  return (
    <LanguageContext.Provider value={{ 
      lang, 
      setLang, 
      toggleLanguage, 
      t,
      translateCategory,
      translateStatus,
      translatePriority,
      translateWard,
      translateDept,
      translateSource
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
}
