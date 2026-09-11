const express = require('express');
const cors = require('cors');
const path = require('node:path');
const fs = require('node:fs');
const config = require('./config');
const db = require('./db/database');
const { seedDatabase } = require('./db/seed');
const apiRoutes = require('./routes/api');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(config.UPLOAD_DIR));

// Initialize DB schema & seed if empty
try {
  db.initSchema();
  const assetCount = db.get('SELECT count(*) as count FROM assets');
  if (!assetCount || assetCount.count === 0) {
    console.log('Database empty, auto-seeding initial Honnur GP dataset...');
    seedDatabase();
  }
} catch (e) {
  console.log('Database setup error, running seed:', e);
  seedDatabase();
}

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'GramSeva',
    version: '1.0.0',
    pilot: 'Honnur Gram Panchayat, Mandya District, Karnataka',
    timestamp: new Date().toISOString()
  });
});

app.use('/api', apiRoutes);

// Serve built frontend if available
const CLIENT_DIST = path.join(__dirname, '../client/dist');
if (fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      return res.sendFile(path.join(CLIENT_DIST, 'index.html'));
    }
    next();
  });
}

app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    error: err.message || 'Internal Server Error',
    status: 500
  });
});

const PORT = config.PORT;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`  GRAMSEVA BACKEND SERVER RUNNING ON PORT ${PORT}`);
    console.log(`  Pilot: Honnur Gram Panchayat, Karnataka`);
    console.log(`  Operating Mode: Proactive Infrastructure Monitoring`);
    console.log(`  Portal URL: http://localhost:${PORT}`);
    console.log(`  Health Check: http://localhost:${PORT}/api/health`);
    console.log(`======================================================\n`);
  });
}

module.exports = app;
