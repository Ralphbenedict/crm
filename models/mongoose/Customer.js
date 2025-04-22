const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
    country: {
        type: String,
        default: 'Philippines'
    },
    isDefault: {
        type: Boolean,
        default: false
    }
});

const contactSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['phone', 'email', 'mobile'],
        required: true
    },
    value: {
        type: String,
        required: true
    },
    isDefault: {
        type: Boolean,
        default: false
    }
});

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    company: {
        type: String
    },
    customerType: {
        type: String,
        enum: ['individual', 'business'],
        default: 'individual'
    },
    addresses: [addressSchema],
    contacts: [contactSchema],
    notes: {
        type: String
    }
}, {
    timestamps: true
});

// Virtual for default address
customerSchema.virtual('defaultAddress').get(function () {
    return this.addresses.find(addr => addr.isDefault) || this.addresses[0];
});

// Virtual for default contact
customerSchema.virtual('defaultContact').get(function () {
    return this.contacts.find(contact => contact.isDefault) || this.contacts[0];
});

// Pre-save middleware to ensure at least one default address and contact
customerSchema.pre('save', function (next) {
    if (this.addresses.length && !this.addresses.some(addr => addr.isDefault)) {
        this.addresses[0].isDefault = true;
    }
    if (this.contacts.length && !this.contacts.some(contact => contact.isDefault)) {
        this.contacts[0].isDefault = true;
    }
    next();
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer; 