const { Order, OrderStatus, OrderNote } = require('../models');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Create order statuses
        const statuses = await OrderStatus.bulkCreate([
            { name: 'Fully paid', color: 'success' },
            { name: 'BIR 2307', color: 'warning' },
            { name: 'Cancelled', color: 'danger' }
        ]);

        const fullyPaidStatus = statuses.find(s => s.name === 'Fully paid');
        const bir2307Status = statuses.find(s => s.name === 'BIR 2307');
        const cancelledStatus = statuses.find(s => s.name === 'Cancelled');

        // Helper function to parse date
        const parseDate = (dateStr) => {
            if (!dateStr || dateStr === '#N/A') return null;
            const [day, month] = dateStr.split('-');
            const year = 2024;
            return new Date(year, getMonthNumber(month), parseInt(day));
        };

        // Helper function to get month number
        const getMonthNumber = (month) => {
            const months = {
                'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
                'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
            };
            return months[month];
        };

        // Helper function to parse amount
        const parseAmount = (amountStr) => {
            if (!amountStr || amountStr === '#N/A') return 0;
            return parseFloat(amountStr.replace(/,/g, ''));
        };

        // Sample orders data
        const orders = [
            {
                siNumber: 'SI 8378',
                totalAmount: 21000.00,
                customerName: 'UnionBank of The Philippines',
                orderDate: parseDate('6-Jan'),
                invoiceDate: parseDate('6-Jan'),
                statusId: bir2307Status.id,
                notes: 'follow up 2307'
            },
            {
                siNumber: 'SI 8379',
                totalAmount: 500.00,
                customerName: 'Pabryca De Disenyo Inc.',
                orderDate: parseDate('6-Jan'),
                invoiceDate: parseDate('6-Jan'),
                statusId: fullyPaidStatus.id,
                proofOfPayment1: 'SI 8379.jpg'
            },
            // Add more orders here...
        ];

        // Create orders
        for (const orderData of orders) {
            const order = await Order.create(orderData);

            // Add notes if they exist
            if (orderData.notes) {
                await OrderNote.create({
                    orderId: order.id,
                    note: orderData.notes
                });
            }
        }
    },

    down: async (queryInterface, Sequelize) => {
        await OrderNote.destroy({ where: {} });
        await Order.destroy({ where: {} });
        await OrderStatus.destroy({ where: {} });
    }
}; 