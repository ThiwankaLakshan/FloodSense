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



// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Flood Alert System API',
    status: 'running',
    timestamp: new Date()
   });
});

//health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
    });
});

app.use('/api/admin', adminRoutes);

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