const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderStatus = sequelize.define('OrderStatus', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    color: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'secondary'
    }
}, {
    timestamps: true
});

module.exports = OrderStatus; 