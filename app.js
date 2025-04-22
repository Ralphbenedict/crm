/**
 * CRM System - Main Application Entry Point
 * 
 * This file initializes and configures the Express.js application, sets up middleware,
 * defines routes, and starts the server. It serves as the central hub for the CRM system.
 * 
 * Key responsibilities:
 * - Application configuration and middleware setup
 * - Route definitions and mounting
 * - Error handling
 * - Database initialization
 * - Static file serving
 * - Server startup
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const { connectDB } = require('./config/database');
const orderRoutes = require('./routes/orderRoutes');
const CostController = require('./controllers/CostController');
const CustomerController = require('./controllers/customerController');
const customerRoutes = require('./routes/customerRoutes');
const session = require('express-session');
const flash = require('connect-flash');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'crm-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Flash messages middleware
app.use(flash());

// Make flash messages available to all views
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Connect to MongoDB
connectDB();

// Route Definitions

// Home route
app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

// Test route for customers
app.get('/test-customers', (req, res) => {
    res.render('customers/index', {
        title: 'Customers',
        customers: []
    });
});

// Cost Calculation API Routes
app.post('/api/cost/laser-engraving', CostController.calculateLaserEngraving);
app.post('/api/cost/laser-cutting', CostController.calculateLaserCutting);
app.get('/api/materials', CostController.getMaterials);

// Mount route handlers
app.use('/customers', customerRoutes);
app.use('/orders', orderRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).render('error', {
        title: 'Error',
        message: err.message || 'An unexpected error occurred',
        error: err
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('error', {
        title: '404 Not Found',
        message: 'Page not found',
        error: {
            status: 404,
            message: 'Page not found'
        }
    });
});

// Only start the server if this file is run directly (not imported as a module)
if (require.main === module) {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

// Export the app for Vercel
module.exports = app; 