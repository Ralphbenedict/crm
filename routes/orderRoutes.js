const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Create order route (with file upload)
router.post('/', upload.fields([
    { name: 'proofOfPayment1', maxCount: 1 },
    { name: 'proofOfPayment2', maxCount: 1 }
]), OrderController.createOrder);

// List route
router.get('/', OrderController.getAllOrders);

// Search routes
router.get('/search', OrderController.searchOrders);
router.get('/search-suggestions', OrderController.getSearchSuggestions);

// Create order form
router.get('/create', OrderController.getOrderForm);

// Order details and actions
router.get('/:id', OrderController.getOrderDetails);
router.get('/:id/edit', OrderController.getEditOrderForm);
router.post('/:id', upload.fields([
    { name: 'proofOfPayment1', maxCount: 1 },
    { name: 'proofOfPayment2', maxCount: 1 }
]), OrderController.updateOrder);
router.post('/:id/delete', OrderController.deleteOrder);
router.post('/:id/notes', OrderController.addNote);

module.exports = router; 