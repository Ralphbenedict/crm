const sequelize = require('../config/database');
const Customer = require('./Customer');
const CustomerAddress = require('./CustomerAddress');
const CustomerContact = require('./CustomerContact');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const OrderStatus = require('./OrderStatus');
const OrderNote = require('./OrderNote');

module.exports = {
    sequelize,
    Customer,
    CustomerAddress,
    CustomerContact,
    Order,
    OrderItem,
    OrderStatus,
    OrderNote
}; 