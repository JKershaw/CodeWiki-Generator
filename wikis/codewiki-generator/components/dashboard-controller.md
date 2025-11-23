---
title: DashboardController
category: component
sourceFile: server.js
related: [components/wiki-integration.md]
created: 2025-11-23
updated: 2025-11-23
---

<h1>DashboardController</h1>
<h2>Purpose and Overview</h2>
<p>The DashboardController is the primary web interface controller that transforms the application from CLI-only to web-accessible. It provides a centralized dashboard for system monitoring and control, enabling users to manage processing operations through a browser interface.</p>
<h2>Key Functionality</h2>
<p>The DashboardController handles all dashboard-related HTTP routes and business logic through several key capabilities:</p>
<p><strong>Web Interface Management</strong></p>
<ul>
<li>Renders the main dashboard interface at the root path</li>
<li>Provides real-time system status through API endpoints</li>
<li>Serves as the primary entry point for web-based operations</li>
</ul>
<p><strong>Processing Control</strong></p>
<ul>
<li><strong>Start/Pause Operations</strong>: Initiates and pauses processing operations via web interface</li>
<li><strong>Step Processing</strong>: Executes single processing steps for granular control</li>
<li><strong>Batch Processing</strong>: Handles multiple items in batch mode for efficient bulk operations</li>
</ul>
<p><strong><a href="../components/wiki-integration.md">[Wiki Integration](../components/wiki-integration.md)</a></strong></p>
<ul>
<li>Renders wiki pages through nested URL patterns (e.g., <code>/wiki/concepts/architecture</code>)</li>
<li>Integrates documentation viewing directly within the dashboard interface</li>
<li>Provides seamless navigation between operational controls and documentation</li>
</ul>
<h2>Relationships</h2>
<p>The DashboardController connects several system components:</p>
<ul>
<li><strong>Health Check Integration</strong>: Builds upon existing health check endpoints to provide system status</li>
<li><strong>Wiki System</strong>: Connects the documentation viewing system with the dashboard interface</li>
<li><strong>CLI Functionality</strong>: Provides web access to processing operations previously only available through command line</li>
<li><strong>Static File Serving</strong>: Works with Express middleware for serving dashboard assets and views</li>
</ul>
<h2>Usage Example</h2>
<pre><code class="language-javascript">// Dashboard controller handles Express routes
app.get(&#39;/&#39;, dashboardController.renderDashboard);
app.get(&#39;/status&#39;, dashboardController.getStatus);
app.post(&#39;/start&#39;, dashboardController.startProcessing);
app.post(&#39;/pause&#39;, dashboardController.pauseProcessing);
app.post(&#39;/step&#39;, dashboardController.processStep);
app.post(&#39;/batch&#39;, dashboardController.processBatch);
app.get(&#39;/wiki/*&#39;, dashboardController.renderWikiPage);
</code></pre>
<h2>Testing</h2>
<p><strong>Test Coverage</strong>: <code>tests/integration/server.test.js</code></p>
<ul>
<li>11 test cases across 6 test suites</li>
<li><strong>Test Categories</strong>: Express Server, Health Check, Static File Serving, View Engine, Error Handling, Middleware Configuration</li>
<li>Comprehensive integration testing ensures dashboard functionality works correctly with the Express server infrastructure</li>
</ul>
