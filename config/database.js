const { Sequelize } = require('sequelize');
const path = require('path');

// Create Sequelize instance
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../database.sqlite'),
    logging: false // Set to console.log to see SQL queries
});

// Test the connection
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

// Initialize database and create tables
async function initDatabase() {
    try {
        await sequelize.sync({ alter: true });
        console.log('Database synchronized successfully.');
    } catch (error) {
        console.error('Error synchronizing database:', error);
    }
}

module.exports = sequelize; 