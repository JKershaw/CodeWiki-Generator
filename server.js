/**
 * Express server for CodeWiki Generator Dashboard
 * Provides web interface for monitoring and controlling documentation generation
 */

require('dotenv').config();
const express = require('express');
const path = require('path');
const DashboardController = require('./lib/dashboard-controller');

// Initialize Express app
const app = express();

// Initialize controller
const dashboardController = new DashboardController();

// Configuration
const PORT = process.env.PORT || 3000;

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Dashboard routes
app.get('/', (req, res) => dashboardController.renderDashboard(req, res));
app.get('/api/status', (req, res) => dashboardController.getStatus(req, res));
app.post('/process/start', (req, res) => dashboardController.startProcessing(req, res));
app.post('/process/pause', (req, res) => dashboardController.pauseProcessing(req, res));
app.post('/process/step', (req, res) => dashboardController.processStep(req, res));
app.post('/process/batch', (req, res) => dashboardController.processBatch(req, res));
// Wiki page viewer - matches nested paths like /wiki/concepts/architecture
app.use('/wiki', (req, res, next) => {
  if (req.method !== 'GET') {
    return next();
  }
  dashboardController.renderWikiPage(req, res);
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server (only if not in test mode)
let server;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, () => {
    console.log(`CodeWiki Generator Dashboard running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = { app, server };
