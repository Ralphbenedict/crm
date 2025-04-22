require('dotenv').config();

module.exports = {
    // Database configuration
    database: {
        dialect: 'sqlite',
        storage: './database.sqlite',
        logging: false
    },

    // OpenAI configuration
    openai: {
        apiKey: process.env.OPENAI_API_KEY
    },

    // Server configuration
    server: {
        port: process.env.PORT || 3000
    },

    // File upload configuration
    upload: {
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png', 'application/pdf']
    }
}; 