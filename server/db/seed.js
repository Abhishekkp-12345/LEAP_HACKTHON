const db = require('./database');
const bcrypt = require('bcryptjs');

function seedDatabase() {
  console.log('Seeding GramSeva database for Honnur Gram Panchayat...');
  db.initSchema();

  const passwordHash = bcrypt.hashSync('demo123', 10);

  db.transaction(() => {
    // 1. Village
    db.run(
      `INSERT OR REPLACE INTO villages (id, name, taluk, district, pin_code, gp_name)
       VALUES (?, ?, ?, ?, ?, ?)`,
      ['v-honnur', 'Honnur', 'Nagamangala', 'Mandya', '571432', 'Honnur Gram Panchayat']
    );

    // 2. Wards
    const wards = [
      { id: 'w-1', num: 1, name: 'Ward 1 - Kote & Temple Area', rep: 'Somanna Gowda' },
      { id: 'w-2', num: 2, name: 'Ward 2 - School & PHC Ward', rep: 'Shivalingaiah' },
      { id: 'w-3', num: 3, name: 'Ward 3 - Market & Bus Stop', rep: 'Anitha Venkatesh' },
      { id: 'w-4', num: 4, name: 'Ward 4 - Colony & Lake Extension', rep: 'Manjunatha K' }
    ];

    for (const w of wards) {
      db.run(
        `INSERT OR REPLACE INTO wards (id, village_id, ward_number, name, representative_name)
         VALUES (?, ?, ?, ?, ?)`,
        [w.id, 'v-honnur', w.num, w.name, w.rep]
      );
    }

    // 3. Departments
    const departments = [
      {
        id: 'dept-streetlight',
        code: 'STREETLIGHT',
        name: 'Streetlight Maintenance Team',
        head: 'S. Nanjappa (Assistant Engineer, Electrical)',
        critical: 24, high: 48, med: 120, low: 240
      },
      {
        id: 'dept-water',
        code: 'WATER_SUPPLY',
        name: 'Rural Water Supply & Sanitation (RWSS)',
        head: 'K. R. Vasanth (Junior Engineer, Water Works)',
        critical: 12, high: 36, med: 96, low: 168
      },
      {
        id: 'dept-sanitation',
        code: 'DRAINAGE_SANITATION',
        name: 'Gram Sanitation & Solid Waste Team',
        head: 'B. Puttegowda (Sanitation Officer)',
        critical: 18, high: 48, med: 72, low: 120
      },
      {
        id: 'dept-roads',
        code: 'ROADS_INFRA',
        name: 'Rural Infrastructure & PWD Cell',
        head: 'H. Manjunath (Section Officer, PWD)',
        critical: 48, high: 96, med: 168, low: 360
      }
    ];

    for (const d of departments) {
      db.run(
        `INSERT OR REPLACE INTO departments (id, code, name, head_name, sla_hours_critical, sla_hours_high, sla_hours_medium, sla_hours_low)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [d.id, d.code, d.name, d.head, d.critical, d.high, d.med, d.low]
      );
    }

    // 4. Users (Citizen, Field Staff, Admin)
    const users = [
      {
        id: 'u-admin-1',
        name: 'K. Shivakumar',
        email: 'admin@gramseva.kar.gov.in',
        phone: '9448011223',
        role: 'ADMIN',
        designation: 'Panchayat Development Officer (PDO)',
        wardId: null
      },
      {
        id: 'u-staff-1',
        name: 'Ramesh Kumar',
        email: 'lineman.ramesh@gramseva.kar.gov.in',
        phone: '9845011122',
        role: 'FIELD_STAFF',
        designation: 'Panchayat Lineman & Electrical Inspector',
        wardId: 'w-2'
      },
      {
        id: 'u-staff-2',
        name: 'Suresh Gowda',
        email: 'water.suresh@gramseva.kar.gov.in',
        phone: '9845022233',
        role: 'FIELD_STAFF',
        designation: 'RWSS Water Works Assistant',
        wardId: 'w-3'
      },
      {
        id: 'u-staff-3',
        name: 'Basavaraj B',
        email: 'sanitation.basavaraj@gramseva.kar.gov.in',
        phone: '9845033344',
        role: 'FIELD_STAFF',
        designation: 'Gram Sanitation Supervisor',
        wardId: 'w-1'
      },
      {
        id: 'u-citizen-1',
        name: 'Mahadevappa Gowda',
        email: 'mahadevappa@gmail.com',
        phone: '9845055667',
        role: 'CITIZEN',
        designation: 'Farmer & Resident',
        wardId: 'w-2'
      },
      {
        id: 'u-citizen-2',
        name: 'Lakshmi Bai',
        email: 'lakshmi.k@gmail.com',
        phone: '9845066778',
        role: 'CITIZEN',
        designation: 'Self Help Group Leader',
        wardId: 'w-3'
      },
      {
        id: 'u-citizen-3',
        name: 'Chandrashekhar H',
        email: 'chandru@gmail.com',
        phone: '9845077889',
        role: 'CITIZEN',
        designation: 'Resident',
        wardId: 'w-1'
      }
    ];

    for (const u of users) {
      db.run(
        `INSERT OR REPLACE INTO users (id, name, email, phone, password_hash, role, designation, ward_id, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [u.id, u.name, u.email, u.phone, passwordHash, u.role, u.designation, u.wardId]
      );
    }

    // 5. Assets Registry (including SL-047 near Govt School)
    const assets = [
      {
        id: 'SL-047',
        wardId: 'w-2',
        deptId: 'dept-streetlight',
        type: 'STREETLIGHT',
        name: 'Streetlight Pole SL-047 (School Cross)',
        loc: 'Ward 2, Main Cross Road, 20m from Government Higher Primary School Gate',
        landmark: 'Govt Higher Primary School Gate',
        lat: 12.8234, lng: 76.7541,
        status: 'WORKING',
        risk: 'HIGH',
        freq: 7,
        failures: 4,
        isRecurring: 1,
        recNotes: 'Chronic ballast failure and wire sparking. 4 failures recorded in past 60 days near school feeder.'
      },
      {
        id: 'SL-012',
        wardId: 'w-1',
        deptId: 'dept-streetlight',
        type: 'STREETLIGHT',
        name: 'Streetlight Pole SL-012 (Kote Temple Gate)',
        loc: 'Ward 1, Sri Ranganatha Swamy Temple entrance',
        landmark: 'Temple Arch',
        lat: 12.8211, lng: 76.7512,
        status: 'WORKING',
        risk: 'MEDIUM',
        freq: 14,
        failures: 1,
        isRecurring: 0,
        recNotes: null
      },
      {
        id: 'SL-025',
        wardId: 'w-3',
        deptId: 'dept-streetlight',
        type: 'STREETLIGHT',
        name: 'Streetlight Pole SL-025 (Bus Stand Junction)',
        loc: 'Ward 3, Honnur Main Bus Stop & Shandy Ground road',
        landmark: 'Gram Panchayat Notice Board',
        lat: 12.8256, lng: 76.7567,
        status: 'WORKING',
        risk: 'HIGH',
        freq: 7,
        failures: 2,
        isRecurring: 0,
        recNotes: null
      },
      {
        id: 'SL-038',
        wardId: 'w-4',
        deptId: 'dept-streetlight',
        type: 'STREETLIGHT',
        name: 'Streetlight Pole SL-038 (Lake Bund Curve)',
        loc: 'Ward 4, Honnur Kere (Lake) Bund Approach Road',
        landmark: 'Lake Sluice Gate',
        lat: 12.8289, lng: 76.7591,
        status: 'NEEDS_ATTENTION',
        risk: 'MEDIUM',
        freq: 14,
        failures: 3,
        isRecurring: 1,
        recNotes: 'Tree branch brushing overhead cable during wind.'
      },
      {
        id: 'SL-019',
        wardId: 'w-2',
        deptId: 'dept-streetlight',
        type: 'STREETLIGHT',
        name: 'Streetlight Pole SL-019 (Primary Health Centre Road)',
        loc: 'Ward 2, 50m west of Primary Health Centre',
        landmark: 'PHC Staff Quarters',
        lat: 12.8242, lng: 76.7535,
        status: 'WORKING',
        risk: 'HIGH',
        freq: 7,
        failures: 0,
        isRecurring: 0,
        recNotes: null
      },
      {
        id: 'WT-001',
        wardId: 'w-3',
        deptId: 'dept-water',
        type: 'WATER_POINT',
        name: 'Shuddha Neeru RO Drinking Water Unit WT-001',
        loc: 'Ward 3, Opposite Gram Panchayat Office, Market Square',
        landmark: 'GP Office Complex',
        lat: 12.8252, lng: 76.7558,
        status: 'WORKING',
        risk: 'HIGH',
        freq: 7,
        failures: 3,
        isRecurring: 1,
        recNotes: 'Membrane clogging due to heavy mineral sediment from borewell 2.'
      },
      {
        id: 'WT-002',
        wardId: 'w-1',
        deptId: 'dept-water',
        type: 'WATER_POINT',
        name: 'Community Tap Standpost WT-002 (Kote Corner)',
        loc: 'Ward 1, Near Someshwara Temple Well',
        landmark: 'Someshwara Temple Well',
        lat: 12.8205, lng: 76.7508,
        status: 'WORKING',
        risk: 'MEDIUM',
        freq: 14,
        failures: 1,
        isRecurring: 0,
        recNotes: null
      },
      {
        id: 'WT-003',
        wardId: 'w-2',
        deptId: 'dept-water',
        type: 'WATER_POINT',
        name: 'Anganwadi Water Cistern WT-003',
        loc: 'Ward 2, Behind Anganwadi Center No. 2',
        landmark: 'Anganwadi Center 2',
        lat: 12.8229, lng: 76.7548,
        status: 'WORKING',
        risk: 'HIGH',
        freq: 7,
        failures: 0,
        isRecurring: 0,
        recNotes: null
      },
      {
        id: 'WT-004',
        wardId: 'w-4',
        deptId: 'dept-water',
        type: 'WATER_POINT',
        name: 'Overhead Tank Pump House WT-004',
        loc: 'Ward 4, High Ground Tank Road',
        landmark: '50,000 Litre Overhead Tank',
        lat: 12.8295, lng: 76.7612,
        status: 'WORKING',
        risk: 'HIGH',
        freq: 7,
        failures: 1,
        isRecurring: 0,
        recNotes: null
      },
      {
        id: 'PT-001',
        wardId: 'w-3',
        deptId: 'dept-sanitation',
        type: 'PUBLIC_TOILET',
        name: 'Community Toilet Complex PT-001 (Bus Stand)',
        loc: 'Ward 3, Honnur Bus Stand Compound',
        landmark: 'KSRTC Bus Shelter',
        lat: 12.8258, lng: 76.7571,
        status: 'WORKING',
        risk: 'HIGH',
        freq: 7,
        failures: 2,
        isRecurring: 0,
        recNotes: null
      },
      {
        id: 'PT-002',
        wardId: 'w-4',
        deptId: 'dept-sanitation',
        type: 'PUBLIC_TOILET',
        name: 'Public Sanitation Block PT-002 (Colony)',
        loc: 'Ward 4, Dr. B.R. Ambedkar Colony Center',
        landmark: 'Community Hall',
        lat: 12.8278, lng: 76.7584,
        status: 'WORKING',
        risk: 'MEDIUM',
        freq: 14,
        failures: 1,
        isRecurring: 0,
        recNotes: null
      },
      {
        id: 'RD-001',
        wardId: 'w-3',
        deptId: 'dept-roads',
        type: 'ROAD',
        name: 'Honnur - Nagamangala Main Approach Road RD-001',
        loc: 'Ward 3, Starting at GP boundary up to Bus Stand (1.2 km)',
        landmark: 'Village Welcome Arch',
        lat: 12.8262, lng: 76.7585,
        status: 'WORKING',
        risk: 'MEDIUM',
        freq: 30,
        failures: 2,
        isRecurring: 0,
        recNotes: null
      },
      {
        id: 'RD-002',
        wardId: 'w-2',
        deptId: 'dept-roads',
        type: 'ROAD',
        name: 'Government School Connecting Road RD-002',
        loc: 'Ward 2, Paved road from temple junction to Govt School gate',
        landmark: 'Govt Higher Primary School',
        lat: 12.8232, lng: 76.7538,
        status: 'WORKING',
        risk: 'HIGH',
        freq: 14,
        failures: 1,
        isRecurring: 0,
        recNotes: null
      },
      {
        id: 'DR-001',
        wardId: 'w-3',
        deptId: 'dept-sanitation',
        type: 'DRAINAGE',
        name: 'Main Market Covered Storm Drain DR-001',
        loc: 'Ward 3, Along shandy market shops to south culvert',
        landmark: 'Market Shandy Sheds',
        lat: 12.8251, lng: 76.7562,
        status: 'WORKING',
        risk: 'HIGH',
        freq: 7,
        failures: 2,
        isRecurring: 0,
        recNotes: null
      },
      {
        id: 'DR-002',
        wardId: 'w-2',
        deptId: 'dept-sanitation',
        type: 'DRAINAGE',
        name: 'Masonry Side Drain DR-002 (School Lane)',
        loc: 'Ward 2, Open masonry drainage beside school road',
        landmark: 'Near School playground corner',
        lat: 12.8236, lng: 76.7543,
        status: 'WORKING',
        risk: 'HIGH',
        freq: 7,
        failures: 3,
        isRecurring: 1,
        recNotes: 'Plastic packaging from local stalls causing repeated blockages.'
      },
      {
        id: 'DR-003',
        wardId: 'w-4',
        deptId: 'dept-sanitation',
        type: 'DRAINAGE',
        name: 'Lake Outfall Drainage Channel DR-003',
        loc: 'Ward 4, North channel draining into Honnur lake',
        landmark: 'Lake Inlet Sluice',
        lat: 12.8291, lng: 76.7598,
        status: 'WORKING',
        risk: 'MEDIUM',
        freq: 14,
        failures: 0,
        isRecurring: 0,
        recNotes: null
      }
    ];

    for (const a of assets) {
      db.run(
        `INSERT OR REPLACE INTO assets (
          id, village_id, ward_id, department_id, asset_type, name,
          location_description, landmark, latitude, longitude,
          status, risk_level, inspection_frequency_days,
          last_inspection_date, next_inspection_date,
          failure_count, is_recurring_flag, recurring_notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '-3 days'), datetime('now', '+4 days'), ?, ?, ?)`,
        [
          a.id, 'v-honnur', a.wardId, a.deptId, a.type, a.name,
          a.loc, a.landmark, a.lat, a.lng,
          a.status, a.risk, a.freq,
          a.failures, a.isRecurring, a.recNotes
        ]
      );
    }

    // 6. Pre-seeded Issues
    const issues = [
      {
        id: 'GS-2026-1002',
        assetId: 'SL-047',
        wardId: 'w-2',
        deptId: 'dept-streetlight',
        reporterId: 'u-citizen-1',
        source: 'CITIZEN_REPORT',
        title: 'Streetlight SL-047 bulb burnt out near school',
        desc: 'Streetlight bulb has fused completely. Area is dark after 7 PM.',
        cat: 'STREETLIGHT',
        loc: 'Ward 2, Main Cross Road, 20m from Government Higher Primary School Gate',
        landmark: 'Govt Higher Primary School Gate',
        lat: 12.8234, lng: 76.7541,
        priority: 'HIGH', score: 65,
        rationale: '+30 Near Govt School, +20 Total outage in pedestrian path, +15 Prior failure record',
        status: 'CLOSED',
        targetDate: "datetime('now', '-45 days')",
        assignedId: 'u-staff-1',
        progNotes: 'Replaced 45W LED bulb fixture and tested circuit.',
        resNotes: 'LED bulb replaced with standard Philips 45W luminaire. Tested working.',
        escLevel: 0,
        createdAt: "datetime('now', '-50 days')",
        resolvedAt: "datetime('now', '-47 days')",
        closedAt: "datetime('now', '-46 days')"
      },
      {
        id: 'GS-2026-1015',
        assetId: 'SL-047',
        wardId: 'w-2',
        deptId: 'dept-streetlight',
        reporterId: 'u-staff-1',
        source: 'SCHEDULED_INSPECTION',
        title: 'SL-047 loose jumper sparking in breeze',
        desc: 'Field inspection revealed jumper wire sparking at terminal block.',
        cat: 'STREETLIGHT',
        loc: 'Ward 2, Main Cross Road near School Gate',
        landmark: 'Govt School Gate',
        lat: 12.8234, lng: 76.7541,
        priority: 'HIGH', score: 70,
        rationale: '+30 Near School, +25 Electrical Sparking Hazard, +15 Recurring asset',
        status: 'CLOSED',
        targetDate: "datetime('now', '-30 days')",
        assignedId: 'u-staff-1',
        progNotes: 'Tightened terminal screws and wrapped waterproof heat shrink sleeve.',
        resNotes: 'Terminal joint cleaned, re-crimped and insulated.',
        escLevel: 0,
        createdAt: "datetime('now', '-35 days')",
        resolvedAt: "datetime('now', '-32 days')",
        closedAt: "datetime('now', '-31 days')"
      },
      {
        id: 'GS-2026-1028',
        assetId: 'SL-047',
        wardId: 'w-2',
        deptId: 'dept-streetlight',
        reporterId: 'u-citizen-1',
        source: 'COMMUNITY_OBSERVATION',
        title: 'SL-047 flickering violently and shutting off',
        desc: 'Light flickers for 5 minutes when switched on then trips breaker.',
        cat: 'STREETLIGHT',
        loc: 'Ward 2, School Road Gate',
        landmark: 'Govt School Gate',
        lat: 12.8234, lng: 76.7541,
        priority: 'HIGH', score: 75,
        rationale: '+30 Near School, +25 Recurring 3rd failure in 45 days, +20 Electrical instability',
        status: 'CLOSED',
        targetDate: "datetime('now', '-14 days')",
        assignedId: 'u-staff-1',
        progNotes: 'Swapped capacitor in luminaire control gear.',
        resNotes: 'Capacitor replaced. System stable for now.',
        escLevel: 0,
        createdAt: "datetime('now', '-18 days')",
        resolvedAt: "datetime('now', '-16 days')",
        closedAt: "datetime('now', '-15 days')"
      },
      {
        id: 'GS-2026-1035',
        assetId: 'WT-002',
        wardId: 'w-1',
        deptId: 'dept-water',
        reporterId: 'u-citizen-3',
        source: 'CITIZEN_REPORT',
        title: 'Drinking water standpost brass valve broken',
        desc: 'Continuous clean water wastage at temple corner standpost. Brass tap valve sheared off.',
        cat: 'WATER_POINT',
        loc: 'Ward 1, Near Someshwara Temple Well',
        landmark: 'Someshwara Temple Well',
        lat: 12.8205, lng: 76.7508,
        priority: 'HIGH', score: 60,
        rationale: '+30 Potable water wastage, +20 Public amenity, +10 Ward 1 high traffic',
        status: 'IN_PROGRESS',
        targetDate: "datetime('now', '+1 day')",
        assignedId: 'u-staff-2',
        progNotes: 'Procured 1-inch heavy duty brass bib cock from taluk depot. Arriving on site.',
        resNotes: null,
        escLevel: 0,
        createdAt: "datetime('now', '-1 day')",
        resolvedAt: null,
        closedAt: null
      },
      {
        id: 'GS-2026-1020',
        assetId: 'DR-001',
        wardId: 'w-3',
        deptId: 'dept-sanitation',
        reporterId: 'u-citizen-2',
        source: 'COMMUNITY_OBSERVATION',
        title: 'Market main drain silt overflow near shandy gate',
        desc: 'Heavy vegetable waste and silt blocking culvert. Foul smell and water spilling onto road.',
        cat: 'DRAINAGE',
        loc: 'Ward 3, Honnur Bus Stand Shandy Road',
        landmark: 'Market Shandy Sheds',
        lat: 12.8251, lng: 76.7562,
        priority: 'CRITICAL', score: 85,
        rationale: '+35 Sanitation hazard, +30 Public market zone, +20 Overdue past 48h SLA',
        status: 'ESCALATED',
        targetDate: "datetime('now', '-2 days')",
        assignedId: 'u-staff-3',
        progNotes: 'Manual cleaning started. Additional excavator suction pump requested from Taluk.',
        resNotes: null,
        escLevel: 2,
        createdAt: "datetime('now', '-5 days')",
        resolvedAt: null,
        closedAt: null
      },
      {
        id: 'GS-2026-1039',
        assetId: 'PT-001',
        wardId: 'w-3',
        deptId: 'dept-sanitation',
        reporterId: 'u-citizen-2',
        source: 'SCHEDULED_INSPECTION',
        title: 'Broken flush pipe repaired in bus stand toilet',
        desc: 'Flush pipe cracked causing low water pressure in ladies cubicle.',
        cat: 'PUBLIC_TOILET',
        loc: 'Ward 3, Bus Stand Compound',
        landmark: 'Bus Shelter',
        lat: 12.8258, lng: 76.7571,
        priority: 'MEDIUM', score: 45,
        rationale: '+25 Public sanitation amenity, +20 Bus stand transit zone',
        status: 'CITIZEN_VERIFICATION',
        targetDate: "datetime('now', '+2 days')",
        assignedId: 'u-staff-3',
        progNotes: 'Replaced CPVC connector pipe and verified 3.5 bar water flow.',
        resNotes: 'Repaired CPVC flush pipe and sealed joints with Teflon. Cleaned area.',
        escLevel: 0,
        createdAt: "datetime('now', '-3 days')",
        resolvedAt: "datetime('now', '-4 hours')",
        closedAt: null
      },
      {
        id: 'GS-2026-1041',
        assetId: 'RD-002',
        wardId: 'w-2',
        deptId: 'dept-roads',
        reporterId: 'u-citizen-1',
        source: 'CITIZEN_REPORT',
        title: 'Deep crater on school road approach culvert',
        desc: 'Bicycles and school vans skidding due to loose aggregate and deep pothole.',
        cat: 'ROAD',
        loc: 'Ward 2, 30m before school arch',
        landmark: 'Govt School Arch',
        lat: 12.8232, lng: 76.7538,
        priority: 'HIGH', score: 65,
        rationale: '+30 Near School transit path, +20 Vehicle skidding risk, +15 School van route',
        status: 'ASSIGNED',
        targetDate: "datetime('now', '+3 days')",
        assignedId: 'u-staff-3',
        progNotes: null,
        resNotes: null,
        escLevel: 0,
        createdAt: "datetime('now', '-18 hours')",
        resolvedAt: null,
        closedAt: null
      }
    ];

    for (const iss of issues) {
      db.run(
        `INSERT OR REPLACE INTO issues (
          id, asset_id, ward_id, department_id, reported_by_user_id,
          detection_source, title, description, category, location_text,
          landmark, latitude, longitude, priority, priority_score, priority_rationale,
          status, target_completion_date, assigned_to_user_id,
          progress_notes, resolution_notes, escalation_level, escalation_history,
          created_at, resolved_at, closed_at
        ) VALUES (
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?,
          ?, ${iss.targetDate}, ?,
          ?, ?, ?, ?,
          ${iss.createdAt}, ${iss.resolvedAt || 'NULL'}, ${iss.closedAt || 'NULL'}
        )`,
        [
          iss.id, iss.assetId, iss.wardId, iss.deptId, iss.reporterId,
          iss.source, iss.title, iss.desc, iss.cat, iss.loc,
          iss.landmark, iss.lat, iss.lng, iss.priority, iss.score, iss.rationale,
          iss.status, iss.assignedId,
          iss.progNotes, iss.resNotes, iss.escLevel,
          iss.escLevel > 0 ? JSON.stringify([{ level: 1, date: new Date().toISOString(), authority: 'Ramesh Kumar' }, { level: 2, date: new Date().toISOString(), authority: 'K. Shivakumar (PDO)' }]) : null
        ]
      );

      db.run(
        `INSERT INTO issue_status_history (id, issue_id, old_status, new_status, changed_by_user_id, notes, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ${iss.createdAt})`,
        ['hist-' + iss.id + '-1', iss.id, null, 'REPORTED', iss.reporterId, 'Issue detected and registered in GramSeva']
      );

      if (iss.status !== 'REPORTED') {
        db.run(
          `INSERT INTO issue_status_history (id, issue_id, old_status, new_status, changed_by_user_id, notes, created_at)
           VALUES (?, ?, ?, ?, ?, ?, datetime('now', '-2 days'))`,
          ['hist-' + iss.id + '-2', iss.id, 'REPORTED', iss.status, iss.assignedId || 'u-admin-1', 'Current operational stage']
        );
      }
    }

    // 7. Feedback records
    db.run(
      `INSERT OR REPLACE INTO feedback (id, issue_id, citizen_id, is_resolved_confirmed, rating, comments, feedback_source, submitted_at)
       VALUES (?, ?, ?, 1, 5, 'Quickly fixed before children arrived for morning school assembly. Great promptness!', 'INTERNAL_FORM', datetime('now', '-46 days'))`,
      ['fb-1002', 'GS-2026-1002', 'u-citizen-1']
    );
    db.run(
      `INSERT OR REPLACE INTO feedback (id, issue_id, citizen_id, is_resolved_confirmed, rating, comments, feedback_source, submitted_at)
       VALUES (?, ?, ?, 1, 4, 'Insulation fixed. No more sparking at night.', 'INTERNAL_FORM', datetime('now', '-31 days'))`,
      ['fb-1015', 'GS-2026-1015', 'u-citizen-1']
    );
    db.run(
      `INSERT OR REPLACE INTO feedback (id, issue_id, citizen_id, is_resolved_confirmed, rating, comments, feedback_source, submitted_at)
       VALUES (?, ?, ?, 1, 4, 'Capacitor changed and light is working. Hope it lasts this time.', 'INTERNAL_FORM', datetime('now', '-15 days'))`,
      ['fb-1028', 'GS-2026-1028', 'u-citizen-1']
    );

    // 8. Scheduled Inspections
    db.run(
      `INSERT OR REPLACE INTO inspections (id, ward_id, assigned_to_user_id, schedule_date, status, notes, total_assets_checked, issues_detected_count)
       VALUES (?, ?, ?, date('now'), 'IN_PROGRESS', 'Ward 2 Weekly Scheduled Infrastructure Audit - Focus on School & PHC corridor', 2, 0)`,
      ['insp-w2-today', 'w-2', 'u-staff-1']
    );

    const inspItems = [
      { id: 'ii-1', inspId: 'insp-w2-today', assetId: 'SL-019', result: 'WORKING', notes: 'Pole secure, LED illuminated during test' },
      { id: 'ii-2', inspId: 'insp-w2-today', assetId: 'WT-003', result: 'WORKING', notes: 'Cistern clean and filled, no leakage' },
      { id: 'ii-3', inspId: 'insp-w2-today', assetId: 'SL-047', result: 'PENDING', notes: null }, // READY FOR DEMO!
      { id: 'ii-4', inspId: 'insp-w2-today', assetId: 'DR-002', result: 'PENDING', notes: null },
      { id: 'ii-5', inspId: 'insp-w2-today', assetId: 'RD-002', result: 'PENDING', notes: null }
    ];

    for (const item of inspItems) {
      db.run(
        `INSERT OR REPLACE INTO inspection_items (id, inspection_id, asset_id, result, notes, inspected_at)
         VALUES (?, ?, ?, ?, ?, ${item.result !== 'PENDING' ? "datetime('now', '-1 hour')" : 'NULL'})`,
        [item.id, item.inspId, item.assetId, item.result, item.notes]
      );
    }

    // 9. Meaningful Notifications
    const notifs = [
      {
        id: 'n-1',
        userId: 'u-citizen-1',
        issueId: 'GS-2026-1041',
        title: 'GramSeva – Update for Issue GS-2026-1041',
        msg: 'Your reported road crater issue on School Road has been verified and assigned to Rural Infrastructure Cell.',
        type: 'ASSIGNMENT'
      },
      {
        id: 'n-2',
        userId: 'u-citizen-2',
        issueId: 'GS-2026-1039',
        title: 'GramSeva – Verification Requested for GS-2026-1039',
        msg: 'The toilet flush repair at Bus Stand has been marked resolved. Please confirm whether the issue is actually fixed.',
        type: 'VERIFICATION_REQUEST'
      },
      {
        id: 'n-3',
        userId: 'u-staff-1',
        issueId: null,
        title: 'Scheduled Inspection Assigned',
        msg: 'You have been assigned the weekly inspection checklist for Ward 2 (School & PHC corridor) today.',
        type: 'ASSIGNMENT'
      },
      {
        id: 'n-4',
        userId: 'u-admin-1',
        issueId: 'GS-2026-1020',
        title: 'Level 2 Escalation: Overdue Drainage Issue',
        msg: 'Market main drain issue GS-2026-1020 has exceeded 48h SLA and escalated to Panchayat Development Officer.',
        type: 'ESCALATION'
      },
      {
        id: 'n-5',
        userId: 'u-admin-1',
        issueId: null,
        title: 'Proactive Alert: Recurring Asset Detected',
        msg: 'Streetlight SL-047 near Govt Primary School has reached 4 historical failures. High inspection frequency active.',
        type: 'RECURRING_ALERT'
      }
    ];

    for (const n of notifs) {
      db.run(
        `INSERT OR REPLACE INTO notifications (id, user_id, issue_id, title, message, type, is_read, email_sent)
         VALUES (?, ?, ?, ?, ?, ?, 0, 1)`,
        [n.id, n.userId, n.issueId, n.title, n.msg, n.type]
      );
    }

    // 10. System Configuration
    const configs = [
      { key: 'PILOT_VILLAGE_NAME', val: 'Honnur', desc: 'Active pilot village' },
      { key: 'PILOT_GP_NAME', val: 'Honnur Gram Panchayat', desc: 'Panchayat Name' },
      { key: 'GOOGLE_FEEDBACK_FORM_URL', val: 'https://docs.google.com/forms/d/e/1FAIpQLScDemoGramSevaFeedback/viewform?usp=pp_url&entry.1024={ISSUE_ID}', desc: 'Configurable Google Form feedback URL with pre-filled parameter' },
      { key: 'RECURRING_FAILURE_THRESHOLD', val: '3', desc: 'Number of failures within window to flag recurring asset' },
      { key: 'RECURRING_WINDOW_DAYS', val: '60', desc: 'Lookback window in days for recurring failures' },
      { key: 'AUTO_ESCALATION_ENABLED', val: 'true', desc: 'Automatically escalate overdue issues based on SLA' },
      { key: 'HIGH_RISK_INSPECTION_DAYS', val: '7', desc: 'Default inspection interval for high risk assets' },
      { key: 'MED_RISK_INSPECTION_DAYS', val: '14', desc: 'Default inspection interval for medium risk assets' },
      { key: 'LOW_RISK_INSPECTION_DAYS', val: '30', desc: 'Default inspection interval for low risk assets' }
    ];

    for (const c of configs) {
      db.run(
        `INSERT OR REPLACE INTO system_config (key, value, description)
         VALUES (?, ?, ?)`,
        [c.key, c.val, c.desc]
      );
    }
  });

  console.log('Database seeded successfully for Honnur Gram Panchayat!');
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
