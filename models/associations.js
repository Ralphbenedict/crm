const Customer = require('./Customer');
const CustomerAddress = require('./CustomerAddress');
const CustomerContact = require('./CustomerContact');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const OrderStatus = require('./OrderStatus');
const OrderNote = require('./OrderNote');

function setupAssociations() {
    // Customer - Order (One-to-Many)
    Customer.hasMany(Order, {
        foreignKey: 'customerId',
        as: 'orders'
    });
    Order.belongsTo(Customer, {
        foreignKey: 'customerId',
        as: 'customer'
    });

    // Customer - CustomerAddress (One-to-Many)
    Customer.hasMany(CustomerAddress, {
        foreignKey: 'customerId',
        as: 'CustomerAddresses'
    });
    CustomerAddress.belongsTo(Customer, {
        foreignKey: 'customerId',
        as: 'customer'
    });

    // Customer - CustomerContact (One-to-Many)
    Customer.hasMany(CustomerContact, {
        foreignKey: 'customerId',
        as: 'CustomerContacts'
    });
    CustomerContact.belongsTo(Customer, {
        foreignKey: 'customerId',
        as: 'customer'
    });

    // Order - OrderStatus (Many-to-One)
    Order.belongsTo(OrderStatus, {
        foreignKey: 'statusId',
        as: 'status'
    });
    OrderStatus.hasMany(Order, {
        foreignKey: 'statusId',
        as: 'orders'
    });

    // Order - OrderItem (One-to-Many)
    Order.hasMany(OrderItem, {
        foreignKey: 'orderId',
        as: 'items'
    });
    OrderItem.belongsTo(Order, {
        foreignKey: 'orderId',
        as: 'order'
    });

    // Order - OrderNote (One-to-Many)
    Order.hasMany(OrderNote, {
        foreignKey: 'orderId',
        as: 'notes'
    });
    OrderNote.belongsTo(Order, {
        foreignKey: 'orderId',
        as: 'order'
    });

    console.log('Model associations have been set up successfully.');
}

module.exports = setupAssociations; 