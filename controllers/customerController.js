const { Customer, CustomerAddress, CustomerContact, Order } = require('../models');
const { Op, sequelize } = require('../config/database');

class CustomerController {
    static async index(req, res) {
        try {
            console.log('CustomerController.index: Starting to fetch customers');
            const customers = await Customer.findAll({
                include: [
                    {
                        model: CustomerAddress,
                        where: { isDefault: true },
                        required: false
                    },
                    {
                        model: CustomerContact,
                        where: { isPrimary: true },
                        required: false
                    },
                    {
                        model: Order,
                        required: false,
                        attributes: ['id', 'totalAmount', 'statusId']
                    }
                ],
                order: [['name', 'ASC']]
            });
            console.log('CustomerController.index: Fetched customers:', customers.length);

            res.render('customers/index', {
                title: 'Customers',
                customers: customers || []
            });
        } catch (error) {
            console.error('Error fetching customers:', error);
            res.render('customers/index', {
                title: 'Customers',
                customers: [],
                error: {
                    message: 'Failed to fetch customers'
                }
            });
        }
    }

    static async show(req, res) {
        try {
            const customer = await Customer.findByPk(req.params.id, {
                include: [
                    {
                        model: CustomerAddress,
                        required: false
                    },
                    {
                        model: CustomerContact,
                        required: false
                    },
                    {
                        model: Order,
                        required: false,
                        include: ['status']
                    }
                ]
            });

            if (!customer) {
                return res.status(404).render('error', {
                    title: 'Not Found',
                    message: 'Customer not found'
                });
            }

            res.render('customers/show', {
                title: customer.name,
                customer
            });
        } catch (error) {
            console.error('Error fetching customer:', error);
            res.status(500).render('error', {
                title: 'Error',
                message: 'Failed to fetch customer details',
                error: process.env.NODE_ENV === 'development' ? error : {}
            });
        }
    }

    static async create(req, res) {
        try {
            console.log('Accessing customer create route');
            res.render('customers/form', {
                title: 'New Customer',
                customer: null,
                error: null,
                success: null,
                formData: req.body // Preserve form data in case of validation errors
            });
        } catch (error) {
            console.error('Error rendering customer form:', error);
            res.status(500).render('customers/form', {
                title: 'New Customer',
                customer: null,
                error: {
                    message: 'Failed to load customer form'
                },
                success: null,
                formData: req.body
            });
        }
    }

    static async store(req, res) {
        try {
            const {
                name,
                tin,
                customerSince,
                status,
                // Address fields
                streetAddress,
                city,
                state,
                postalCode,
                country,
                // Contact fields
                contactName,
                contactPosition,
                contactEmail,
                contactPhone
            } = req.body;

            // Basic Information Validation
            if (!name || name.length < 2 || name.length > 100) {
                return res.render('customers/form', {
                    title: 'New Customer',
                    customer: null,
                    error: {
                        message: 'Please enter a valid customer name (2-100 characters)'
                    },
                    success: null,
                    formData: req.body
                });
            }

            // TIN Validation (if provided)
            if (tin && !tin.match(/^\d{3}-\d{3}-\d{3}$/)) {
                return res.render('customers/form', {
                    title: 'New Customer',
                    customer: null,
                    error: {
                        message: 'Please enter a valid TIN in the format: 123-456-789'
                    },
                    success: null,
                    formData: req.body
                });
            }

            // Address Validation
            if (!streetAddress || !city || !state || !postalCode) {
                return res.render('customers/form', {
                    title: 'New Customer',
                    customer: null,
                    error: {
                        message: 'Please fill in all required address fields'
                    },
                    success: null,
                    formData: req.body
                });
            }

            // Postal Code Validation
            if (!postalCode.match(/^\d{4}$/)) {
                return res.render('customers/form', {
                    title: 'New Customer',
                    customer: null,
                    error: {
                        message: 'Please enter a valid 4-digit postal code'
                    },
                    success: null,
                    formData: req.body
                });
            }

            // Contact Validation
            if (!contactName || contactName.length < 2 || contactName.length > 100) {
                return res.render('customers/form', {
                    title: 'New Customer',
                    customer: null,
                    error: {
                        message: 'Please enter a valid contact name (2-100 characters)'
                    },
                    success: null,
                    formData: req.body
                });
            }

            // Email Validation (if provided)
            if (contactEmail && !contactEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                return res.render('customers/form', {
                    title: 'New Customer',
                    customer: null,
                    error: {
                        message: 'Please enter a valid email address'
                    },
                    success: null,
                    formData: req.body
                });
            }

            // Create customer with transaction
            const result = await sequelize.transaction(async (t) => {
                // Create customer
                const customer = await Customer.create({
                    name,
                    tin,
                    customerSince: customerSince || new Date(),
                    status: status || 'active'
                }, { transaction: t });

                // Create default address
                await CustomerAddress.create({
                    customerId: customer.id,
                    addressType: 'main',
                    streetAddress,
                    city,
                    state,
                    postalCode,
                    country: country || 'Philippines',
                    isDefault: true
                }, { transaction: t });

                // Create primary contact
                await CustomerContact.create({
                    customerId: customer.id,
                    name: contactName,
                    position: contactPosition,
                    email: contactEmail,
                    phone: contactPhone,
                    isPrimary: true
                }, { transaction: t });

                return customer;
            });

            // Redirect with success message
            req.flash('success', 'Customer created successfully');
            res.redirect('/customers');
        } catch (error) {
            console.error('Error creating customer:', error);

            // Handle specific database errors
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.render('customers/form', {
                    title: 'New Customer',
                    customer: null,
                    error: {
                        message: 'A customer with this name or TIN already exists'
                    },
                    success: null,
                    formData: req.body
                });
            }

            if (error.name === 'SequelizeValidationError') {
                return res.render('customers/form', {
                    title: 'New Customer',
                    customer: null,
                    error: {
                        message: 'Please check your input and try again'
                    },
                    success: null,
                    formData: req.body
                });
            }

            res.render('customers/form', {
                title: 'New Customer',
                customer: null,
                error: {
                    message: 'An error occurred while creating the customer. Please try again.'
                },
                success: null,
                formData: req.body
            });
        }
    }

    static async edit(req, res) {
        try {
            const customer = await Customer.findByPk(req.params.id, {
                include: [
                    {
                        model: CustomerAddress,
                        required: false
                    },
                    {
                        model: CustomerContact,
                        required: false
                    }
                ]
            });

            if (!customer) {
                return res.status(404).render('error', {
                    title: 'Not Found',
                    message: 'Customer not found'
                });
            }

            res.render('customers/form', {
                title: 'Edit Customer',
                customer
            });
        } catch (error) {
            console.error('Error rendering customer edit form:', error);
            res.status(500).render('error', {
                title: 'Error',
                message: 'Failed to load customer edit form',
                error: process.env.NODE_ENV === 'development' ? error : {}
            });
        }
    }

    static async update(req, res) {
        try {
            const customer = await Customer.findByPk(req.params.id);
            if (!customer) {
                return res.status(404).render('error', {
                    title: 'Not Found',
                    message: 'Customer not found'
                });
            }

            const {
                name,
                tin,
                customerSince,
                status,
                // Address fields
                streetAddress,
                city,
                state,
                postalCode,
                country,
                // Contact fields
                contactName,
                contactPosition,
                contactEmail,
                contactPhone
            } = req.body;

            // Update customer
            await customer.update({
                name,
                tin,
                customerSince,
                status
            });

            // Update or create default address
            if (streetAddress && city && state && postalCode) {
                const defaultAddress = await CustomerAddress.findOne({
                    where: { customerId: customer.id, isDefault: true }
                });

                if (defaultAddress) {
                    await defaultAddress.update({
                        streetAddress,
                        city,
                        state,
                        postalCode,
                        country: country || 'Philippines'
                    });
                } else {
                    await CustomerAddress.create({
                        customerId: customer.id,
                        addressType: 'main',
                        streetAddress,
                        city,
                        state,
                        postalCode,
                        country: country || 'Philippines',
                        isDefault: true
                    });
                }
            }

            // Update or create primary contact
            if (contactName) {
                const primaryContact = await CustomerContact.findOne({
                    where: { customerId: customer.id, isPrimary: true }
                });

                if (primaryContact) {
                    await primaryContact.update({
                        name: contactName,
                        position: contactPosition,
                        email: contactEmail,
                        phone: contactPhone
                    });
                } else {
                    await CustomerContact.create({
                        customerId: customer.id,
                        name: contactName,
                        position: contactPosition,
                        email: contactEmail,
                        phone: contactPhone,
                        isPrimary: true
                    });
                }
            }

            res.redirect('/customers');
        } catch (error) {
            console.error('Error updating customer:', error);
            res.status(500).render('error', {
                title: 'Error',
                message: 'Failed to update customer',
                error: process.env.NODE_ENV === 'development' ? error : {}
            });
        }
    }

    static async destroy(req, res) {
        try {
            const customer = await Customer.findByPk(req.params.id);
            if (!customer) {
                return res.status(404).render('error', {
                    title: 'Not Found',
                    message: 'Customer not found'
                });
            }

            await customer.destroy();
            res.redirect('/customers');
        } catch (error) {
            console.error('Error deleting customer:', error);
            res.status(500).render('error', {
                title: 'Error',
                message: 'Failed to delete customer',
                error: process.env.NODE_ENV === 'development' ? error : {}
            });
        }
    }

    static async search(req, res) {
        try {
            const { query, type } = req.query;
            const searchField = type === 'tin' ? 'tin' : 'name';

            const customers = await Customer.findAll({
                where: {
                    [searchField]: {
                        [Op.like]: `%${query}%`
                    }
                },
                include: [
                    {
                        model: CustomerAddress,
                        where: { isDefault: true },
                        required: false
                    },
                    {
                        model: CustomerContact,
                        where: { isPrimary: true },
                        required: false
                    },
                    {
                        model: Order,
                        attributes: ['id', 'statusId', 'totalAmount'],
                        required: false
                    }
                ],
                order: [[searchField, 'ASC']]
            });

            const formattedCustomers = customers.map(customer => ({
                id: customer.id,
                name: customer.name,
                tin: customer.tin,
                customerSince: customer.customerSince,
                address: customer.CustomerAddresses[0],
                contact: customer.CustomerContacts[0],
                totalOrders: customer.Orders.length,
                pendingOrders: customer.Orders.filter(order => order.statusId !== 1).length
            }));

            res.json({ customers: formattedCustomers });
        } catch (error) {
            console.error('Error in search:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async searchSuggestions(req, res) {
        try {
            const { query, type } = req.query;
            const searchField = type === 'tin' ? 'tin' : 'name';

            const customers = await Customer.findAll({
                where: {
                    [searchField]: {
                        [Op.like]: `%${query}%`
                    }
                },
                limit: 10,
                order: [[searchField, 'ASC']]
            });

            const suggestions = customers.map(customer => ({
                label: `${customer[searchField]} ${type === 'tin' ? `(${customer.name})` : `(${customer.tin || 'No TIN'})`}`,
                value: customer[searchField],
                id: customer.id
            }));

            res.json({ suggestions });
        } catch (error) {
            console.error('Error in searchSuggestions:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = CustomerController; 