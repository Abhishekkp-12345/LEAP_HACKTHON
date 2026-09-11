const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');
const config = require('../config');

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRY }
  );
}

const authController = {
  login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }

      const user = db.get('SELECT * FROM users WHERE email = ? AND is_active = 1', [email.trim().toLowerCase()]);
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const isMatch = bcrypt.compareSync(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const token = generateToken(user);
      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          designation: user.designation,
          wardId: user.ward_id
        }
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Login failed. Please try again.' });
    }
  },

  register(req, res) {
    try {
      const { name, email, phone, password, role = 'CITIZEN', wardId = 'w-2' } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required.' });
      }

      const existing = db.get('SELECT id FROM users WHERE email = ?', [email.trim().toLowerCase()]);
      if (existing) {
        return res.status(400).json({ error: 'An account with this email already exists.' });
      }

      const userId = `u-${Date.now()}`;
      const passwordHash = bcrypt.hashSync(password, 10);
      const userRole = ['CITIZEN', 'FIELD_STAFF', 'ADMIN'].includes(role) ? role : 'CITIZEN';

      db.run(
        `INSERT INTO users (id, name, email, phone, password_hash, role, designation, ward_id, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [userId, name.trim(), email.trim().toLowerCase(), phone || null, passwordHash, userRole, 'Village Resident', wardId]
      );

      const newUser = db.get('SELECT id, name, email, phone, role, designation, ward_id FROM users WHERE id = ?', [userId]);
      const token = generateToken(newUser);

      res.status(201).json({
        token,
        user: newUser
      });
    } catch (err) {
      console.error('Register error:', err);
      res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
  },

  me(req, res) {
    res.json({ user: req.user });
  },

  switchDemoRole(req, res) {
    try {
      const { role } = req.body;
      let targetUser = null;

      if (role === 'CITIZEN') {
        targetUser = db.get("SELECT * FROM users WHERE email = 'mahadevappa@gmail.com'");
      } else if (role === 'FIELD_STAFF') {
        targetUser = db.get("SELECT * FROM users WHERE email = 'lineman.ramesh@gramseva.kar.gov.in'");
      } else if (role === 'ADMIN') {
        targetUser = db.get("SELECT * FROM users WHERE email = 'admin@gramseva.kar.gov.in'");
      }

      if (!targetUser) {
        return res.status(404).json({ error: `Demo user for role '${role}' not found.` });
      }

      const token = generateToken(targetUser);
      res.json({
        token,
        user: {
          id: targetUser.id,
          name: targetUser.name,
          email: targetUser.email,
          phone: targetUser.phone,
          role: targetUser.role,
          designation: targetUser.designation,
          wardId: targetUser.ward_id
        }
      });
    } catch (err) {
      console.error('Switch demo role error:', err);
      res.status(500).json({ error: 'Failed to switch role.' });
    }
  }
};

module.exports = authController;
