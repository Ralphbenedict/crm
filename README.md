# CRM System

A Customer Relationship Management system built with Node.js, Express, and EJS.

## Features

- Customer management
- Order tracking
- File uploads
- Search functionality
- Status tracking

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example`
4. Start the server: `npm start`

## Deployment to Vercel

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy!

### Environment Variables

Make sure to set these environment variables in your Vercel dashboard:

- `DB_HOST`: Your database host
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name
- `DB_PORT`: Database port
- `SESSION_SECRET`: A secret key for session management
- `NODE_ENV`: Set to 'production' for production environment

## Database Setup

The application uses Sequelize ORM with MySQL. Make sure your database is properly configured before deploying.

## License

MIT 