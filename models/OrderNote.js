const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderNote = sequelize.define('OrderNote', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Orders',
            key: 'id'
        }
    },
    note: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    timestamps: true
});

module.exports = OrderNote; 