const jwt = require('jsonwebtoken');
const config = require('../config');
const db = require('../db/database');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. No token provided.' });
  }

  jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }

    const user = db.get('SELECT id, name, email, phone, role, designation, ward_id FROM users WHERE id = ? AND is_active = 1', [decoded.id]);
    if (!user) {
      return res.status(403).json({ error: 'User account not found or deactivated.' });
    }

    req.user = user;
    next();
  });
}

function requireRole(allowedRoles) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Access denied. Role '${req.user.role}' is not authorized. Required: ${roles.join(', ')}.` 
      });
    }

    next();
  };
}

module.exports = {
  authenticateToken,
  requireRole
};
