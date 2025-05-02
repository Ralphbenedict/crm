const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/DashboardController');
const { isAuthenticated } = require('../middleware/auth');

// Dashboard routes (protected)
router.get('/', isAuthenticated, DashboardController.index);

module.exports = router;