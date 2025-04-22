# CRM System

A comprehensive Customer Relationship Management (CRM) system built with Node.js, Express, and SQLite. This system helps businesses manage customer orders, track payments, and analyze customer data using AI-powered insights.

## Features

- **Order Management**: Create, view, edit, and delete customer orders
- **Payment Tracking**: Monitor payment status and upload proof of payments
- **Customer Analytics**: AI-powered insights into customer behavior and opportunities
- **Cost Calculator**: Calculate costs for laser engraving and cutting services
- **Search & Filter**: Advanced search functionality for orders and customers
- **Responsive Design**: Mobile-friendly interface built with Bootstrap

## Project Structure

```
CRM/
├── config/                 # Configuration files
│   └── database.js        # Database configuration and connection
├── controllers/           # Request handlers
│   ├── OrderController.js # Order-related operations
│   └── CostController.js  # Cost calculation operations
├── models/                # Database models
│   ├── Order.js          # Order model
│   ├── OrderStatus.js    # Order status model
│   ├── OrderNote.js      # Order notes model
│   └── associations.js   # Model relationships
├── public/               # Static files
│   ├── css/             # Stylesheets
│   ├── js/              # Client-side JavaScript
│   └── uploads/         # Uploaded files
├── routes/              # Route definitions
│   ├── orderRoutes.js   # Order-related routes
│   └── customerRoutes.js # Customer-related routes
├── services/            # Business logic
│   └── aiService.js     # AI integration service
├── views/               # EJS templates
│   ├── orders/         # Order-related views
│   ├── customers/      # Customer-related views
│   └── partials/       # Reusable view components
├── scripts/            # Utility scripts
│   ├── list-orders.js  # List all orders
│   └── create-sample-order.js # Create sample data
├── app.js              # Application entry point
└── .env               # Environment variables
```

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: SQLite with Sequelize ORM
- **Frontend**: EJS templates, Bootstrap 5
- **AI Integration**: OpenAI API
- **File Handling**: Multer
- **Authentication**: (To be implemented)

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd CRM
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Initialize the database**
   ```bash
   node scripts/create-sample-order.js
   ```

5. **Start the application**
   ```bash
   npm start
   ```

6. **Access the application**
   Open your browser and navigate to `http://localhost:3001`

## API Documentation

### Order Management
- `GET /orders` - List all orders
- `GET /orders/create` - Show order creation form
- `POST /orders` - Create new order
- `GET /orders/:id` - View order details
- `GET /orders/:id/edit` - Show order edit form
- `POST /orders/:id` - Update order
- `POST /orders/:id/delete` - Delete order

### Search Functionality
- `GET /orders/search` - Search orders by customer name or SI number
- `GET /orders/search-suggestions` - Get search suggestions for autocomplete

### Cost Calculation
- `POST /api/cost/laser-engraving` - Calculate laser engraving costs
- `POST /api/cost/laser-cutting` - Calculate laser cutting costs
- `GET /api/materials` - Get available materials

## Development Guidelines

1. **Code Style**
   - Follow ESLint configuration
   - Use meaningful variable and function names
   - Add comments for complex logic

2. **Database**
   - Use migrations for schema changes
   - Follow naming conventions for tables and columns
   - Include proper indexes for frequently queried fields

3. **Security**
   - Validate all user inputs
   - Sanitize database queries
   - Implement proper error handling
   - Use environment variables for sensitive data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 