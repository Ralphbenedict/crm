require('dotenv').config();
const Order = require('../models/Order');
const OrderStatus = require('../models/OrderStatus');
const setupAssociations = require('../models/associations');

// Setup model associations
setupAssociations();

async function listOrders() {
    try {
        const orders = await Order.findAll({
            include: [
                { model: OrderStatus, as: 'status' }
            ],
            order: [['createdAt', 'DESC']]
        });

        console.log('\nExisting Orders:');
        console.log('----------------');
        orders.forEach(order => {
            console.log(`\nOrder ID: ${order.id}`);
            console.log(`SI Number: ${order.siNumber}`);
            console.log(`Customer: ${order.customerName}`);
            console.log(`Status: ${order.status ? order.status.name : 'Unknown'}`);
            console.log(`Total Amount: ${order.totalAmount}`);
            console.log('----------------');
        });

        if (orders.length === 0) {
            console.log('No orders found in the database.');
        }
    } catch (error) {
        console.error('Error listing orders:', error);
    } finally {
        process.exit();
    }
}

listOrders(); 