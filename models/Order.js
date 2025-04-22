/**
 * Order Model
 * 
 * Represents a customer order in the CRM system. This model stores all information
 * related to a customer's order, including payment details, status, and associated files.
 * 
 * Key features:
 * - Tracks order details (SI number, dates, amounts)
 * - Manages payment status and documentation
 * - Links to customer information
 * - Supports file attachments for proof of payment
 * - Includes soft delete functionality
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
    // Primary key
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    // Sales Invoice number - unique identifier for the order
    siNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    // Date when the order was placed
    orderDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },

    // Customer information
    customerName: {
        type: DataTypes.STRING,
        allowNull: false
    },

    // Financial information
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
    },

    // Tax withholding information
    withholdingTax: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0
    },

    // Date when the invoice was issued
    invoiceDate: {
        type: DataTypes.DATE,
        allowNull: true
    },

    // Reference to the order status
    statusId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'OrderStatuses',
            key: 'id'
        }
    },

    // File paths for proof of payment documents
    proofOfPayment1: {
        type: DataTypes.STRING,
        allowNull: true
    },

    proofOfPayment2: {
        type: DataTypes.STRING,
        allowNull: true
    },

    // Soft delete support
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    // Model configuration
    paranoid: true, // Enable soft deletes
    timestamps: true, // Add createdAt and updatedAt fields
    indexes: [
        // Index for faster searches
        {
            fields: ['siNumber']
        },
        {
            fields: ['customerName']
        },
        {
            fields: ['statusId']
        }
    ]
});

module.exports = Order; 