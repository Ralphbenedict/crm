const mongoose = require('mongoose');
require('dotenv').config();

// Clear mongoose model cache to prevent OverwriteModelError
mongoose.models = {};
mongoose.modelSchemas = {};

// Import models after clearing cache
const { Customer, Order } = require('../models');

const sampleCustomers = [
    {
        name: 'Tech Solutions Inc.',
        tin: '123-456-789',
        customerType: 'business',
        addresses: [
            {
                street: '123 Tech Street',
                city: 'Silicon Valley',
                state: 'CA',
                postalCode: '94000',
                country: 'Philippines',
                isDefault: true
            }
        ],
        contacts: [
            {
                type: 'email',
                value: 'contact@techsolutions.com',
                isDefault: true
            },
            {
                type: 'phone',
                value: '555-0101',
                isDefault: false
            }
        ],
        notes: 'Tech solutions provider specializing in IT infrastructure'
    },
    {
        name: 'Green Energy Corp',
        tin: '234-567-890',
        customerType: 'business',
        addresses: [
            {
                street: '456 Solar Avenue',
                city: 'Phoenix',
                state: 'AZ',
                postalCode: '85001',
                country: 'Philippines',
                isDefault: true
            }
        ],
        contacts: [
            {
                type: 'email',
                value: 'info@greenenergy.com',
                isDefault: true
            },
            {
                type: 'phone',
                value: '555-0102',
                isDefault: false
            }
        ],
        notes: 'Renewable energy solutions provider'
    },
    {
        name: 'Creative Designs LLC',
        tin: '345-678-901',
        customerType: 'business',
        addresses: [
            {
                street: '789 Art Boulevard',
                city: 'Portland',
                state: 'OR',
                postalCode: '97201',
                country: 'Philippines',
                isDefault: true
            }
        ],
        contacts: [
            {
                type: 'email',
                value: 'hello@creativedesigns.com',
                isDefault: true
            },
            {
                type: 'phone',
                value: '555-0103',
                isDefault: false
            }
        ],
        notes: 'Creative design agency'
    },
    {
        name: 'Global Logistics Ltd',
        tin: '456-789-012',
        customerType: 'business',
        addresses: [
            {
                street: '321 Shipping Lane',
                city: 'Miami',
                state: 'FL',
                postalCode: '33101',
                country: 'Philippines',
                isDefault: true
            }
        ],
        contacts: [
            {
                type: 'email',
                value: 'support@globallogistics.com',
                isDefault: true
            },
            {
                type: 'phone',
                value: '555-0104',
                isDefault: false
            }
        ],
        notes: 'International logistics and shipping company'
    },
    {
        name: 'Health & Wellness Co',
        tin: '567-890-123',
        customerType: 'business',
        addresses: [
            {
                street: '654 Wellness Way',
                city: 'Denver',
                state: 'CO',
                postalCode: '80201',
                country: 'Philippines',
                isDefault: true
            }
        ],
        contacts: [
            {
                type: 'email',
                value: 'care@healthwellness.com',
                isDefault: true
            },
            {
                type: 'phone',
                value: '555-0105',
                isDefault: false
            }
        ],
        notes: 'Health and wellness products supplier'
    }
];

const sampleOrders = [
    {
        siNumber: 'SI-2024-001',
        orderDate: new Date('2024-01-15'),
        customerName: 'Tech Solutions Inc.',
        totalAmount: 15000.00,
        withholdingTax: 1500.00,
        invoiceDate: new Date('2024-01-16'),
        statusId: 'completed',
        status: 'completed', // Adding status field for view compatibility
        items: [
            {
                name: 'Laptop',
                quantity: 5,
                unitPrice: 2000.00,
                description: 'High-performance laptops',
                material: 'metal',
                thickness: 1.5,
                width: 350,
                height: 250,
                area: 87500,
                processType: 'laser-cutting'
            },
            {
                name: 'Monitor',
                quantity: 5,
                unitPrice: 500.00,
                description: '24-inch monitors',
                material: 'plastic',
                thickness: 2.0,
                width: 600,
                height: 400,
                area: 240000,
                processType: 'laser-cutting'
            }
        ],
        notes: [{ content: 'Priority shipping requested' }]
    },
    {
        siNumber: 'SI-2024-002',
        orderDate: new Date('2024-02-01'),
        customerName: 'Green Energy Corp',
        totalAmount: 25000.00,
        withholdingTax: 2500.00,
        invoiceDate: new Date('2024-02-02'),
        statusId: 'processing',
        status: 'processing', // Adding status field for view compatibility
        items: [
            {
                name: 'Solar Panel',
                quantity: 10,
                unitPrice: 2000.00,
                description: 'High-efficiency solar panels',
                material: 'metal',
                thickness: 3.0,
                width: 1000,
                height: 1500,
                area: 1500000,
                processType: 'laser-cutting'
            },
            {
                name: 'Inverter',
                quantity: 5,
                unitPrice: 1000.00,
                description: 'Power inverters',
                material: 'metal',
                thickness: 2.5,
                width: 300,
                height: 400,
                area: 120000,
                processType: 'laser-cutting'
            }
        ],
        notes: [{ content: 'Installation scheduled for next week' }]
    },
    {
        siNumber: 'SI-2024-003',
        orderDate: new Date('2024-02-15'),
        customerName: 'Creative Designs LLC',
        totalAmount: 8000.00,
        withholdingTax: 800.00,
        invoiceDate: new Date('2024-02-16'),
        statusId: 'pending',
        status: 'pending', // Adding status field for view compatibility
        items: [
            {
                name: 'Design Software License',
                quantity: 4,
                unitPrice: 2000.00,
                description: 'Annual software licenses',
                material: 'plastic',
                thickness: 1.0,
                width: 200,
                height: 150,
                area: 30000,
                processType: 'laser-engraving'
            }
        ],
        notes: [{ content: 'Annual subscription' }]
    },
    {
        siNumber: 'SI-2024-004',
        orderDate: new Date('2024-03-01'),
        customerName: 'Global Logistics Ltd',
        totalAmount: 12000.00,
        withholdingTax: 1200.00,
        invoiceDate: new Date('2024-03-02'),
        statusId: 'completed',
        status: 'completed', // Adding status field for view compatibility
        items: [
            {
                name: 'GPS Tracking System',
                quantity: 6,
                unitPrice: 2000.00,
                description: 'Vehicle tracking systems',
                material: 'metal',
                thickness: 1.2,
                width: 150,
                height: 100,
                area: 15000,
                processType: 'laser-cutting'
            }
        ],
        notes: [{ content: 'Installation included' }]
    },
    {
        siNumber: 'SI-2024-005',
        orderDate: new Date('2024-03-15'),
        customerName: 'Health & Wellness Co',
        totalAmount: 18000.00,
        withholdingTax: 1800.00,
        invoiceDate: new Date('2024-03-16'),
        statusId: 'processing',
        status: 'processing', // Adding status field for view compatibility
        items: [
            {
                name: 'Fitness Equipment',
                quantity: 3,
                unitPrice: 6000.00,
                description: 'Commercial gym equipment',
                material: 'metal',
                thickness: 5.0,
                width: 1200,
                height: 800,
                area: 960000,
                processType: 'laser-cutting'
            }
        ],
        notes: [{ content: 'Delivery to multiple locations' }]
    }
];

async function seedDatabase() {
    try {
        // Connect to MongoDB
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Drop existing collections
        await conn.connection.db.dropCollection('customers').catch(() => console.log('No customers collection to drop'));
        await conn.connection.db.dropCollection('orders').catch(() => console.log('No orders collection to drop'));
        console.log('Dropped existing collections');

        // Insert customers
        const customers = await Customer.insertMany(sampleCustomers);
        console.log('Inserted customers');

        // Create a map of customer names to their IDs for reference
        const customerMap = {};
        customers.forEach(customer => {
            customerMap[customer.name] = customer._id;
        });

        // Update orders with customer IDs
        const ordersWithCustomerIds = sampleOrders.map(order => {
            // Find the customer ID based on the customer name
            const customerId = customerMap[order.customerName];

            if (!customerId) {
                console.warn(`Warning: No customer found with name "${order.customerName}"`);
            }

            // Return the order with the customer ID added
            return {
                ...order,
                customerId: customerId
            };
        });

        // Insert orders
        const orders = await Order.insertMany(ordersWithCustomerIds);
        console.log('Inserted orders');

        console.log('Database seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();