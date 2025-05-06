# Gyansetu Backend

This is the backend server for the Gyansetu application, built with Node.js, Express, and PostgreSQL.

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (via Neon.tech)
- npm or yarn

## Setup

1. Clone the repository
2. Navigate to the server directory:
   ```bash
   cd server
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory and copy the contents from `.env.example`
5. Update the environment variables in `.env` with your actual values:
   - Database credentials from Neon.tech
   - JWT secret
   - Frontend URL
   - Other configuration values

## Database Setup

The application uses Neon.tech PostgreSQL database. Make sure to:
1. Create a database in Neon.tech
2. Get the connection string
3. Update the DATABASE_URL in your .env file

## Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication

- POST `/api/auth/signup`
  - Register a new user
  - Required fields: email, phone, password, role
  - Optional fields: firstName, lastName

- POST `/api/auth/login`
  - Login a user
  - Required fields: email, password, role

## Security

- Password hashing using bcrypt
- JWT for authentication
- Input validation using express-validator
- CORS protection
- Environment variables for sensitive data

## Error Handling

The API includes comprehensive error handling for:
- Validation errors
- Authentication errors
- Database errors
- Server errors 