---
title: Web dashboard control interface
category: component
sourceFile: lib/dashboard-controller.js
related: [components/dashboard-controller.md]
created: 2025-11-23
updated: 2025-11-23
---

<h1>Web Dashboard Control Interface</h1>
<h2>Purpose and Overview</h2>
<p>The <code>[DashboardController](../components/dashboard-controller.md)</code> provides a web-based interface and HTTP API for controlling the wiki generation process. It allows users to start, pause, and monitor repository processing through a browser interface, with granular controls for step-by-step processing and batch operations.</p>
<h2>Key Functionality</h2>
<p>The dashboard controller offers comprehensive control over the wiki generation pipeline:</p>
<ul>
<li><strong>Web Interface</strong>: Renders a dashboard view showing current processing state and controls</li>
<li><strong>Processing Control</strong>: Start, pause, and monitor repository processing with real-time status updates</li>
<li><strong>Granular Processing</strong>: Execute single commit processing steps for debugging and cost management</li>
<li><strong>Batch Operations</strong>: Process specified numbers of commits in controlled batches</li>
<li><strong>Wiki Serving</strong>: Serves generated wiki pages through the web interface</li>
<li><strong>Input Validation</strong>: Validates GitHub repository URLs before processing</li>
</ul>
<p>The controller provides both HTML views for human users and JSON API endpoints for programmatic access. It maintains processing state and integrates background execution with user controls.</p>
<h2>Relationships</h2>
<p>The <code>[DashboardController](../components/dashboard-controller.md)</code> serves as the orchestration layer that connects:</p>
<ul>
<li><strong>Processor</strong>: Controls the core repository processing engine</li>
<li><strong>StateManager</strong>: Manages and persists processing state across operations</li>
<li><strong>WikiManager</strong>: Handles wiki page generation and serving</li>
<li><strong>Web Layer</strong>: Provides HTTP endpoints and renders user interface views</li>
</ul>
<p>It acts as the primary integration point between the user interface and the underlying processing components, translating user actions into system operations.</p>
<h2>Usage Example</h2>
<pre><code class="language-javascript">const [DashboardController](../components/dashboard-controller.md) = require(&#39;./lib/dashboard-controller&#39;);

// Initialize controller with required dependencies
const controller = new [DashboardController](../components/dashboard-controller.md)({
  processor: processorInstance,
  stateManager: stateManagerInstance,
  wikiManager: wikiManagerInstance
});

// Get current processing status
const status = await controller.getStatus();

// Start processing a repository
await controller.startProcessing(&#39;https://github.com/owner/repo&#39;);

// Process single step for debugging
await controller.processStep();

// Process batch of commits
await controller.processBatch(5);
</code></pre>
<h2>Testing</h2>
<p>No automated tests found for this component.</p>
