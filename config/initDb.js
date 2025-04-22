const sequelize = require('./database');
const OrderStatus = require('../models/OrderStatus');
const Order = require('../models/Order');
const OrderNote = require('../models/OrderNote');

// Define the order statuses
const orderStatuses = [
    { name: 'Fully Paid', description: 'Order has been fully paid' },
    { name: 'Paid', description: 'Order has been partially paid' },
    { name: 'BIR 2307', description: 'BIR 2307 form has been submitted' },
    { name: 'Unpaid', description: 'Order has not been paid yet' },
    { name: 'Cancelled', description: 'Order has been cancelled' },
    { name: 'Month', description: 'Order is on monthly payment plan' },
    { name: 'Bad Debts', description: 'Order is considered a bad debt' }
];

// Initialize the database
const initDatabase = async () => {
    try {
        // Sync all models with database
        await sequelize.sync({ force: true });
        console.log('Database synchronized successfully');

        // Seed order statuses
        await OrderStatus.bulkCreate(orderStatuses);
        console.log('Order statuses seeded successfully');

        console.log('Database initialization completed');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

module.exports = initDatabase; 