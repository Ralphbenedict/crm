# CRM Application

A Customer Relationship Management (CRM) application built with Node.js, Express, and EJS.

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

1. Create a `.env` file in the root directory
2. Add the following environment variables:
   ```
   PORT=3000
   NODE_ENV=development
   ```

## Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
crm/
├── public/
│   └── css/
│       └── style.css
├── views/
│   └── index.ejs
├── app.js
├── package.json
├── .env
└── README.md
```

## Features

- Express.js web server
- EJS templating engine
- Static file serving
- Environment variable configuration
- Modern responsive design 