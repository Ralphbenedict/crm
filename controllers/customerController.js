const { Customer } = require('../models');
const { Order } = require('../models');

class CustomerController {
    static async index(req, res) {
        try {
            console.log('CustomerController.index: Starting to fetch customers');
            console.log('CustomerController.index: Success message from query:', req.query.success);

            const customers = await Customer.find()
                .sort({ name: 1 });

            console.log('CustomerController.index: Found customers:', customers.length);

            // Get order counts for each customer
            const customersWithOrders = await Promise.all(customers.map(async (customer) => {
                const customerObj = customer.toObject();
                // Find orders where customerName matches the customer's name
                const orders = await Order.find({
                    customerName: customer.name,
                    deletedAt: null // Only count non-deleted orders
                });

                customerObj.totalOrders = orders.length;
                customerObj.pendingOrders = orders.filter(order => order.statusId === 'pending').length;
                return customerObj;
            }));

            console.log('CustomerController.index: Fetched customers with orders:', customersWithOrders.length);
            console.log('CustomerController.index: First customer sample:', customersWithOrders.length > 0 ? JSON.stringify(customersWithOrders[0]) : 'No customers');

            res.render('customers/index', {
                title: 'Customers',
                customers: customersWithOrders || [],
                success: req.query.success || null
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
            const customer = await Customer.findById(req.params.id);
            if (!customer) {
                return res.status(404).render('error', {
                    title: 'Not Found',
                    message: 'Customer not found'
                });
            }

            // Get customer's orders
            const orders = await Order.find({ customerName: customer.name })
                .sort('-createdAt');

            res.render('customers/show', {
                title: customer.name,
                customer,
                orders
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
            console.log('CustomerController.create: Accessing customer create route');
            res.render('customers/form', {
                title: 'New Customer',
                customer: null,
                error: req.flash('error'),
                success: req.flash('success'),
                formData: req.body // Preserve form data in case of validation errors
            });
        } catch (error) {
            console.error('CustomerController.create: Error rendering customer form:', error);
            req.flash('error', 'Failed to load customer form');
            res.redirect('/customers');
        }
    }

    static async store(req, res) {
        try {
            console.log('CustomerController.store: Starting to create customer');
            console.log('CustomerController.store: Received form data:', req.body);

            // Extract data from request body
            const {
                name,
                tin,
                phoneNumber,
                suite,
                streetAddress,
                city,
                postalCode
            } = req.body;

            console.log('CustomerController.store: Extracted data:', {
                name, tin, phoneNumber, suite, streetAddress, city, postalCode
            });

            // Basic Information Validation
            if (!name || name.length < 2 || name.length > 100) {
                console.log('CustomerController.store: Name validation failed');
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
            if (tin) {
                // Remove any non-digit characters
                const cleanTin = tin.replace(/\D/g, '');

                // Check if we have exactly 9 digits
                if (cleanTin.length !== 9) {
                    console.log('CustomerController.store: TIN validation failed - incorrect length');
                    req.flash('error', 'Please enter a valid 9-digit TIN');
                    return res.redirect('/customers/create');
                }

                // Format the TIN as XXX-XXX-XXX
                const formattedTin = `${cleanTin.slice(0, 3)}-${cleanTin.slice(3, 6)}-${cleanTin.slice(6, 9)}`;
                req.body.tin = formattedTin; // Update the TIN in the request body
            }

            // Address Validation
            if (!streetAddress || !city || !postalCode) {
                console.log('CustomerController.store: Address validation failed');
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
                console.log('CustomerController.store: Postal code validation failed');
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

            // Create customer with simplified structure
            console.log('CustomerController.store: Creating new customer');
            const customer = new Customer({
                name,
                tin,
                customerSince: new Date(),
                status: 'active',
                address: {
                    streetAddress,
                    city,
                    state: 'N/A', // Default value
                    postalCode,
                    country: 'Philippines'
                },
                contact: {
                    name: name, // Use customer name as contact name
                    position: 'N/A',
                    email: '',
                    phone: phoneNumber || ''
                }
            });

            console.log('CustomerController.store: Customer object created:', customer);

            console.log('CustomerController.store: Saving customer');
            await customer.save();
            console.log('CustomerController.store: Customer saved successfully');

            // Set flash message and redirect
            console.log('CustomerController.store: Setting success flash message');
            req.flash('success', 'Customer created successfully');
            console.log('CustomerController.store: Redirecting to customers list');
            res.redirect('/customers');
        } catch (error) {
            console.error('CustomerController.store: Error creating customer:', error);

            // Handle specific database errors
            if (error.code === 11000) { // MongoDB duplicate key error
                req.flash('error', 'A customer with this name or TIN already exists');
                return res.redirect('/customers/create');
            }

            req.flash('error', 'An error occurred while creating the customer. Please try again.');
            res.redirect('/customers/create');
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