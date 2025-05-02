const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['metal', 'wood', 'plastic', 'other']
    },
    basePrice: {
        type: Number,
        required: true,
        min: 0
    },
    unit: {
        type: String,
        required: true,
        default: 'piece'
    },
    processTypes: [{
        type: String,
        enum: ['cutting', 'bending', 'welding', 'assembly', 'finishing']
    }],
    materials: [{
        material: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Material',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 0
        },
        unit: {
            type: String,
            required: true,
            default: 'mm'
        }
    }],
    dimensions: {
        length: Number,
        width: Number,
        height: Number,
        unit: {
            type: String,
            default: 'mm'
        }
    },
    weight: {
        value: Number,
        unit: {
            type: String,
            default: 'kg'
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    stockQuantity: {
        type: Number,
        default: 0,
        min: 0
    },
    minimumStock: {
        type: Number,
        default: 0,
        min: 0
    },
    images: [{
        url: String,
        alt: String
    }],
    specifications: {
        type: Map,
        of: String
    }
}, {
    timestamps: true
});

// Index for efficient searching
productSchema.index({ name: 'text', description: 'text' });

// Virtual for checking if stock is low
productSchema.virtual('isLowStock').get(function () {
    return this.stockQuantity <= this.minimumStock;
});

// Method to update stock
productSchema.methods.updateStock = async function (quantity) {
    this.stockQuantity += quantity;
    if (this.stockQuantity < 0) {
        throw new Error('Insufficient stock');
    }
    return this.save();
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product; 