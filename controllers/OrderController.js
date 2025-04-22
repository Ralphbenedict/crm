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

const Order = require('../models/Order');
const OrderStatus = require('../models/OrderStatus');
const OrderNote = require('../models/OrderNote');
const { Op } = require('sequelize');

class OrderController {
    /**
     * Retrieve all orders with their associated status and notes
     * 
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    static async getAllOrders(req, res) {
        try {
            const orders = await Order.findAll({
                include: [
                    { model: OrderStatus, as: 'status' },
                    { model: OrderNote, as: 'notes' }
                ],
                order: [['createdAt', 'DESC']]
            });

            res.render('orders/index', {
                title: 'Orders',
                orders
            });
        } catch (error) {
            console.error('Error fetching orders:', error);
            res.status(500).render('error', {
                title: 'Error',
                message: 'Failed to fetch orders',
                error: process.env.NODE_ENV === 'development' ? error : {}
            });
        }
    }

    /**
     * Display the order creation form
     * 
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    static async getOrderForm(req, res) {
        try {
            const orderStatuses = await OrderStatus.findAll();
            res.render('orders/form', {
                title: 'Create Order',
                orderStatuses,
                order: null
            });
        } catch (error) {
            console.error('Error fetching order form:', error);
            res.status(500).render('error', {
                title: 'Error',
                message: 'Failed to load order form',
                error: process.env.NODE_ENV === 'development' ? error : {}
            });
        }
    }

    /**
     * Create a new order with optional file uploads and notes
     * 
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    static async createOrder(req, res) {
        try {
            const {
                siNumber,
                orderDate,
                totalAmount,
                customerName,
                invoiceDate,
                statusId,
                withholdingTax,
                notes
            } = req.body;

            // Handle file uploads
            const proofOfPayment1 = req.files && req.files.proofOfPayment1 ? req.files.proofOfPayment1[0].filename : null;
            const proofOfPayment2 = req.files && req.files.proofOfPayment2 ? req.files.proofOfPayment2[0].filename : null;

            // Create the order
            const order = await Order.create({
                siNumber,
                orderDate,
                totalAmount,
                customerName,
                invoiceDate: invoiceDate || null,
                statusId,
                proofOfPayment1,
                proofOfPayment2,
                withholdingTax: withholdingTax || null
            });

            // Add notes if provided
            if (notes && notes.trim() !== '') {
                await OrderNote.create({
                    orderId: order.id,
                    note: notes
                });
            }

            res.redirect('/orders');
        } catch (error) {
            console.error('Error creating order:', error);
            res.status(500).render('error', {
                title: 'Error',
                message: 'Failed to create order',
                error: process.env.NODE_ENV === 'development' ? error : {}
            });
        }
    }

    /**
     * Search orders by customer name or SI number
     * 
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    static async searchOrders(req, res) {
        try {
            const { query, type } = req.query;
            let whereClause = {};

            if (query) {
                if (type === 'customer') {
                    whereClause = {
                        customerName: {
                            [Op.like]: `%${query}%`
                        }
                    };
                } else if (type === 'si') {
                    whereClause = {
                        siNumber: {
                            [Op.like]: `%${query}%`
                        }
                    };
                }
            }

            const orders = await Order.findAll({
                where: whereClause,
                include: [
                    { model: OrderStatus, as: 'status' },
                    { model: OrderNote, as: 'notes' }
                ],
                order: [['createdAt', 'DESC']]
            });

            // Set cache control headers to prevent caching
            res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
            res.set('Expires', '-1');
            res.set('Pragma', 'no-cache');

            res.json({ success: true, orders });
        } catch (error) {
            console.error('Error searching orders:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    }

    /**
     * Get search suggestions for autocomplete
     * 
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    static async getSearchSuggestions(req, res) {
        try {
            const { query, type } = req.query;
            let whereClause = {};
            let suggestions = [];

            if (query) {
                if (type === 'customer') {
                    whereClause = {
                        customerName: {
                            [Op.like]: `%${query}%`
                        }
                    };
                    const orders = await Order.findAll({
                        where: whereClause,
                        attributes: ['customerName'],
                        group: ['customerName'],
                        limit: 10
                    });
                    suggestions = orders.map(order => order.customerName);
                } else if (type === 'si') {
                    whereClause = {
                        siNumber: {
                            [Op.like]: `%${query}%`
                        }
                    };
                    const orders = await Order.findAll({
                        where: whereClause,
                        attributes: ['siNumber'],
                        limit: 10
                    });
                    suggestions = orders.map(order => order.siNumber);
                }
            }

            res.json({ success: true, suggestions });
        } catch (error) {
            console.error('Error getting search suggestions:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    }

    /**
     * Get order details by ID
     * 
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    static async getOrderDetails(req, res) {
        try {
            const order = await Order.findByPk(req.params.id, {
                include: [
                    { model: OrderStatus, as: 'status' },
                    { model: OrderNote, as: 'notes' }
                ]
            });

            if (!order) {
                return res.status(404).render('error', {
                    title: 'Not Found',
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
    }

    /**
     * Display the order edit form
     * 
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    static async getEditOrderForm(req, res) {
        try {
            const [order, orderStatuses] = await Promise.all([
                Order.findByPk(req.params.id, {
                    include: [
                        { model: OrderStatus, as: 'status' },
                        { model: OrderNote, as: 'notes' }
                    ]
                }),
                OrderStatus.findAll()
            ]);

            if (!order) {
                return res.status(404).render('error', {
                    title: 'Not Found',
                    message: 'Order not found'
                });
            }

            res.render('orders/form', {
                title: 'Edit Order',
                order,
                orderStatuses
            });
        } catch (error) {
            console.error('Error fetching edit form:', error);
            res.status(500).render('error', {
                title: 'Error',
                message: 'Failed to load edit form',
                error: process.env.NODE_ENV === 'development' ? error : {}
            });
        }
    }

    /**
     * Update an existing order
     * 
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    static async updateOrder(req, res) {
        try {
            const order = await Order.findByPk(req.params.id);
            if (!order) {
                return res.status(404).render('error', {
                    title: 'Not Found',
                    message: 'Order not found'
                });
            }

            const {
                siNumber,
                orderDate,
                totalAmount,
                customerName,
                invoiceDate,
                statusId,
                withholdingTax,
                notes
            } = req.body;

            // Handle file uploads
            const proofOfPayment1 = req.files && req.files.proofOfPayment1 ? req.files.proofOfPayment1[0].filename : order.proofOfPayment1;
            const proofOfPayment2 = req.files && req.files.proofOfPayment2 ? req.files.proofOfPayment2[0].filename : order.proofOfPayment2;

            // Update the order
            await order.update({
                siNumber,
                orderDate,
                totalAmount,
                customerName,
                invoiceDate: invoiceDate || null,
                statusId,
                proofOfPayment1,
                proofOfPayment2,
                withholdingTax: withholdingTax || null
            });

            // Add notes if provided
            if (notes && notes.trim() !== '') {
                await OrderNote.create({
                    orderId: order.id,
                    note: notes
                });
            }

            res.redirect(`/orders/${order.id}`);
        } catch (error) {
            console.error('Error updating order:', error);
            res.status(500).render('error', {
                title: 'Error',
                message: 'Failed to update order',
                error: process.env.NODE_ENV === 'development' ? error : {}
            });
        }
    }

    /**
     * Delete an order
     * 
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    static async deleteOrder(req, res) {
        try {
            const order = await Order.findByPk(req.params.id);
            if (!order) {
                return res.status(404).render('error', {
                    title: 'Not Found',
                    message: 'Order not found'
                });
            }

            await order.destroy();
            res.redirect('/orders');
        } catch (error) {
            console.error('Error deleting order:', error);
            res.status(500).render('error', {
                title: 'Error',
                message: 'Failed to delete order',
                error: process.env.NODE_ENV === 'development' ? error : {}
            });
        }
    }

    /**
     * Add a note to an order
     * 
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    static async addNote(req, res) {
        try {
            const order = await Order.findByPk(req.params.id);
            if (!order) {
                return res.status(404).json({ success: false, message: 'Order not found' });
            }

            const { note } = req.body;
            if (!note || note.trim() === '') {
                return res.status(400).json({ success: false, message: 'Note cannot be empty' });
            }

            await OrderNote.create({
                orderId: order.id,
                note: note.trim()
            });

            res.json({ success: true });
        } catch (error) {
            console.error('Error adding note:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = OrderController; 