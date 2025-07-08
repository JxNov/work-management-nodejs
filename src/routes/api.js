const express = require('express');
const router = express.Router();

// Middlewares
const authApiMiddleware = require('../middlewares/authApi.middleware');
const authorize = require('../middlewares/authorize.middleware');

// Controllers
const authController = require('../controllers/api/auth.controller');
const userController = require('../controllers/api/user.controller');
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

// User routes
router.get(
    '/users',
    authApiMiddleware,
    authorize('admin'),
    userController.getAllUsers
);
router.post(
    '/users',
    authApiMiddleware,
    authorize('admin'),
    userController.createUser
);
router.patch(
    '/users/:id',
    authApiMiddleware,
    authorize('admin'),
    userController.updateUser
);
router.delete(
    '/users/:id',
    authApiMiddleware,
    authorize('admin'),
    userController.deleteUser
);

// Task routes
router.get('/tasks', authApiMiddleware, taskController.getAllTasks);
router.post(
    '/tasks',
    authApiMiddleware,
    authorize('admin'),
    taskController.createTask
);
router.patch(
    '/tasks/:id',
    authApiMiddleware,
    authorize('admin'),
    taskController.updateTask
);
router.delete(
    '/tasks/:id',
    authApiMiddleware,
    authorize('admin'),
    taskController.deleteTask
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
router.delete(
    '/work-logs/:id',
    authApiMiddleware,
    workLogController.deleteWorkLog
);

// Report routes
router.get(
    '/reports/daily',
    authApiMiddleware,
    authorize('director'),
    reportController.getDailySummary
);

// Standard Routes
router.get('/standards', authApiMiddleware, standardController.getAllStandards);
router.post(
    '/standards',
    authApiMiddleware,
    authorize('admin', 'director'),
    standardController.setStandard
);
router.delete(
    '/standards/:id',
    authApiMiddleware,
    authorize('admin', 'director'),
    standardController.deleteStandard
);

module.exports = router;
