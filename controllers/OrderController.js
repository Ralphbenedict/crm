/**
 * Order Controller
 * 
 * Handles all order-related operations in the CRM system. This controller manages
 * the creation, retrieval, updating, and deletion of orders, as well as search
 * functionality and order notes.
 * 
 * Key responsibilities:
 * - Order CRUD operations
 * - File upload handling
 * - Search functionality
 * - Order status management
 * - Order notes management
 */

const { Order, Customer } = require('../models');

// Define order statuses
const orderStatuses = [
    { id: 'pending', name: 'Pending' },
    { id: 'processing', name: 'Processing' },
    { id: 'completed', name: 'Completed' },
    { id: 'cancelled', name: 'Cancelled' }
];

const OrderController = {
    /**
     * Retrieve all orders with their associated status and notes
     * 
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async getAllOrders(req, res) {
        try {
            const orders = await Order.find()
                .populate('customerId')
                .sort('-createdAt');

            // Helper function to determine status color
            const getStatusColor = (status) => {
                switch (status.toLowerCase()) {
                    case 'pending':
                        return 'warning';
                    case 'processing':
                        return 'info';
                    case 'completed':
                        return 'success';
                    case 'cancelled':
                        return 'danger';
                    default:
                        return 'secondary';
                }
            };

            res.render('orders/index', {
                title: 'Orders',
                orders,
                getStatusColor
            });
        } catch (error) {
            console.error('Error fetching orders:', error);
            res.status(500).render('error', {
                title: 'Error',
                message: 'Failed to fetch orders',
                error: process.env.NODE_ENV === 'development' ? error : {}
            });
        }
    },

    /**
     * Display the order creation form
     * 
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async getOrderForm(req, res) {
        try {
            const customers = await Customer.find();
            res.render('orders/form', {
                title: 'Create Order',
                customers,
                order: null,
                orderStatuses
            });
        } catch (error) {
            console.error('Error fetching order form:', error);
            res.status(500).render('error', {
                title: 'Error',
                message: 'Failed to load order form',
                error: process.env.NODE_ENV === 'development' ? error : {}
            });
        }
    },

    /**
     * Create a new order with optional file uploads and notes
     * 
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async createOrder(req, res) {
        try {
            const {
                customerId,
                items,
                notes,
                statusId
            } = req.body;

            // Handle file uploads
            const proofOfPayment1 = req.files?.proofOfPayment1?.[0]?.filename;
            const proofOfPayment2 = req.files?.proofOfPayment2?.[0]?.filename;

            // Calculate total amount from items
            const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

            // Create the order
            const order = await Order.create({
                customerId,
                items,
                totalAmount,
                statusId: statusId || 'pending',
                proofOfPayment1,
                proofOfPayment2,
                notes: notes ? [{ content: notes }] : []
            });

            res.redirect('/orders');
        } catch (error) {
            console.error('Error creating order:', error);
            res.status(500).render('error', {
                title: 'Error',
                message: 'Failed to create order',
                error: process.env.NODE_ENV === 'development' ? error : {}
            });
        }
    },

    /**
     * Search orders by customer name or SI number
     * 
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async searchOrders(req, res) {
        try {
            const { query } = req.query;
            let filter = {};

            if (query) {
                filter = {
                    $or: [
                        { orderNumber: { $regex: query, $options: 'i' } },
                        { 'customer.name': { $regex: query, $options: 'i' } }
                    ]
                };
            }

            const orders = await Order.find(filter)
                .populate('customerId')
                .sort('-createdAt');

            res.json({ success: true, orders });
        } catch (error) {
            console.error('Error searching orders:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    /**
     * Get search suggestions for autocomplete
     * 
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async getSearchSuggestions(req, res) {
        try {
            const { query } = req.query;
            const orders = await Order.find({
                $or: [
                    { orderNumber: { $regex: query, $options: 'i' } },
                    { 'customer.name': { $regex: query, $options: 'i' } }
                ]
            })
                .limit(5)
                .select('orderNumber customer');

            res.json({ success: true, suggestions: orders });
        } catch (error) {
            console.error('Error getting search suggestions:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    /**
     * Get order details by ID
     * 
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async getOrderDetails(req, res) {
        try {
            const order = await Order.findById(req.params.id)
                .populate('customerId');

            if (!order) {
                return res.status(404).render('error', {
                    title: 'Error',
                    message: 'Order not found'
                });
            }

            res.render('orders/details', {
                title: 'Order Details',
                order
            });
        } catch (error) {
            console.error('Error fetching order details:', error);
            res.status(500).render('error', {
                title: 'Error',
                message: 'Failed to fetch order details',
                error: process.env.NODE_ENV === 'development' ? error : {}
            });
        }
    },

    /**
     * Display the order edit form
     * 
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async getEditOrderForm(req, res) {
        try {
            const order = await Order.findById(req.params.id)
                .populate('customerId');
            const customers = await Customer.find();

            if (!order) {
                return res.status(404).render('error', {
                    title: 'Error',
                    message: 'Order not found'
                });
            }

            res.render('orders/form', {
                title: 'Edit Order',
                order,
                customers,
                orderStatuses
            });
        } catch (error) {
            console.error('Error fetching edit order form:', error);
            res.status(500).render('error', {
                title: 'Error',
                message: 'Failed to load edit form',
                error: process.env.NODE_ENV === 'development' ? error : {}
            });
        }
    },

    /**
     * Update an existing order
     * 
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async updateOrder(req, res) {
        try {
            const {
                customerId,
                items,
                notes,
                statusId
            } = req.body;

            // Handle file uploads
            const proofOfPayment1 = req.files?.proofOfPayment1?.[0]?.filename;
            const proofOfPayment2 = req.files?.proofOfPayment2?.[0]?.filename;

            // Calculate total amount from items
            const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

            const order = await Order.findById(req.params.id);
            if (!order) {
                return res.status(404).render('error', {
                    title: 'Error',
                    message: 'Order not found'
                });
            }

            // Update order
            order.customerId = customerId;
            order.items = items;
            order.totalAmount = totalAmount;
            order.statusId = statusId;
            if (proofOfPayment1) order.proofOfPayment1 = proofOfPayment1;
            if (proofOfPayment2) order.proofOfPayment2 = proofOfPayment2;
            if (notes) order.notes.push({ content: notes });

            await order.save();

            res.redirect(`/orders/${order._id}`);
        } catch (error) {
            console.error('Error updating order:', error);
            res.status(500).render('error', {
                title: 'Error',
                message: 'Failed to update order',
                error: process.env.NODE_ENV === 'development' ? error : {}
            });
        }
    },

    /**
     * Delete an order
     * 
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async deleteOrder(req, res) {
        try {
            const order = await Order.findByIdAndDelete(req.params.id);
            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found'
                });
            }

            res.json({ success: true });
        } catch (error) {
            console.error('Error deleting order:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    },

    /**
     * Add a note to an order
     * 
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async addNote(req, res) {
        try {
            const { content } = req.body;
            const order = await Order.findById(req.params.id);

            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found'
                });
            }

            order.notes.push({ content });
            await order.save();

            res.json({ success: true, note: order.notes[order.notes.length - 1] });
        } catch (error) {
            console.error('Error adding note:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
};

console.log('OrderController loaded');
module.exports = OrderController; 