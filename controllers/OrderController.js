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
                .sort('-createdAt');

            // Map the orders to include the correct status format
            const mappedOrders = orders.map(order => ({
                ...order.toObject(),
                status: order.statusId || 'pending' // Ensure status is always defined
            }));

            // Helper function to determine status color
            const getStatusColor = (status) => {
                switch (status) {
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
                orders: mappedOrders,
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
                customerName,
                items,
                notes,
                statusId,
                siNumber,
                orderDate,
                invoiceDate,
                totalAmount,
                withholdingTax
            } = req.body;

            // Validate customer exists
            if (!customerName) {
                return res.status(400).render('orders/form', {
                    title: 'Create Order',
                    customers: await Customer.find(),
                    order: null,
                    orderStatuses,
                    error: {
                        message: 'Please select a customer'
                    }
                });
            }

            // Find customer
            const customer = await Customer.findOne({ name: customerName });
            if (!customer) {
                return res.status(400).render('orders/form', {
                    title: 'Create Order',
                    customers: await Customer.find(),
                    order: null,
                    orderStatuses,
                    error: {
                        message: 'Selected customer does not exist'
                    }
                });
            }

            // Generate order number
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const count = await Order.countDocuments();
            const orderNumber = `ORD-${year}${month}-${String(count + 1).padStart(3, '0')}`;

            // Create default item if none provided
            const defaultItem = {
                processType: 'default',
                thickness: '1.0',
                material: 'standard',
                quantity: 1,
                unitPrice: totalAmount || 0
            };

            // Create the order
            const order = await Order.create({
                customerId: customer._id,
                orderNumber,
                siNumber,
                items: items || [defaultItem],
                totalAmount,
                statusId: statusId || 'pending',
                orderDate,
                invoiceDate,
                withholdingTax,
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
            const { term, type } = req.query;
            let filter = {};

            if (term) {
                if (type === 'customer') {
                    filter = { 'customerId.name': { $regex: term, $options: 'i' } };
                } else if (type === 'si') {
                    filter = { siNumber: { $regex: term, $options: 'i' } };
                } else {
                    filter = {
                        $or: [
                            { siNumber: { $regex: term, $options: 'i' } },
                            { 'customerId.name': { $regex: term, $options: 'i' } }
                        ]
                    };
                }
            }

            const orders = await Order.find(filter)
                .populate('customerId')
                .sort('-createdAt');

            // Map the orders to include the correct status format
            const mappedOrders = orders.map(order => ({
                ...order.toObject(),
                status: order.statusId || 'pending', // Ensure status is always defined
                customerName: order.customerId ? order.customerId.name : 'Unknown Customer'
            }));

            res.json(mappedOrders);
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
            const { term, type } = req.query;
            let filter = {};

            if (term) {
                if (type === 'customer') {
                    filter = { 'customerId.name': { $regex: term, $options: 'i' } };
                } else if (type === 'si') {
                    filter = { siNumber: { $regex: term, $options: 'i' } };
                } else {
                    filter = {
                        $or: [
                            { siNumber: { $regex: term, $options: 'i' } },
                            { 'customerId.name': { $regex: term, $options: 'i' } }
                        ]
                    };
                }
            }

            const orders = await Order.find(filter)
                .populate('customerId')
                .limit(5)
                .select('siNumber customerId');

            // Format suggestions for autocomplete
            const suggestions = orders.map(order => ({
                value: type === 'customer' ? (order.customerId ? order.customerId.name : 'Unknown Customer') : order.siNumber,
                label: type === 'customer' ? (order.customerId ? order.customerId.name : 'Unknown Customer') : order.siNumber
            }));

            res.json(suggestions);
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

            // Ensure order has a status property and customer name
            const orderWithStatus = {
                ...order.toObject(),
                status: order.statusId || 'pending',
                customerName: order.customerId ? order.customerId.name : order.customerName || 'Unknown Customer'
            };

            // Helper function to determine status color
            const getStatusColor = (status) => {
                switch (status) {
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

            res.render('orders/details', {
                title: 'Order Details',
                order: orderWithStatus,
                getStatusColor
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
            const order = await Order.findById(req.params.id);
            const customers = await Customer.find();

            if (!order) {
                return res.status(404).render('error', {
                    title: 'Error',
                    message: 'Order not found'
                });
            }

            // Ensure order has a status property
            const orderWithStatus = {
                ...order.toObject(),
                status: order.statusId || 'pending'
            };

            res.render('orders/form', {
                title: 'Edit Order',
                order: orderWithStatus,
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
                siNumber,
                orderDate,
                invoiceDate,
                totalAmount,
                withholdingTax,
                statusId
            } = req.body;

            // Handle file uploads
            const proofOfPayment1 = req.files?.proofOfPayment1?.[0]?.filename;
            const proofOfPayment2 = req.files?.proofOfPayment2?.[0]?.filename;

            const order = await Order.findById(req.params.id);
            if (!order) {
                return res.status(404).render('error', {
                    title: 'Error',
                    message: 'Order not found'
                });
            }

            // Update order with basic fields
            if (siNumber) order.siNumber = siNumber;
            if (orderDate) order.orderDate = orderDate;
            if (invoiceDate) order.invoiceDate = invoiceDate;
            if (totalAmount) order.totalAmount = totalAmount;
            if (withholdingTax) order.withholdingTax = withholdingTax;
            if (statusId) order.statusId = statusId;

            // Handle file uploads
            if (proofOfPayment1) order.proofOfPayment1 = proofOfPayment1;
            if (proofOfPayment2) order.proofOfPayment2 = proofOfPayment2;

            // Handle notes
            if (req.body.notes) {
                if (!order.notes) order.notes = [];
                order.notes.push({
                    content: req.body.notes,
                    createdAt: new Date()
                });
            }

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