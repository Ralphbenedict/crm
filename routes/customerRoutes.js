const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/customerController');

// List route
router.get('/', CustomerController.index);

// Specific routes (no parameters)
router.get('/create', CustomerController.create);
router.get('/search', CustomerController.search);
router.get('/search/suggestions', CustomerController.searchSuggestions);

// Create customer route
router.post('/', CustomerController.store);

// Parameterized routes last
router.get('/:id', CustomerController.show);
router.get('/:id/edit', CustomerController.edit);
router.post('/:id', CustomerController.update);
router.post('/:id/delete', CustomerController.destroy);

module.exports = router; 