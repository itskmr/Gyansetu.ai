const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
// Allow CORS for any localhost port and optional FRONTEND_URL
const { FRONTEND_URL } = process.env;
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile clients or server-to-server)
    if (!origin) return callback(null, true);
    // Allow the configured frontend URL
    if (FRONTEND_URL && origin === FRONTEND_URL) return callback(null, true);
    // Allow any http(s)://localhost:<port>
    if (/^https?:\/\/localhost:\d+$/.test(origin)) return callback(null, true);
    // Otherwise, block
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Database connection and server start
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    await sequelize.sync();
    console.log('Database synchronized successfully.');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer(); 