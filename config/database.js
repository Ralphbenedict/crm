const { Sequelize } = require('sequelize');
require('dotenv').config();

// Database configuration using SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
        timestamps: true,
        underscored: true
    }
});

// Test database connection
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
        return true;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        return false;
    }
};

// Handle process termination
process.on('SIGINT', async () => {
    try {
        await sequelize.close();
        console.log('Database connection closed through app termination');
        process.exit(0);
    } catch (err) {
        console.error('Error closing database connection:', err);
        process.exit(1);
    }
});

module.exports = {
    sequelize,
    testConnection
}; 
