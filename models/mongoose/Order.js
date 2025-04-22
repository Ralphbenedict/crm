const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'cancelled'],
        default: 'pending'
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'partial', 'paid'],
        default: 'unpaid'
    },
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
    items: [{
        description: String,
        quantity: Number,
        unitPrice: Number,
        totalPrice: Number,
        material: {
            type: String,
            required: true
        },
        thickness: {
            type: Number,
            required: true
        },
        width: Number,
        height: Number,
        area: Number,
        processType: {
            type: String,
            enum: ['laser-cutting', 'laser-engraving'],
            required: true
        }
    }]
}, {
    timestamps: true
});

// Virtual for order total
orderSchema.virtual('total').get(function () {
    return this.items.reduce((total, item) => total + item.totalPrice, 0);
});

// Pre-save middleware to generate order number
orderSchema.pre('save', async function (next) {
    if (this.isNew) {
        const count = await this.constructor.countDocuments();
        this.orderNumber = `ORD${String(count + 1).padStart(6, '0')}`;
    }
    next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order; 