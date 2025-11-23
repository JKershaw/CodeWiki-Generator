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
app.get('/api/projects', (req, res) => dashboardController.listProjects(req, res));
app.post('/api/context/research', (req, res) => dashboardController.researchContext(req, res));
app.post('/process/start', (req, res) => dashboardController.startProcessing(req, res));
app.post('/process/pause', (req, res) => dashboardController.pauseProcessing(req, res));
app.post('/process/step', (req, res) => dashboardController.processStep(req, res));
app.post('/process/batch', (req, res) => dashboardController.processBatch(req, res));

// Activity feed routes
app.get('/api/activity/feed', (req, res) => dashboardController.getActivityFeed(req, res));
app.get('/api/activity/history', (req, res) => dashboardController.getActivityHistory(req, res));
app.post('/api/activity/clear', (req, res) => dashboardController.clearActivityHistory(req, res));

// Wiki search API routes
app.get('/api/wiki/:project/search', (req, res) => dashboardController.searchWiki(req, res));
app.get(/^\/api\/wiki\/([^\/]+)\/toc\/(.+)$/, (req, res) => {
  req.params.project = req.params[0];
  req.params.page = req.params[1];
  dashboardController.getTableOfContents(req, res);
});
app.get(/^\/api\/wiki\/([^\/]+)\/related\/(.+)$/, (req, res) => {
  req.params.project = req.params[0];
  req.params.page = req.params[1];
  dashboardController.getRelatedPages(req, res);
});

// Planning routes
app.get('/planning', (req, res) => dashboardController.renderPlanning(req, res));
app.get('/api/planning/:project', (req, res) => dashboardController.getPlanningTasks(req, res));
app.post('/api/planning/:project/tasks', (req, res) => dashboardController.createPlanningTask(req, res));
app.put('/api/planning/:project/tasks/:id', (req, res) => dashboardController.updatePlanningTask(req, res));
app.delete('/api/planning/:project/tasks/:id', (req, res) => dashboardController.deletePlanningTask(req, res));

// Analytics routes
app.get('/analytics', (req, res) => dashboardController.renderAnalyticsDashboard(req, res));
app.get('/api/analytics/:project', (req, res) => dashboardController.getWikiAnalytics(req, res));

// Suggestion routes
app.get('/api/suggestions/:project', (req, res) => dashboardController.getSuggestions(req, res));
app.post('/api/suggestions/:project/generate', (req, res) => dashboardController.generateSuggestions(req, res));
app.post('/api/suggestions/:project/:id/apply', (req, res) => dashboardController.applySuggestion(req, res));
app.delete('/api/suggestions/:project/:id', (req, res) => dashboardController.dismissSuggestion(req, res));

// Project management routes
app.get('/projects', (req, res) => dashboardController.renderProjectsView(req, res));
app.post('/api/projects/create', (req, res) => dashboardController.createProject(req, res));
app.post('/api/projects/import', (req, res) => dashboardController.importProject(req, res));
app.delete('/api/projects/:project', (req, res) => dashboardController.deleteProject(req, res));
app.get('/api/projects/:project/settings', (req, res) => dashboardController.getProjectSettings(req, res));
app.put('/api/projects/:project/settings', (req, res) => dashboardController.updateProjectSettings(req, res));

// Comments routes
app.get('/api/comments/:project/:page', (req, res) => dashboardController.getPageComments(req, res));
app.post('/api/comments/:project/:page', (req, res) => dashboardController.addComment(req, res));
app.put('/api/comments/:project/:commentId', (req, res) => dashboardController.updateComment(req, res));
app.delete('/api/comments/:project/:commentId', (req, res) => dashboardController.deleteComment(req, res));
app.post('/api/comments/:project/:commentId/resolve', (req, res) => dashboardController.resolveComment(req, res));

// Git history routes
app.get(/^\/api\/history\/([^\/]+)\/(.+)\/statistics$/, (req, res) => {
  req.params.project = req.params[0];
  req.params.page = req.params[1];
  dashboardController.getPageStatistics(req, res);
});
app.get(/^\/api\/history\/commit\/([^\/]+)\/(.+)$/, (req, res) => {
  req.params.project = req.params[0];
  req.params.sha = req.params[1];
  dashboardController.getCommitDetails(req, res);
});
app.get(/^\/api\/history\/([^\/]+)\/(.+)$/, (req, res) => {
  req.params.project = req.params[0];
  req.params.page = req.params[1];
  dashboardController.getPageHistory(req, res);
});

// Wiki page routes
app.get(/^\/wiki\/([^\/]+)\/(.+)\/edit$/, (req, res) => {
  req.path = `/${req.params[0]}/${req.params[1]}/edit`;
  dashboardController.getWikiForEdit(req, res);
});
app.post(/^\/wiki\/([^\/]+)\/(.+)\/save$/, (req, res) => {
  req.path = `/${req.params[0]}/${req.params[1]}/save`;
  dashboardController.saveWikiEdit(req, res);
});
app.post('/wiki/:project/create', (req, res) => dashboardController.createWikiPage(req, res));

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
