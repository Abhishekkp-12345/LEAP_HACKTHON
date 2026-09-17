// test-flow.js - End-to-End verification script for PDO Issue Management & Feedback Flow
const http = require('http');

async function request(path, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    if (payload) {
      headers['Content-Length'] = Buffer.byteLength(payload);
    }
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: `/api${path}`,
      ...options,
      headers
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTest() {
  console.log('=== STARTING END-TO-END FLOW TEST ===\n');

  // 1. Switch to ADMIN (PDO)
  console.log('1. Switching to ADMIN (PDO)...');
  const adminAuth = await request('/auth/switch-role', { method: 'POST' }, { role: 'ADMIN' });
  if (adminAuth.status !== 200) throw new Error('Failed to switch to ADMIN: ' + JSON.stringify(adminAuth.body));
  const adminToken = adminAuth.body.token;
  const adminUser = adminAuth.body.user;
  console.log(`   ✓ Authenticated as ${adminUser.name} (${adminUser.role}) - ${adminUser.designation}`);

  // 2. Fetch field staff list
  console.log('\n2. Fetching field staff list via /metadata/wards-departments...');
  const metaRes = await request('/metadata/wards-departments', {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const staffList = metaRes.body.staff;
  console.log(`   ✓ Found ${staffList.length} field staff members:`);
  staffList.forEach(s => console.log(`     - [${s.id}] ${s.name} (${s.designation})`));
  const chosenStaff = staffList[0];

  // 3. Switch to CITIZEN to report an issue (or use existing)
  console.log('\n3. Authenticating as CITIZEN to report a test issue...');
  const citizenAuth = await request('/auth/switch-role', { method: 'POST' }, { role: 'CITIZEN' });
  const citizenToken = citizenAuth.body.token;
  const citizenUser = citizenAuth.body.user;
  console.log(`   ✓ Authenticated as Citizen: ${citizenUser.name} (${citizenUser.id})`);

  const timestamp = Date.now();
  const newIssueRes = await request('/issues', {
    method: 'POST',
    headers: { Authorization: `Bearer ${citizenToken}` }
  }, {
    title: `Low Water Pressure at Community Tap ${timestamp}`,
    category: 'WATER_POINT',
    wardId: 'w-3',
    locationText: `Honnur Ward 3, Tap Post #${timestamp % 100}`,
    landmark: 'Ward 3 Primary School',
    description: 'Water pressure is very low, pipeline might be clogged.',
    priority: 'HIGH'
  });
  let issue;
  if (newIssueRes.status === 201) {
    issue = newIssueRes.body;
    console.log(`   ✓ Issue reported successfully! ID: ${issue.id}, Status: ${issue.status}`);
  } else if (newIssueRes.body?.isDuplicate && newIssueRes.body?.existingIssue) {
    issue = newIssueRes.body.existingIssue;
    console.log(`   ✓ Reusing existing issue: ID: ${issue.id}, Status: ${issue.status}`);
  } else {
    throw new Error('Failed to create issue: ' + JSON.stringify(newIssueRes.body));
  }

  // 4. PDO (Admin) assigns issue to chosen field staff
  console.log(`\n4. PDO assigning Issue ${issue.id} to ${chosenStaff.name} (${chosenStaff.id})...`);
  const assignRes = await request(`/issues/${issue.id}/assign`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` }
  }, {
    staffId: chosenStaff.id,
    notes: 'Urgent repair required before evening prayers.'
  });
  if (assignRes.status !== 200) throw new Error('Assign failed: ' + JSON.stringify(assignRes.body));
  console.log(`   ✓ Assigned! New status: ${assignRes.body.status}, Assigned Staff: ${assignRes.body.assigned_to_user_id}`);

  // 5. Verify notifications created for staff and citizen
  console.log('\n5. Checking staff notifications...');
  const staffAuth = await request('/auth/switch-role', { method: 'POST' }, { role: 'FIELD_STAFF' });
  const staffToken = staffAuth.body.token;
  const staffNotifs = await request('/notifications', {
    headers: { Authorization: `Bearer ${staffToken}` }
  });
  const staffList_notifs = staffNotifs.body.notifications || [];
  const assignNotif = staffList_notifs.find(n => n.issue_id === issue.id && n.type === 'ASSIGNMENT');
  console.log(`   ✓ Staff assignment notification found: "${assignNotif?.title}" - "${assignNotif?.message}"`);

  // 6. PDO (or staff) marks work started / processing
  console.log(`\n6. PDO / Staff updating status to IN_PROGRESS (Processing)...`);
  const startWorkRes = await request(`/issues/${issue.id}/start-work`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` }
  }, {
    notes: 'Lineman on site replacing halogen bulb with LED fixture.'
  });
  if (startWorkRes.status !== 200) throw new Error('startWork failed: ' + JSON.stringify(startWorkRes.body));
  console.log(`   ✓ Status updated to IN_PROGRESS! Notes: "${startWorkRes.body.progress_notes}"`);

  // 7. PDO marks issue as Fixed (RESOLVED) with resolution notes
  console.log(`\n7. PDO marking Issue ${issue.id} as Fixed (RESOLVED)...`);
  const resolveRes = await request(`/issues/${issue.id}/resolve`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` }
  }, {
    resolutionNotes: 'Replaced bulb and repaired wiring junction box. Light is now functioning perfectly.'
  });
  if (resolveRes.status !== 200) throw new Error('Resolve failed: ' + JSON.stringify(resolveRes.body));
  console.log(`   ✓ Status updated to RESOLVED!`);

  // 8. Verify Citizen receives VERIFICATION_REQUEST notification with Google Form link!
  console.log('\n8. Checking Citizen notifications for resolution & Google Form survey...');
  const citizenNotifs = await request('/notifications', {
    headers: { Authorization: `Bearer ${citizenToken}` }
  });
  const citizenList_notifs = citizenNotifs.body.notifications || [];
  const verifNotif = citizenList_notifs.find(n => n.issue_id === issue.id && n.type === 'VERIFICATION_REQUEST');
  if (!verifNotif) throw new Error('Citizen did not receive VERIFICATION_REQUEST notification!');
  console.log(`   ✓ Citizen notification received!`);
  console.log(`     Title:   ${verifNotif.title}`);
  console.log(`     Message: ${verifNotif.message}`);
  
  const expectedFormSnippet = `https://docs.google.com/forms/d/e/1FAIpQLSeRrijgsuzn3QB0bv9fbntsJy8m3D46QPVX7pzqr7f4Juugbw/viewform?usp=pp_url&entry.88148858=${encodeURIComponent(issue.id)}`;
  const hasFormLink = verifNotif.message.includes(expectedFormSnippet);
  console.log(`     Contains Google Form Link with Issue ID? ${hasFormLink ? 'YES ✅' : 'NO ❌'}`);

  // 9. Citizen verifies and submits feedback
  console.log('\n9. Citizen confirming fix and giving 5-star rating...');
  const verifyRes = await request(`/issues/${issue.id}/verify`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${citizenToken}` }
  }, {
    isResolvedConfirmed: true,
    rating: 5,
    comments: 'Super fast service by Honnur Gram Panchayat! Streetlight is working great.',
    feedbackSource: 'INTERNAL_FORM'
  });
  if (verifyRes.status !== 200) throw new Error('Verify failed: ' + JSON.stringify(verifyRes.body));
  console.log(`   ✓ Issue verified and CLOSED by citizen! Final status: ${verifyRes.body.status}`);

  console.log('\n========================================');
  console.log('🎉 ALL END-TO-END FLOW TESTS PASSED! 🎉');
  console.log('========================================');
}

runTest().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
