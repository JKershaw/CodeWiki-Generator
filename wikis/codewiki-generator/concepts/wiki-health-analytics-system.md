---
title: Wiki Health Analytics System
category: concept
sourceFile: lib/wiki-analytics.js
related: [components/link-graph-analysis.md]
created: 2025-11-24
updated: 2025-11-24
---

<h1>Wiki Health Analytics System</h1>
<h2>Purpose and Overview</h2>
<p>The Wiki Health Analytics System provides comprehensive health monitoring and statistical analysis for wiki documentation. It analyzes content quality, link connectivity, and maintenance needs to help teams identify orphaned pages, dead links, and overall documentation health patterns.</p>
<h2>Key Functionality</h2>
<p>The system performs several types of analysis:</p>
<ul>
<li><strong>Content Statistics</strong>: Calculates aggregate metrics including total pages, categories, tags, and content volume</li>
<li><strong>[Link Graph Analysis](../components/link-graph-analysis.md)</strong>: Maps internal link relationships to identify connectivity patterns and structural issues</li>
<li><strong>Page Health Metrics</strong>: Generates detailed metrics for individual pages including word count, link density, and heading structure</li>
<li><strong>Quality Indicators</strong>: Identifies orphaned pages (no incoming links) and dead links pointing to non-existent pages</li>
<li><strong>Temporal Analysis</strong>: Tracks update frequency patterns by month to understand maintenance activity</li>
</ul>
<p>The analytics engine processes wiki content by parsing both markdown and HTML links, normalizing link formats for comparison, and building a comprehensive connectivity graph. It provides both high-level dashboard metrics and detailed page-level insights.</p>
<h2>Relationships</h2>
<ul>
<li><strong>Depends on WikiManager</strong>: Uses WikiManager for page data access and retrieval of wiki content</li>
<li><strong>Extends Wiki System</strong>: Adds analytical layer on top of existing wiki functionality without modifying core operations  </li>
<li><strong>Data Provider</strong>: Supplies metrics data for dashboard enhancement features and health monitoring tools</li>
</ul>
<h2>Usage Example</h2>
<pre><code class="language-javascript">const WikiAnalytics = require(&#39;./lib/wiki-analytics&#39;);

const analytics = new WikiAnalytics(wikiManager);
const healthReport = analytics.analyzeWiki(&#39;project-name&#39;);

// Access comprehensive statistics
console.log(healthReport.statistics.totalPages);
console.log(healthReport.statistics.orphanedPages);

// Review individual page metrics
healthReport.pageMetrics.forEach(page =&gt; {
  console.log(`${page.path}: ${page.wordCount} words, ${page.incomingLinks} links`);
});
</code></pre>
<h2>Testing</h2>
<p>No automated tests are currently available for this component. Manual testing and validation of analytics accuracy is recommended when implementing.</p>
