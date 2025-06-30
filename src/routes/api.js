const express = require('express');
const router = express.Router();

// Middlewares
const authApiMiddleware = require('../middlewares/authApi.middleware');
const authorize = require('../middlewares/authorize.middleware');

// Controllers
const authController = require('../controllers/api/auth.controller');
const taskController = require('../controllers/api/task.controller');
const workLogController = require('../controllers/api/workLog.controller');
const reportController = require('../controllers/api/report.controller');
const standardController = require('../controllers/api/standard.controller');

// Routes
// Authentication routes
router.post('/auth/login', authController.login);
router.post('/auth/refresh-token', authController.refreshToken);
router.get('/auth/profile', authApiMiddleware, authController.profile);
router.post('/auth/logout', authApiMiddleware, authController.logout);

// Task routes
router.get('/tasks', authApiMiddleware, taskController.getAllTasks);
router.post(
  '/tasks',
  authApiMiddleware,
  authorize('admin'),
  taskController.createTask
);

// Work Log routes
router.get(
  '/work-logs',
  authApiMiddleware,
  workLogController.getUserWorkLogsByDate
);
router.post(
  '/work-logs',
  authApiMiddleware,
  workLogController.createOrUpdateWorkLog
);

// Report routes
router.get(
  '/reports/daily',
  authApiMiddleware,
  authorize('admin', 'director'),
  reportController.getDailySummary
);

// Standard Routes
router.get('/standards', authApiMiddleware, standardController.getAllStandards);
router.post(
  '/standards',
  authApiMiddleware,
  authorize('admin'),
  standardController.setStandard
);

module.exports = router;
