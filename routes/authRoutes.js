const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

// Login routes
router.get('/login', AuthController.getLoginForm);
router.post('/login', AuthController.login);

// Registration routes
router.get('/register', AuthController.getRegisterForm);
router.post('/register', AuthController.register);

// Logout route
router.get('/logout', AuthController.logout);

module.exports = router;