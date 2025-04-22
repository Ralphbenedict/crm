const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: String,
    type: {
        type: String,
        enum: ['metal', 'wood', 'plastic', 'other'],
        required: true
    },
    thicknesses: [{
        value: {
            type: Number,
            required: true
        },
        unit: {
            type: String,
            default: 'mm'
        },
        pricePerUnit: {
            type: Number,
            required: true
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Material = mongoose.model('Material', materialSchema);

module.exports = Material; 