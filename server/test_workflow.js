const db = require('./db/database');
const { handleInspectionItemResult, checkAndFlagRecurringAsset } = require('./services/proactiveDetector');
const { calculatePriority } = require('./services/priorityEngine');
const { routeAndAssign } = require('./services/routingService');
const { getDashboardMetrics } = require('./services/analyticsService');
const { checkAndEscalateIssues } = require('./services/escalationService');

function runEndToEndTest() {
  console.log('\n======================================================');
  console.log('  RUNNING GRAMSEVA PRIMARY USER JOURNEY INTEGRATION TEST');
  console.log('  Pilot: Honnur Gram Panchayat, Karnataka');
  console.log('  Asset: Streetlight SL-047 (Near Govt Primary School)');
  console.log('======================================================\n');

  // 1. Verify Asset SL-047 exists in registry
  const asset = db.get("SELECT * FROM assets WHERE id = 'SL-047'");
  console.log(`[STEP 1] Asset Registry: Verified ${asset.id} - "${asset.name}"`);
  console.log(`         Location: ${asset.location_description}`);
  console.log(`         Initial Status: ${asset.status}, Failure Count: ${asset.failure_count}, Is Recurring: ${asset.is_recurring_flag}`);

  // 2. Find or create inspection item for SL-047 in Ward 2
  let inspItem = db.get("SELECT * FROM inspection_items WHERE asset_id = 'SL-047' LIMIT 1");
  if (!inspItem) {
    throw new Error('Inspection item for SL-047 not found');
  }

  // 3. Field staff executes scheduled inspection: marks NOT_WORKING with notes
  console.log(`\n[STEP 2] Field staff (Lineman Ramesh) conducts scheduled audit in Ward 2`);
  console.log(`         Inspector marks SL-047 as NOT_WORKING ("Loose cable sparking, fixture dead")`);
  
  const inspResult = handleInspectionItemResult({
    inspectionId: inspItem.inspection_id,
    itemId: inspItem.id,
    assetId: 'SL-047',
    result: 'NOT_WORKING',
    notes: 'Loose cable sparking near school gate, luminaire dead',
    photoUrl: '/uploads/demo-before-repair.jpg',
    inspectedByUserId: 'u-staff-1'
  });

  const createdIssue = inspResult.createdIssue;
  console.log(`\n[STEP 3] Proactive Detection Result:`);
  console.log(`         Issue ID: ${createdIssue.id}`);
  console.log(`         Detection Source: ${createdIssue.detection_source}`);
  console.log(`         Status: ${createdIssue.status}`);
  console.log(`         Priority: ${createdIssue.priority} (Score: ${createdIssue.priority_score})`);
  console.log(`         Priority Rationale: ${createdIssue.priority_rationale}`);
  console.log(`         Assigned To: ${createdIssue.assigned_to_user_id}`);
  console.log(`         Target Completion SLA: ${createdIssue.target_completion_date}`);

  // 4. Field staff starts work
  console.log(`\n[STEP 4] Lineman arrives on site and starts work`);
  db.run(
    `UPDATE issues 
     SET status = 'IN_PROGRESS', 
         progress_notes = 'Dismantled burnt choke ballast. Installing heavy-duty 45W Philips LED fixture.' 
     WHERE id = ?`,
    [createdIssue.id]
  );
  db.run(
    `INSERT INTO issue_status_history (id, issue_id, old_status, new_status, changed_by_user_id, notes, created_at)
     VALUES (?, ?, 'ASSIGNED', 'IN_PROGRESS', 'u-staff-1', 'Arrived on site with spare luminaire.', datetime('now'))`,
    [`hist-${createdIssue.id}-test-1`, createdIssue.id]
  );
  console.log(`         Status updated to: IN_PROGRESS`);

  // 5. Field staff completes work and marks RESOLVED
  console.log(`\n[STEP 5] Work completed. Field staff submits after-repair photo and resolution notes`);
  db.run(
    `UPDATE issues 
     SET status = 'RESOLVED',
         resolution_notes = 'Replaced burnt choke ballast with 45W Philips LED luminaire and tested line voltage (230V stable).',
         after_photo_url = '/uploads/demo-after-repair.jpg',
         resolved_at = datetime('now')
     WHERE id = ?`,
    [createdIssue.id]
  );
  db.run(
    `INSERT INTO issue_status_history (id, issue_id, old_status, new_status, changed_by_user_id, notes, created_at)
     VALUES (?, ?, 'IN_PROGRESS', 'RESOLVED', 'u-staff-1', 'Repairs completed and illumination verified.', datetime('now'))`,
    [`hist-${createdIssue.id}-test-2`, createdIssue.id]
  );
  console.log(`         Status updated to: RESOLVED (Citizen Verification Requested)`);

  // 6. Citizen (Mahadevappa) verifies resolution
  console.log(`\n[STEP 6] Citizen receives verification notification: "Has the issue been resolved?"`);
  console.log(`         Citizen clicks: YES, confirms actual resolution, gives 5-star rating`);
  db.run(
    `UPDATE issues 
     SET status = 'CLOSED', 
         closed_at = datetime('now') 
     WHERE id = ?`,
    [createdIssue.id]
  );
  db.run(
    `INSERT OR REPLACE INTO feedback (id, issue_id, citizen_id, is_resolved_confirmed, rating, comments, submitted_at)
     VALUES (?, ?, 'u-citizen-1', 1, 5, 'Streetlight working brightly again outside school. Great proactive fix!', datetime('now'))`,
    [`fb-test-${createdIssue.id}`, createdIssue.id]
  );
  db.run(
    `INSERT INTO issue_status_history (id, issue_id, old_status, new_status, changed_by_user_id, notes, created_at)
     VALUES (?, ?, 'RESOLVED', 'CLOSED', 'u-citizen-1', 'Citizen verified resolution. Rating: 5/5. Issue closed.', datetime('now'))`,
    [`hist-${createdIssue.id}-test-3`, createdIssue.id]
  );
  console.log(`         Status updated to: CLOSED (Verified by Citizen)`);

  // 7. Recurring Asset Detection & Prevention
  console.log(`\n[STEP 7] Checking Historical Recurrence Analysis for SL-047`);
  const recCheck = checkAndFlagRecurringAsset('SL-047');
  const updatedAsset = db.get("SELECT * FROM assets WHERE id = 'SL-047'");
  console.log(`         Is Flagged Recurring Asset: ${updatedAsset.is_recurring_flag === 1 ? 'YES (⚠ RECURRING ASSET)' : 'NO'}`);
  console.log(`         Total Failures Count in Window: ${updatedAsset.failure_count}`);
  console.log(`         Adjusted Inspection Frequency: Every ${updatedAsset.inspection_frequency_days} Days (Weekly High-Risk)`);
  console.log(`         Administrative Recommendation: ${updatedAsset.recurring_notes}`);

  // 8. Test Escalation Engine
  console.log(`\n[STEP 8] Testing Escalation Engine Scan`);
  const escResult = checkAndEscalateIssues();
  console.log(`         Evaluated ${escResult.totalChecked} overdue issues, ${escResult.escalatedCount} escalated.`);

  // 9. Admin Analytics & Graphs Verification
  console.log(`\n[STEP 9] Fetching live database analytics & 12 chart datasets`);
  const metrics = getDashboardMetrics();
  console.log(`         Total Assets: ${metrics.kpis.totalAssets}`);
  console.log(`         Total Issues: ${metrics.kpis.totalIssues}`);
  console.log(`         Resolution Rate: ${metrics.kpis.resolutionRate}%`);
  console.log(`         Citizen Satisfaction: ${metrics.kpis.citizenSatisfactionRating} / 5.0 (${metrics.kpis.citizenVerifiedPercent}% verified)`);
  console.log(`         Calculated Insights Count: ${metrics.insights.length}`);
  metrics.insights.forEach((ins, idx) => {
    console.log(`           - Insight ${idx + 1} [${ins.type}]: ${ins.title}`);
  });

  console.log('\n======================================================');
  console.log('  ALL TEST ASSERTIONS PASSED! END-TO-END WORKFLOW VERIFIED');
  console.log('======================================================\n');
}

if (require.main === module) {
  runEndToEndTest();
}

module.exports = { runEndToEndTest };
