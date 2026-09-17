const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const authController = require('../controllers/authController');
const assetController = require('../controllers/assetController');
const issueController = require('../controllers/issueController');
const inspectionController = require('../controllers/inspectionController');
const adminController = require('../controllers/adminController');
const notificationController = require('../controllers/notificationController');

// --- AUTH & PERSONA SWITCHER ---
router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);
router.get('/auth/me', authenticateToken, authController.me);
router.post('/auth/switch-role', authController.switchDemoRole);

// --- METADATA ---
router.get('/metadata/wards-departments', adminController.getWardsAndDepartments);

// --- ASSET REGISTRY ---
router.get('/assets', assetController.getAssets);
router.get('/assets/:id', assetController.getAssetById);
router.post('/assets', authenticateToken, requireRole('ADMIN'), assetController.createAsset);
router.patch('/assets/:id', authenticateToken, requireRole('ADMIN'), assetController.updateAsset);

// --- ISSUES & LIFECYCLE ---
router.get('/issues', issueController.getIssues);
router.get('/issues/:id', issueController.getIssueById);
router.post('/issues', authenticateToken, issueController.createIssue);
router.patch('/issues/:id/assign', authenticateToken, requireRole('ADMIN'), issueController.assignIssue);
router.patch('/issues/:id/start-work', authenticateToken, requireRole(['FIELD_STAFF', 'ADMIN']), issueController.startWork);
router.post('/issues/:id/progress-note', authenticateToken, issueController.addProgressNote);
router.patch('/issues/:id/resolve', authenticateToken, requireRole(['FIELD_STAFF', 'ADMIN']), issueController.resolveIssue);
router.post('/issues/:id/verify', authenticateToken, issueController.verifyResolution);

// --- PHOTO EVIDENCE UPLOAD ---
router.post('/upload', authenticateToken, upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, url: fileUrl, filename: req.file.filename });
});

// --- SCHEDULED FIELD INSPECTIONS ---
router.get('/inspections', authenticateToken, inspectionController.getInspections);
router.get('/inspections/:id', authenticateToken, inspectionController.getInspectionById);
router.post('/inspections', authenticateToken, requireRole('ADMIN'), inspectionController.createInspectionSchedule);
router.post('/inspections/:inspectionId/items/:itemId', authenticateToken, requireRole(['FIELD_STAFF', 'ADMIN']), inspectionController.submitItemResult);

// --- ADMIN, ANALYTICS & ESCALATIONS ---
router.get('/admin/analytics', authenticateToken, adminController.getAnalytics);
router.post('/admin/escalations/trigger-check', authenticateToken, requireRole('ADMIN'), adminController.triggerEscalationCheck);
router.get('/admin/recurring-analysis', authenticateToken, adminController.getRecurringAnalysis);
router.get('/admin/config', authenticateToken, adminController.getConfig);
router.put('/admin/config', authenticateToken, requireRole('ADMIN'), adminController.updateConfig);

// --- NOTIFICATIONS ---
router.get('/notifications', authenticateToken, notificationController.getUserNotifications);
router.patch('/notifications/:id/read', authenticateToken, notificationController.markAsRead);

module.exports = router;
