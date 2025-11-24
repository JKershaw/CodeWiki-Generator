---
title: Project-scoped resource management
category: concept
sourceFile: lib/dashboard-controller.js
related: [concepts/multi-service-dashboard-architecture.md, concepts/activity-driven-event-system.md]
created: 2025-11-24
updated: 2025-11-24
---

<h1>Project-scoped Resource Management</h1>
<h2>Purpose and Overview</h2>
<p>Project-scoped resource management establishes a multi-tenant architecture pattern where all dashboard services operate within isolated project contexts. This enables the wiki system to support multiple independent projects while maintaining clean separation of resources, data, and configurations across different project environments.</p>
<h2>Key Functionality</h2>
<p>The project-scoped resource management pattern provides:</p>
<ul>
<li><strong>Service Isolation</strong>: All dashboard services (WikiContextService, WikiSearchService, PlanningManager, SuggestionEngine, etc.) operate within specific project boundaries</li>
<li><strong>Multi-tenant Support</strong>: Each project maintains its own isolated set of resources including wiki content, analytics data, planning tasks, and user comments</li>
<li><strong>Contextual Operations</strong>: Services automatically scope their operations to the current project context, preventing cross-project data leakage</li>
<li><strong>Unified Project Interface</strong>: The ProjectManager service coordinates project lifecycle operations including creation, configuration, and metadata management</li>
<li><strong>Resource Coordination</strong>: All 10+ specialized services maintain consistent project-scoped behavior through the dashboard controller&#39;s orchestration</li>
</ul>
<p>The pattern ensures that when users switch between projects or work on multiple projects simultaneously, each project&#39;s resources remain completely isolated while providing the same full feature set across all project contexts.</p>
<h2>Relationships</h2>
<ul>
<li><strong>Integrates with [Multi-service Dashboard Architecture](../concepts/multi-service-dashboard-architecture.md)</strong>: Provides the scoping mechanism that enables multiple specialized services to coexist safely</li>
<li><strong>Coordinates with [Activity-driven Event System](../concepts/activity-driven-event-system.md)</strong>: Ensures activity events are properly attributed to specific projects</li>
<li><strong>Extends WikiManager Integration</strong>: Builds upon existing project structure to provide consistent scoping across all new dashboard services</li>
<li><strong>Connects to StateManager</strong>: Maintains project-specific persistent state across all dashboard services</li>
<li><strong>Links to Processor</strong>: Ensures repository processing operations respect project boundaries</li>
</ul>
<h2>Usage Example</h2>
<pre><code class="language-javascript">const DashboardController = require(&#39;./lib/dashboard-controller&#39;);

// Initialize dashboard with project context
const dashboard = new DashboardController({ projectId: &#39;my-wiki-project&#39; });

// All services automatically operate within project scope
const searchResults = await dashboard.wikiSearchService.search(query);
const analytics = await dashboard.wikiAnalytics.getProjectStats();
const tasks = await dashboard.planningManager.getTasks();
</code></pre>
<h2>Testing</h2>
<p>No automated tests found for this component. Testing should focus on verifying project isolation boundaries and ensuring services cannot access resources from other project contexts.</p>
