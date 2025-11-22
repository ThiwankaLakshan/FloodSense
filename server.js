const express = require('express');
const cors = require('cors');
const scheduler = require('./services/scheduler');
const { timeStamp, error } = require('console');
const adminRoutes = require('./routes/admin');
const logger = require('./config/logger');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

//request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

const locationsRoutes = require('./routes/locations');
const weatherRoutes = require('./routes/weather');
const riskRoutes = require('./routes/risk');
const dashboardRoutes = require('./routes/dashboard');

app.use('/api/locations', locationsRoutes);
app.use('/api/locations',weatherRoutes);
app.use('/api/locations',riskRoutes);
app.use('/api/dashboard',dashboardRoutes);
app.use('/api/admin', adminRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Flood Alert System API',
    status: 'running',
    timestamp: new Date(),
    endpoints: [
      'GET /api/locations',
      'GET /api/locations/:id',
      'GET /API/locations/:id/weather-history',
      'GET /api/locations/:id/risk-history',
      'GET /api/locations/:id/summary'
    ]
   });
});

//health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
    });
});

//start scheduler
scheduler.start();

//404 handler
app.use(notFoundHandler);

//global error handler
app.use(errorHandler);

//handle uncought exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception: ',error);
  process.exit(1);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Weather data collection active`);
});