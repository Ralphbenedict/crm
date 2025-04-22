require('dotenv').config();
const Order = require('../models/Order');
const OrderStatus = require('../models/OrderStatus');
const setupAssociations = require('../models/associations');

// Setup model associations
setupAssociations();

async function createSampleOrders() {
    try {
        // First, create a default status if it doesn't exist
        const [status] = await OrderStatus.findOrCreate({
            where: { name: 'Pending' },
            defaults: {
                name: 'Pending',
                description: 'Order is pending payment'
            }
        });

        // Create sample orders
        const sampleOrders = [
            {
                siNumber: 'SI-2024-001',
                orderDate: new Date(),
                customerName: 'Union Bank',
                totalAmount: 15000.00,
                statusId: status.id
            },
            {
                siNumber: 'SI-2024-002',
                orderDate: new Date(),
                customerName: 'BDO Bank',
                totalAmount: 25000.00,
                statusId: status.id
            },
            {
                siNumber: 'SI-2024-003',
                orderDate: new Date(),
                customerName: 'ABC Company',
                totalAmount: 10000.00,
                statusId: status.id
            }
        ];

        for (const orderData of sampleOrders) {
            await Order.create(orderData);
            console.log(`Created order for ${orderData.customerName}`);
        }

        console.log('\nSample orders have been created successfully.');
    } catch (error) {
        console.error('Error creating sample orders:', error);
    } finally {
        process.exit();
    }
}

createSampleOrders(); 