const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');

const DB_DIR = path.join(__dirname, '../../data');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const DB_PATH = path.join(DB_DIR, 'gramseva.sqlite');
const db = new DatabaseSync(DB_PATH);

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON;');

// Initialize schema
function initSchema() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schemaSql);
}

const dbHelper = {
  db,
  initSchema,

  all(sql, params = []) {
    try {
      const stmt = db.prepare(sql);
      return stmt.all(...params);
    } catch (err) {
      console.error(`SQL Error in all(): ${sql}`, err);
      throw err;
    }
  },

  get(sql, params = []) {
    try {
      const stmt = db.prepare(sql);
      return stmt.get(...params);
    } catch (err) {
      console.error(`SQL Error in get(): ${sql}`, err);
      throw err;
    }
  },

  run(sql, params = []) {
    try {
      const stmt = db.prepare(sql);
      return stmt.run(...params);
    } catch (err) {
      console.error(`SQL Error in run(): ${sql}`, err);
      throw err;
    }
  },

  exec(sql) {
    return db.exec(sql);
  },

  transaction(fn) {
    db.exec('BEGIN TRANSACTION;');
    try {
      const result = fn();
      db.exec('COMMIT;');
      return result;
    } catch (err) {
      db.exec('ROLLBACK;');
      throw err;
    }
  }
};

module.exports = dbHelper;
