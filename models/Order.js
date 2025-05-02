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

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    siNumber: {
        type: String,
        required: true,
        unique: true
    },
    orderDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    // Reference to Customer model
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
    // Keep customerName for backward compatibility
    customerName: {
        type: String,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true,
        default: 0
    },
    withholdingTax: {
        type: Number,
        default: 0
    },
    invoiceDate: {
        type: Date
    },
    statusId: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'cancelled'],
        default: 'pending'
    },
    // Add status field for view compatibility
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'cancelled'],
        default: 'pending'
    },
    items: [{
        name: String,
        quantity: Number,
        unitPrice: Number,
        description: String,
        material: {
            type: String,
            default: 'metal'
        },
        thickness: {
            type: Number,
            default: 1.0
        },
        width: Number,
        height: Number,
        area: Number,
        processType: {
            type: String,
            enum: ['laser-cutting', 'laser-engraving'],
            default: 'laser-cutting'
        }
    }],
    proofOfPayment1: {
        type: String
    },
    proofOfPayment2: {
        type: String
    },
    notes: [{
        content: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Create indexes
orderSchema.index({ siNumber: 1 }, { unique: true });
orderSchema.index({ customerName: 1 });
orderSchema.index({ statusId: 1 });

// Update the updatedAt timestamp before saving
orderSchema.pre('save', function (next) {
    this.updatedAt = Date.now();

    // Ensure status and statusId are synchronized
    if (this.statusId && !this.status) {
        this.status = this.statusId;
    } else if (this.status && !this.statusId) {
        this.statusId = this.status;
    }

    next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;