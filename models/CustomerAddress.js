const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CustomerAddress = sequelize.define('CustomerAddress', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Customers',
            key: 'id'
        }
    },
    addressType: {
        type: DataTypes.ENUM('billing', 'shipping', 'main'),
        defaultValue: 'main'
    },
    streetAddress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false
    },
    postalCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Philippines'
    },
    isDefault: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true,
    paranoid: true
});

module.exports = CustomerAddress; 