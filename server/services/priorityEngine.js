const db = require('../db/database');

/**
 * Transparent Rule-Based Priority Engine (Deterministic, No ML)
 * Calculates a priority score and level (CRITICAL, HIGH, MEDIUM, LOW)
 * and returns a human-readable breakdown of the rationale.
 */
function calculatePriority({
  category,
  locationText = '',
  landmark = '',
  assetId = null,
  asset = null,
  daysUnresolved = 0,
  isSafetyHazard = false
}) {
  let score = 20; // Baseline base score
  const rationaleFactors = ['+20 Baseline issue registration'];

  // 1. Fetch asset details if not provided
  if (assetId && !asset) {
    asset = db.get('SELECT * FROM assets WHERE id = ?', [assetId]);
  }

  const combinedLoc = `${locationText} ${landmark} ${asset ? asset.location_description + ' ' + asset.landmark : ''}`.toLowerCase();

  // 2. Sensitive Facility & Location Importance
  if (combinedLoc.includes('school') || combinedLoc.includes('vidyalaya') || combinedLoc.includes('shale')) {
    score += 30;
    rationaleFactors.push('+30 Near School / Child pedestrian zone');
  } else if (combinedLoc.includes('phc') || combinedLoc.includes('hospital') || combinedLoc.includes('clinic') || combinedLoc.includes('arogya')) {
    score += 30;
    rationaleFactors.push('+30 Near Primary Health Centre / Medical Facility');
  } else if (combinedLoc.includes('anganwadi')) {
    score += 25;
    rationaleFactors.push('+25 Near Anganwadi Centre');
  } else if (combinedLoc.includes('bus stand') || combinedLoc.includes('market') || combinedLoc.includes('shandy')) {
    score += 20;
    rationaleFactors.push('+20 High-density public transit / market area');
  } else if (combinedLoc.includes('temple') || combinedLoc.includes('kalyana mantapa')) {
    score += 15;
    rationaleFactors.push('+15 Near community gathering / temple zone');
  }

  // 3. Category & Critical Amenities
  if (category === 'WATER_POINT') {
    score += 25;
    rationaleFactors.push('+25 Essential drinking water amenity');
  } else if (category === 'DRAINAGE') {
    score += 20;
    rationaleFactors.push('+20 Sanitation & flood drainage risk');
  } else if (category === 'STREETLIGHT') {
    if (combinedLoc.includes('school') || combinedLoc.includes('cross') || combinedLoc.includes('junction')) {
      score += 20;
      rationaleFactors.push('+20 Nighttime pedestrian visibility & safety');
    } else {
      score += 10;
      rationaleFactors.push('+10 Public illumination');
    }
  } else if (category === 'ROAD') {
    score += 15;
    rationaleFactors.push('+15 Road connectivity & vehicular safety');
  }

  // 4. Asset Recurrence & Historical Failures
  if (asset) {
    if (asset.failure_count >= 3 || asset.is_recurring_flag === 1) {
      score += 25;
      rationaleFactors.push(`+25 Chronic recurring asset (${asset.failure_count} previous failures)`);
    } else if (asset.failure_count >= 1) {
      score += 10;
      rationaleFactors.push(`+10 Repeat failure on asset (${asset.failure_count} prior failure)`);
    }

    if (asset.risk_level === 'HIGH') {
      score += 15;
      rationaleFactors.push('+15 Designated High-Risk Public Asset');
    }
  }

  // 5. Safety Hazard Flag or Keywords
  const safetyKeywords = ['sparking', 'live wire', 'shock', 'contamination', 'overflow', 'overflowing', 'burst', 'deep pothole', 'hazard'];
  const hasSafetyKeyword = safetyKeywords.some(kw => combinedLoc.includes(kw));

  if (isSafetyHazard || hasSafetyKeyword) {
    score += 25;
    rationaleFactors.push('+25 Immediate public safety hazard');
  }

  // 6. Aging / Duration Unresolved
  if (daysUnresolved >= 7) {
    score += 25;
    rationaleFactors.push(`+25 Prolonged outage (${daysUnresolved} days unresolved)`);
  } else if (daysUnresolved >= 3) {
    score += 15;
    rationaleFactors.push(`+15 Unresolved for ${daysUnresolved} days`);
  }

  // 7. Map score to Priority Levels
  let priority = 'LOW';
  if (score >= 75) {
    priority = 'CRITICAL';
  } else if (score >= 50) {
    priority = 'HIGH';
  } else if (score >= 30) {
    priority = 'MEDIUM';
  } else {
    priority = 'LOW';
  }

  const rationale = `${rationaleFactors.join(', ')} [Score: ${score} → ${priority}]`;

  return {
    priority,
    score,
    rationale,
    factors: rationaleFactors
  };
}

module.exports = {
  calculatePriority
};
